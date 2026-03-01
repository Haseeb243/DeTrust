import { prisma } from '../config/database';
import { sendEmail } from '../services/email.service';

/**
 * Email notification background job.
 * Processes pending email notifications on an interval.
 *
 * Checks for recent unread notifications and sends email
 * digests to users who have email addresses configured.
 */

let emailJobInterval: ReturnType<typeof setInterval> | null = null;

// Run every 15 minutes
const EMAIL_JOB_INTERVAL_MS = 15 * 60 * 1000;

async function processEmailNotifications(): Promise<void> {
  try {
    // Find users with unread notifications from the last interval
    // who have an email address and haven't been emailed recently
    const cutoff = new Date(Date.now() - EMAIL_JOB_INTERVAL_MS);

    const unreadNotifications = await prisma.notification.findMany({
      where: {
        read: false,
        createdAt: { gte: cutoff },
        user: {
          email: { not: null },
          status: 'ACTIVE',
        },
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by user
    const byUser = new Map<string, typeof unreadNotifications>();
    for (const notif of unreadNotifications) {
      const userId = notif.userId;
      if (!byUser.has(userId)) {
        byUser.set(userId, []);
      }
      byUser.get(userId)!.push(notif);
    }

    // Send digest email for each user
    for (const [, notifications] of byUser) {
      const user = notifications[0].user;
      if (!user.email) continue;

      const name = user.name ?? 'there';
      const count = notifications.length;
      const subject = `DeTrust: You have ${count} new notification${count > 1 ? 's' : ''}`;

      const items = notifications
        .slice(0, 5)
        .map((n: { title: string; message: string }) => `<li style="margin-bottom:8px;color:#3f3f46;">${n.title}: ${n.message}</li>`)
        .join('');

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;font-family:Inter,Arial,sans-serif;background:#f4f4f5;">
  <div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
    <div style="background:#18181b;padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;">🛡️ DeTrust</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#18181b;margin:0 0 16px;">Hi ${name}!</h2>
      <p style="color:#3f3f46;line-height:1.6;">You have ${count} new notification${count > 1 ? 's' : ''}:</p>
      <ul style="padding-left:20px;">${items}</ul>
      ${count > 5 ? `<p style="color:#71717a;font-size:14px;">...and ${count - 5} more</p>` : ''}
    </div>
  </div>
</body>
</html>`;

      await sendEmail({ to: user.email, subject, html });
    }

    if (byUser.size > 0) {
      console.log(`📧 [EmailJob] Sent digest emails to ${byUser.size} user(s)`);
    }
  } catch (error) {
    console.error('❌ [EmailJob] Error processing email notifications:', error);
  }
}

export function startEmailJob(): void {
  console.log('📧 Email notification job started (every 15 min)');
  emailJobInterval = setInterval(processEmailNotifications, EMAIL_JOB_INTERVAL_MS);
  // Run once immediately
  processEmailNotifications();
}

export function stopEmailJob(): void {
  if (emailJobInterval) {
    clearInterval(emailJobInterval);
    emailJobInterval = null;
    console.log('📧 Email notification job stopped');
  }
}
