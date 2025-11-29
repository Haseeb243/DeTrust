"use client";

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'sonner';
import { FileText, ShieldCheck, Trash2, UploadCloud, Wand2 } from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { uploadApi, userApi, type CertificationEntry, type FreelancerProfile } from '@/lib/api';
import { openSecureFileInNewTab } from '@/lib/secure-files';
import { useAuthStore } from '@/store';

const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024; // 8 MB client-side guard
const ACCEPTED_DOC_TYPES = 'application/pdf,image/png,image/jpeg,image/webp';

interface FreelancerDocumentsCardProps {
  profile?: FreelancerProfile | null;
  onResumeUpdated?: (resumeUrl: string | null) => void;
  onCertificationAdded?: (certification: CertificationEntry) => void;
  onCertificationRemoved?: (certificationId: string) => void;
}

interface CertificationFormState {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
}

const initialCertForm: CertificationFormState = {
  name: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
};

export function FreelancerDocumentsCard({ profile, onResumeUpdated, onCertificationAdded, onCertificationRemoved }: FreelancerDocumentsCardProps) {
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [isResumeDeleting, setIsResumeDeleting] = useState(false);
  const [isCertUploading, setIsCertUploading] = useState(false);
  const [resumeAction, setResumeAction] = useState<'view' | 'download' | null>(null);
  const [certPreviewId, setCertPreviewId] = useState<string | null>(null);
  const [removingCertificationId, setRemovingCertificationId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState(initialCertForm);
  const [certFile, setCertFile] = useState<File | null>(null);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  const token = useAuthStore((state) => state.token);

  const resumeUrl = profile?.resumeUrl ?? '';
  const certifications = profile?.certifications ?? [];

  const resumeCta = resumeUrl ? 'Replace resume' : 'Upload resume';
  const certificationCountLabel = useMemo(() => {
    if (!certifications.length) return 'No certifications yet';
    return `${certifications.length} certification${certifications.length > 1 ? 's' : ''}`;
  }, [certifications.length]);

  const requireToken = () => {
    if (!token) {
      toast.error('Sign back in to open encrypted documents.');
      return false;
    }
    return true;
  };

  const openResume = async (action: 'view' | 'download') => {
    if (!resumeUrl) return;
    if (!requireToken()) return;

    try {
      setResumeAction(action);
      await openSecureFileInNewTab(resumeUrl, {
        token: token!,
        download: action === 'download',
        fallbackName: action === 'download' ? 'resume.pdf' : undefined,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to open resume');
    } finally {
      setResumeAction(null);
    }
  };

  const openCertification = async (credentialUrl: string, certificationId?: string) => {
    if (!requireToken()) return;

    try {
      setCertPreviewId(certificationId ?? credentialUrl);
      await openSecureFileInNewTab(credentialUrl, {
        token: token!,
        fallbackName: 'certification.pdf',
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to open certification');
    } finally {
      setCertPreviewId(null);
    }
  };

  const triggerResumeDialog = () => resumeInputRef.current?.click();
  const triggerCertDialog = () => certInputRef.current?.click();

  const handleResumeChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_DOCUMENT_BYTES) {
      toast.error('Resume must be 8 MB or smaller.');
      return;
    }

    setIsResumeUploading(true);
    const response = await uploadApi.uploadResume(file);
    setIsResumeUploading(false);

    if (!response.success || !response.data) {
      toast.error(response.error?.message || 'Resume upload failed');
      return;
    }

    toast.success('Resume encrypted & stored');
    onResumeUpdated?.(response.data.resumeUrl ?? response.data.url);
  };

  const handleResumeDelete = async () => {
    if (!resumeUrl || typeof window === 'undefined') return;
    if (!window.confirm('Remove your encrypted resume from this profile?')) {
      return;
    }

    setIsResumeDeleting(true);
    const response = await userApi.updateFreelancerProfile({ resumeUrl: null });
    setIsResumeDeleting(false);

    if (!response.success) {
      toast.error(response.error?.message || 'Unable to delete resume');
      return;
    }

    toast.success('Resume removed');
    onResumeUpdated?.(null);
  };

  const handleCertFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_DOCUMENT_BYTES) {
      toast.error('Certification files must be 8 MB or smaller.');
      return;
    }
    setCertFile(file);
  };

  const handleCertFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCertForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitCertification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!certFile) {
      toast.error('Attach a credential document before submitting.');
      return;
    }
    if (!certForm.name.trim() || !certForm.issuer.trim()) {
      toast.error('Certification name and issuer are required.');
      return;
    }

    setIsCertUploading(true);
    const response = await uploadApi.uploadCertification(certFile, {
      name: certForm.name.trim(),
      issuer: certForm.issuer.trim(),
      issueDate: certForm.issueDate || undefined,
      expiryDate: certForm.expiryDate || undefined,
      credentialId: certForm.credentialId.trim() || undefined,
    });
    setIsCertUploading(false);

    if (!response.success || !response.data) {
      toast.error(response.error?.message || 'Certification upload failed');
      return;
    }

    toast.success('Certification secured on Lighthouse');
    onCertificationAdded?.(response.data.certification);
    setCertFile(null);
    setCertForm(initialCertForm);
  };

  const handleCertificationDelete = async (certificationId: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Delete this credential?')) {
      return;
    }

    setRemovingCertificationId(certificationId);
    const response = await userApi.removeCertification(certificationId);
    setRemovingCertificationId(null);

    if (!response.success) {
      toast.error(response.error?.message || 'Unable to delete credential');
      return;
    }

    toast.success('Credential deleted');
    onCertificationRemoved?.(certificationId);
  };

  return (
    <Card
      id="documents"
      className="relative overflow-hidden border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white text-slate-900 shadow-[0_25px_80px_rgba(16,185,129,0.12)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.18),_transparent_65%)]" />
      </div>
      <CardHeader className="relative z-10 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="text-xl font-semibold tracking-tight text-slate-900">Secure credentials vault</CardTitle>
          <Badge variant="secondary" className="bg-white/70 text-emerald-600">
            AES-256 · Lighthouse
          </Badge>
        </div>
        <p className="text-sm text-slate-600">
          Encrypt resumes and certifications client-side before they travel through Lighthouse&apos;s encrypted IPFS tunnels.
          We only expose short-lived streaming URLs to authenticated viewers.
        </p>
      </CardHeader>
      <CardContent className="relative z-10 grid gap-6">
        <section className="rounded-3xl border border-emerald-100 bg-white/90 p-5 text-sm shadow-inner shadow-emerald-100/60">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-500">Resume signal</p>
              <p className="text-base font-semibold text-slate-900">{resumeUrl ? 'Encrypted resume on file' : 'No resume uploaded yet'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50" onClick={triggerResumeDialog} disabled={isResumeUploading}>
                {isResumeUploading ? 'Uploading…' : resumeCta}
              </Button>
            </div>
          </div>
          {resumeUrl && (
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                <span>Streaming endpoint ready</span>
              </div>
              <p className="mt-2 break-all font-mono text-[11px] text-slate-500">{resumeUrl}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="secondary" className="bg-emerald-500 text-white shadow-emerald-200/70" disabled={resumeAction === 'download'} onClick={() => openResume('download')}>
                  {resumeAction === 'download' ? 'Preparing…' : 'Download encrypted copy'}
                </Button>
                <Button type="button" variant="outline" className="border-slate-200 bg-white/80 text-slate-700" disabled={resumeAction === 'view'} onClick={() => openResume('view')}>
                  {resumeAction === 'view' ? 'Opening…' : 'View inline'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-rose-600 hover:bg-rose-50"
                  disabled={isResumeDeleting}
                  onClick={handleResumeDelete}
                >
                  {isResumeDeleting ? (
                    'Removing…'
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm">
                      <Trash2 className="h-4 w-4" /> Delete resume
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
          <input ref={resumeInputRef} type="file" accept={ACCEPTED_DOC_TYPES} className="hidden" onChange={handleResumeChange} />
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-white/90 p-5 text-sm shadow-inner shadow-emerald-100/60">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
              <Wand2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-500">Signal density</p>
              <p className="text-base font-semibold text-slate-900">{certificationCountLabel}</p>
            </div>
            <Button type="button" variant="outline" className="border-cyan-200 bg-white text-cyan-700 hover:bg-cyan-50" onClick={triggerCertDialog}>
              Attach document
            </Button>
            <input ref={certInputRef} type="file" accept={ACCEPTED_DOC_TYPES} className="hidden" onChange={handleCertFileChange} />
          </div>

          <form className="mt-6 space-y-4" onSubmit={submitCertification}>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Credential name</label>
                <Input name="name" placeholder="Zero-Knowledge Proof Architect" value={certForm.name} onChange={handleCertFieldChange} className="mt-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Issuer</label>
                <Input name="issuer" placeholder="StarkWare" value={certForm.issuer} onChange={handleCertFieldChange} className="mt-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Issued</label>
                <Input type="date" name="issueDate" value={certForm.issueDate} onChange={handleCertFieldChange} className="mt-2 border-slate-200 bg-white text-slate-900" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Expires</label>
                <Input type="date" name="expiryDate" value={certForm.expiryDate} onChange={handleCertFieldChange} className="mt-2 border-slate-200 bg-white text-slate-900" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Credential ID</label>
                <Input name="credentialId" placeholder="#ZK-2048" value={certForm.credentialId} onChange={handleCertFieldChange} className="mt-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
              </div>
            </div>
            {certFile ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-700">
                <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-emerald-500">Ready</p>
                <p>{certFile.name}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-slate-500">
                <p className="flex items-center gap-2 text-slate-700">
                  <UploadCloud className="h-4 w-4 text-cyan-500" />
                  Drop a PDF or PNG up to 8 MB
                </p>
                <p className="mt-1 text-slate-500">Use the “Attach document” button above to browse encrypted uploads.</p>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span>We encrypt in-memory before Lighthouse transfer.</span>
              <Button type="submit" disabled={isCertUploading} className="bg-emerald-500 text-white shadow-emerald-200/70 hover:bg-emerald-400">
                {isCertUploading ? 'Encrypting…' : 'Publish credential'}
              </Button>
            </div>
          </form>

          {certifications.length > 0 && (
            <div className="mt-6 space-y-3">
              {certifications.map((cert) => {
                const credentialUrl = cert.credentialUrl ?? null;
                const isPreviewing = credentialUrl ? certPreviewId === cert.id || certPreviewId === credentialUrl : false;
                return (
                <div key={cert.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-slate-900">{cert.name}</p>
                    <Badge variant="outline" className="border-cyan-200 text-cyan-700">
                      {cert.issuer}
                    </Badge>
                    {cert.issueDate && (
                      <span className="text-xs text-slate-500">Issued {new Date(cert.issueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    {cert.credentialId && <span>ID · {cert.credentialId}</span>}
                    {cert.expiryDate && <span>Expires {new Date(cert.expiryDate).toLocaleDateString()}</span>}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {credentialUrl ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-emerald-200 bg-white text-emerald-700"
                        disabled={isPreviewing}
                        onClick={() => openCertification(credentialUrl, cert.id)}
                      >
                        {isPreviewing ? 'Loading…' : 'View document'}
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-rose-600 hover:bg-rose-50"
                      disabled={removingCertificationId === cert.id}
                      onClick={() => handleCertificationDelete(cert.id)}
                    >
                      {removingCertificationId === cert.id ? (
                        'Removing…'
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm">
                          <Trash2 className="h-4 w-4" /> Delete
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

export default FreelancerDocumentsCard;
