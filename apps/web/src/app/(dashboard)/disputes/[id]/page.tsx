'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Clock,
  FileText,
  User,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Textarea } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import type { DisputeVote } from '@detrust/types';
import { useDispute, useCastVote, useAdminResolve, useStartVoting, useJurorEligibility } from '@/hooks/queries/use-disputes';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

interface DisputeContract {
  id: string;
  title: string;
  totalAmount: number;
  clientId?: string;
  freelancerId?: string;
  client?: { id: string; name: string | null; avatarUrl: string | null };
  freelancer?: { id: string; name: string | null; avatarUrl: string | null };
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  OPEN: { icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Open' },
  VOTING: { icon: <Scale className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Voting' },
  RESOLVED: { icon: <CheckCircle2 className="h-4 w-4" />, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Resolved' },
  APPEALED: { icon: <Clock className="h-4 w-4" />, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Appealed' },
};

const outcomeLabels: Record<string, string> = {
  PENDING: 'Pending',
  CLIENT_WINS: 'Client Wins',
  FREELANCER_WINS: 'Freelancer Wins',
  SPLIT: 'Split Decision',
};

export default function DisputeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const disputeId = params.id as string;

  const { data: dispute, isLoading } = useDispute(disputeId);
  const { data: eligibility } = useJurorEligibility(disputeId);
  const castVoteMutation = useCastVote();
  const adminResolveMutation = useAdminResolve();
  const startVotingMutation = useStartVoting();

  const [voteChoice, setVoteChoice] = useState<'CLIENT_WINS' | 'FREELANCER_WINS' | ''>('');
  const [reasoning, setReasoning] = useState('');
  const [resolution, setResolution] = useState('');
  const [resolveOutcome, setResolveOutcome] = useState<'CLIENT_WINS' | 'FREELANCER_WINS' | 'SPLIT'>('CLIENT_WINS');

  const isAdmin = user?.role === 'ADMIN';
  const disputeContract = dispute?.contract as DisputeContract | undefined;
  const isParty = disputeContract
    && (user?.id === disputeContract.clientId || user?.id === disputeContract.freelancerId);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <Shield className="mb-4 h-12 w-12 text-dt-text-muted opacity-40" />
        <h2 className="text-lg font-medium text-dt-text">Dispute not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/disputes')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Disputes
        </Button>
      </div>
    );
  }

  const status = statusConfig[dispute.status] ?? statusConfig.OPEN;
  const contract = dispute.contract as DisputeContract;

  const handleCastVote = async () => {
    if (!voteChoice) {
      toast.error('Please select a vote');
      return;
    }
    const res = await castVoteMutation.mutateAsync({
      disputeId,
      input: { vote: voteChoice, reasoning: reasoning || undefined },
    });
    if (res.success) {
      toast.success('Vote cast successfully');
      setVoteChoice('');
      setReasoning('');
    } else {
      toast.error(res.error?.message ?? 'Failed to cast vote');
    }
  };

  const handleAdminResolve = async () => {
    if (resolution.length < 10) {
      toast.error('Resolution must be at least 10 characters');
      return;
    }
    const res = await adminResolveMutation.mutateAsync({
      disputeId,
      input: { outcome: resolveOutcome, resolution },
    });
    if (res.success) {
      toast.success('Dispute resolved');
    } else {
      toast.error(res.error?.message ?? 'Failed to resolve dispute');
    }
  };

  const handleStartVoting = async () => {
    const res = await startVotingMutation.mutateAsync(disputeId);
    if (res.success) {
      toast.success('Voting phase started');
    } else {
      toast.error(res.error?.message ?? 'Failed to start voting');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button + Header */}
      <div>
        <button
          onClick={() => router.push('/disputes')}
          className="mb-3 flex items-center gap-1 text-sm text-dt-text-muted hover:text-dt-text"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Disputes
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-dt-text">
            Dispute: {contract?.title ?? 'Unknown Contract'}
          </h1>
          <Badge className={cn('flex items-center gap-1', status.color)}>
            {status.icon}
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-dt-border bg-dt-surface">
          <CardContent className="p-4">
            <p className="text-xs text-dt-text-muted">Contract Value</p>
            <p className="mt-1 text-xl font-semibold text-dt-text">
              ${contract?.totalAmount ? Number(contract.totalAmount).toLocaleString() : '—'}
            </p>
          </CardContent>
        </Card>
        <Card className="border-dt-border bg-dt-surface">
          <CardContent className="p-4">
            <p className="text-xs text-dt-text-muted">Outcome</p>
            <p className="mt-1 text-xl font-semibold text-dt-text">
              {outcomeLabels[dispute.outcome] ?? 'Pending'}
            </p>
          </CardContent>
        </Card>
        <Card className="border-dt-border bg-dt-surface">
          <CardContent className="p-4">
            <p className="text-xs text-dt-text-muted">Client Votes</p>
            <p className="mt-1 text-xl font-semibold text-blue-600">{dispute.clientVotes}</p>
          </CardContent>
        </Card>
        <Card className="border-dt-border bg-dt-surface">
          <CardContent className="p-4">
            <p className="text-xs text-dt-text-muted">Freelancer Votes</p>
            <p className="mt-1 text-xl font-semibold text-emerald-600">{dispute.freelancerVotes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Dispute Details */}
      <Card className="border-dt-border bg-dt-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-dt-text">
            <FileText className="h-5 w-5" /> Dispute Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-dt-text-muted">Reason</p>
            <p className="mt-1 text-dt-text">{dispute.reason}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-dt-text-muted">Description</p>
            <p className="mt-1 whitespace-pre-wrap text-dt-text">{dispute.description}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-dt-text-muted">
            <span>Filed: {new Date(dispute.createdAt).toLocaleDateString()}</span>
            {dispute.votingDeadline && (
              <span>Voting Deadline: {new Date(dispute.votingDeadline).toLocaleDateString()}</span>
            )}
            {dispute.resolvedAt && (
              <span>Resolved: {new Date(dispute.resolvedAt).toLocaleDateString()}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Parties */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-dt-border bg-dt-surface">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-dt-text-muted">Client</p>
              <p className="font-medium text-dt-text">{contract?.client?.name ?? '—'}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dt-border bg-dt-surface">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-dt-text-muted">Freelancer</p>
              <p className="font-medium text-dt-text">{contract?.freelancer?.name ?? '—'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence */}
      {dispute.evidence && dispute.evidence.length > 0 && (
        <Card className="border-dt-border bg-dt-surface">
          <CardHeader>
            <CardTitle className="text-dt-text">Evidence ({dispute.evidence.length} files)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dispute.evidence.map((url: string, idx: number) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-dt-border p-3 text-sm text-blue-600 transition hover:bg-dt-surface-alt dark:text-blue-400"
                >
                  <FileText className="h-4 w-4" />
                  Evidence file {idx + 1}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Votes */}
      {dispute.votes && dispute.votes.length > 0 && (
        <Card className="border-dt-border bg-dt-surface">
          <CardHeader>
            <CardTitle className="text-dt-text">Votes ({dispute.votes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dispute.votes.map((vote: DisputeVote) => (
                <div
                  key={vote.id}
                  className="flex items-start justify-between rounded-lg border border-dt-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-dt-text">
                      {vote.juror?.name ?? 'Anonymous Juror'}
                    </p>
                    {vote.reasoning && (
                      <p className="mt-1 text-sm text-dt-text-muted">{vote.reasoning}</p>
                    )}
                  </div>
                  <Badge
                    className={cn(
                      'text-xs',
                      vote.vote === 'CLIENT_WINS'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    )}
                  >
                    {outcomeLabels[vote.vote]} (×{vote.weight})
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vote Panel (for non-parties during VOTING) */}
      {dispute.status === 'VOTING' && !isParty && (
        <Card className="border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-dt-text">
              <Scale className="h-5 w-5 text-blue-500" /> Cast Your Vote
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Juror eligibility check (M4-I5) */}
            {eligibility && !eligibility.eligible && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-amber-800 dark:text-amber-300">Not eligible to vote</p>
                    {!eligibility.meetsScoreRequirement && (
                      <p className="text-amber-700 dark:text-amber-400">
                        Your trust score ({eligibility.trustScore.toFixed(1)}) is below the minimum
                        required ({eligibility.minimumRequired}). Build your reputation to participate
                        in dispute resolution.
                      </p>
                    )}
                    {eligibility.hasVoted && (
                      <p className="text-amber-700 dark:text-amber-400">You have already voted on this dispute.</p>
                    )}
                    {!eligibility.withinDeadline && (
                      <p className="text-amber-700 dark:text-amber-400">The voting deadline has passed.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {(!eligibility || eligibility.eligible) && (
              <>
                <div className="flex gap-3">
                  <Button
                    variant={voteChoice === 'CLIENT_WINS' ? 'default' : 'outline'}
                    onClick={() => setVoteChoice('CLIENT_WINS')}
                    className={cn(
                      voteChoice === 'CLIENT_WINS' && 'bg-blue-600 text-white hover:bg-blue-700'
                    )}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" /> Client Wins
                  </Button>
                  <Button
                    variant={voteChoice === 'FREELANCER_WINS' ? 'default' : 'outline'}
                    onClick={() => setVoteChoice('FREELANCER_WINS')}
                    className={cn(
                      voteChoice === 'FREELANCER_WINS' && 'bg-emerald-600 text-white hover:bg-emerald-700'
                    )}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" /> Freelancer Wins
                  </Button>
                </div>
                <Textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Optional: explain your reasoning..."
                  rows={3}
                  className="border-dt-border"
                />
                <Button
                  onClick={handleCastVote}
                  disabled={!voteChoice || castVoteMutation.isPending}
                >
                  {castVoteMutation.isPending ? <Spinner size="sm" /> : 'Submit Vote'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Admin Actions */}
      {isAdmin && dispute.status !== 'RESOLVED' && (
        <Card className="border-amber-200 bg-amber-50/30 dark:border-amber-800 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-dt-text">
              <Shield className="h-5 w-5 text-amber-500" /> Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dispute.status === 'OPEN' && (
              <Button
                onClick={handleStartVoting}
                disabled={startVotingMutation.isPending}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {startVotingMutation.isPending ? <Spinner size="sm" /> : 'Start Voting Phase'}
              </Button>
            )}

            <div className="border-t border-dt-border pt-4">
              <p className="mb-3 text-sm font-medium text-dt-text">Direct Resolution</p>
              <div className="space-y-3">
                <select
                  value={resolveOutcome}
                  onChange={(e) => setResolveOutcome(e.target.value as typeof resolveOutcome)}
                  className="w-full rounded-lg border border-dt-border bg-dt-surface px-3 py-2 text-sm text-dt-text"
                >
                  <option value="CLIENT_WINS">Client Wins</option>
                  <option value="FREELANCER_WINS">Freelancer Wins</option>
                  <option value="SPLIT">Split Decision</option>
                </select>
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Explain the resolution (min 10 chars)..."
                  rows={3}
                  className="border-dt-border"
                />
                <Button
                  onClick={handleAdminResolve}
                  disabled={resolution.length < 10 || adminResolveMutation.isPending}
                  className="bg-amber-600 text-white hover:bg-amber-700"
                >
                  {adminResolveMutation.isPending ? <Spinner size="sm" /> : 'Resolve Dispute'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resolution result */}
      {dispute.status === 'RESOLVED' && dispute.resolution && (
        <Card className="border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" /> Resolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm font-medium text-dt-text">
              Outcome: {outcomeLabels[dispute.outcome] ?? dispute.outcome}
            </p>
            <p className="whitespace-pre-wrap text-sm text-dt-text-muted">{dispute.resolution}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
