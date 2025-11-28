"use client";

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'sonner';
import { FileText, ShieldCheck, UploadCloud, Wand2 } from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { uploadApi, type CertificationEntry, type FreelancerProfile } from '@/lib/api';

const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024; // 8 MB client-side guard
const ACCEPTED_DOC_TYPES = 'application/pdf,image/png,image/jpeg,image/webp';

interface FreelancerDocumentsCardProps {
  profile?: FreelancerProfile | null;
  onResumeUpdated?: (resumeUrl: string) => void;
  onCertificationAdded?: (certification: CertificationEntry) => void;
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

export function FreelancerDocumentsCard({ profile, onResumeUpdated, onCertificationAdded }: FreelancerDocumentsCardProps) {
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [isCertUploading, setIsCertUploading] = useState(false);
  const [certForm, setCertForm] = useState(initialCertForm);
  const [certFile, setCertFile] = useState<File | null>(null);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  const resumeUrl = profile?.resumeUrl ?? '';
  const certifications = profile?.certifications ?? [];

  const resumeCta = resumeUrl ? 'Replace resume' : 'Upload resume';
  const certificationCountLabel = useMemo(() => {
    if (!certifications.length) return 'No certifications yet';
    return `${certifications.length} certification${certifications.length > 1 ? 's' : ''}`;
  }, [certifications.length]);

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

  return (
    <Card className="relative overflow-hidden border border-slate-900/20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 shadow-[0_20px_70px_#020617]">
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.25),_transparent_55%)]" />
      </div>
      <CardHeader className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <CardTitle className="text-xl font-semibold tracking-tight text-slate-50">Secure credentials vault</CardTitle>
          <Badge variant="secondary" className="bg-emerald-400/20 text-emerald-200">
            AES-256 · Lighthouse
          </Badge>
        </div>
        <p className="text-sm text-slate-400">
          Encrypt resumes and certifications client-side before they travel through Lighthouse&apos;s encrypted IPFS tunnels.
          We only expose short-lived streaming URLs to authenticated viewers.
        </p>
      </CardHeader>
      <CardContent className="relative z-10 grid gap-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm shadow-inner">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Resume signal</p>
              <p className="text-base text-slate-100">{resumeUrl ? 'Encrypted resume on file' : 'No resume uploaded yet'}</p>
            </div>
            <Button type="button" variant="secondary" className="bg-emerald-500/90 text-slate-900 hover:bg-emerald-400" onClick={triggerResumeDialog} disabled={isResumeUploading}>
              {isResumeUploading ? 'Uploading…' : resumeCta}
            </Button>
          </div>
          {resumeUrl && (
            <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <span>Streaming endpoint ready</span>
              </div>
              <p className="break-all font-mono text-[11px] text-slate-400">{resumeUrl}</p>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" className="text-emerald-300 hover:bg-white/5" onClick={() => window.open(`${resumeUrl}?download=1`, '_blank')?.focus()}>
                  Download encrypted copy
                </Button>
                <Button type="button" variant="ghost" className="text-slate-300 hover:bg-white/5" onClick={() => window.open(resumeUrl, '_blank')?.focus()}>
                  View inline
                </Button>
              </div>
            </div>
          )}
          <input ref={resumeInputRef} type="file" accept={ACCEPTED_DOC_TYPES} className="hidden" onChange={handleResumeChange} />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm shadow-inner">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
              <Wand2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Signal density</p>
              <p className="text-base text-slate-100">{certificationCountLabel}</p>
            </div>
            <Button type="button" variant="ghost" className="bg-white/10 text-white hover:bg-white/20" onClick={triggerCertDialog}>
              Attach document
            </Button>
            <input ref={certInputRef} type="file" accept={ACCEPTED_DOC_TYPES} className="hidden" onChange={handleCertFileChange} />
          </div>

          <form className="mt-6 space-y-4" onSubmit={submitCertification}>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Credential name</label>
                <Input name="name" placeholder="Zero-Knowledge Proof Architect" value={certForm.name} onChange={handleCertFieldChange} className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Issuer</label>
                <Input name="issuer" placeholder="StarkWare" value={certForm.issuer} onChange={handleCertFieldChange} className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Issued</label>
                <Input type="date" name="issueDate" value={certForm.issueDate} onChange={handleCertFieldChange} className="mt-2 border-white/10 bg-white/5 text-white [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Expires</label>
                <Input type="date" name="expiryDate" value={certForm.expiryDate} onChange={handleCertFieldChange} className="mt-2 border-white/10 bg-white/5 text-white [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-500">Credential ID</label>
                <Input name="credentialId" placeholder="#ZK-2048" value={certForm.credentialId} onChange={handleCertFieldChange} className="mt-2 border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
              </div>
            </div>
            {certFile ? (
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/5 p-3 text-xs text-emerald-100">
                <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-emerald-300">Ready</p>
                <p>{certFile.name}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 p-4 text-xs text-slate-400">
                <p className="flex items-center gap-2 text-slate-200">
                  <UploadCloud className="h-4 w-4 text-cyan-300" />
                  Drop a PDF or PNG up to 8 MB
                </p>
                <p className="mt-1 text-slate-500">Use the "Attach document" button above to browse encrypted uploads.</p>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>We encrypt in-memory before Lighthouse transfer.</span>
              <Button type="submit" disabled={isCertUploading} className="bg-white text-slate-900 hover:bg-slate-100">
                {isCertUploading ? 'Encrypting…' : 'Publish credential'}
              </Button>
            </div>
          </form>

          {certifications.length > 0 && (
            <div className="mt-6 space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base text-white">{cert.name}</p>
                    <Badge variant="outline" className="border-cyan-400/40 text-cyan-200">
                      {cert.issuer}
                    </Badge>
                    {cert.issueDate && (
                      <span className="text-xs text-slate-400">Issued {new Date(cert.issueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    {cert.credentialId && <span>ID · {cert.credentialId}</span>}
                    {cert.expiryDate && <span>Expires {new Date(cert.expiryDate).toLocaleDateString()}</span>}
                    {cert.credentialUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-emerald-300 hover:bg-white/5"
                        onClick={() => window.open(cert.credentialUrl || '#', '_blank')?.focus()}
                      >
                        View document
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}

export default FreelancerDocumentsCard;
