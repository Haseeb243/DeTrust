'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileCheck,
  FileUp,
  Flag,
  Link2,
  Shield,
  Upload,
  XCircle,
} from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { contractApi, uploadApi, type Contract, type ContractStatus, type MilestoneStatus } from '@/lib/api';
import { openSecureFileInNewTab } from '@/lib/secure-files';
import { useAuthStore } from '@/store';
import { useJobEscrow } from '@/hooks/use-job-escrow';
import { useSecureObjectUrl } from '@/hooks/use-secure-object-url';
import { cn } from '@/lib/utils';

const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  ACTIVE: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  DISPUTED: 'bg-orange-100 text-orange-700',
};

const MILESTONE_STATUS_COLORS: Record<MilestoneStatus, string> = {
  PENDING: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  SUBMITTED: 'bg-purple-100 text-purple-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  PAID: 'bg-green-100 text-green-700',
  DISPUTED: 'bg-orange-100 text-orange-700',
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const contractId = params.id as string;
  const { approveMilestone: approveOnChain, submitMilestone: submitOnChain, loading: escrowLoading } = useJobEscrow();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [submittingMilestone, setSubmittingMilestone] = useState<string | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableFile, setDeliverableFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submitMode, setSubmitMode] = useState<'url' | 'file'>('url');
  const [openingDeliverableId, setOpeningDeliverableId] = useState<string | null>(null);

  const isClient = user?.role === 'CLIENT';
  const isFreelancer = user?.role === 'FREELANCER';
  const isOwner = contract?.clientId === user?.id || contract?.freelancerId === user?.id;

  // Get secure avatar URLs for both client and freelancer
  const clientAvatarUrl = contract?.client?.avatarUrl;
  const freelancerAvatarUrl = contract?.freelancer?.avatarUrl;
  const { objectUrl: secureClientAvatar } = useSecureObjectUrl(clientAvatarUrl);
  const { objectUrl: secureFreelancerAvatar } = useSecureObjectUrl(freelancerAvatarUrl);

  const fetchContract = useCallback(async () => {
    setLoading(true);
    try {
      const response = await contractApi.getContract(contractId);
      if (response.success && response.data) {
        setContract(response.data);
      } else {
        toast.error('Contract not found');
        router.push('/contracts');
      }
    } catch (error) {
      toast.error('Failed to load contract');
    } finally {
      setLoading(false);
    }
  }, [contractId, router]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  const handleViewDeliverable = useCallback(
    async (milestoneId: string, url: string) => {
      if (!url) {
        return;
      }

      const isSecureUpload = /\/api\/uploads\//.test(url);
      if (!isSecureUpload) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      if (!token) {
        toast.error('Please sign in again to view this deliverable.');
        return;
      }

      setOpeningDeliverableId(milestoneId);
      try {
        await openSecureFileInNewTab(url, { token });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to open deliverable');
      } finally {
        setOpeningDeliverableId(null);
      }
    },
    [token]
  );

  const handleSubmitMilestone = async (milestoneId: string, index: number) => {
    let finalDeliverableUrl = deliverableUrl;

    // Handle file upload if a file is selected
    if (submitMode === 'file' && deliverableFile) {
      setUploadingFile(true);
      try {
        const uploadResponse = await uploadApi.uploadDeliverable(deliverableFile);
        if (uploadResponse.success && uploadResponse.data) {
          finalDeliverableUrl = uploadResponse.data.url;
        } else {
          toast.error('Failed to upload file');
          setUploadingFile(false);
          return;
        }
      } catch (error) {
        toast.error('Failed to upload file');
        setUploadingFile(false);
        return;
      }
      setUploadingFile(false);
    }

    if (!finalDeliverableUrl.trim()) {
      toast.error('Please provide a deliverable URL or upload a file');
      return;
    }

    setActionLoading(milestoneId);
    try {
      // Submit on blockchain if escrow is funded
      if (contract?.blockchainJobId) {
        await submitOnChain(contract.id, index, finalDeliverableUrl);
      }

      const response = await contractApi.submitMilestone(contractId, milestoneId, {
        deliverableUrl: finalDeliverableUrl,
        // TODO: In production, compute a proper hash of the deliverable content
        // For now, using a simple hash of the URL as a placeholder
        deliverableHash: btoa(finalDeliverableUrl).slice(0, 32),
      });
      if (response.success) {
        toast.success('Milestone submitted for review');
        setSubmittingMilestone(null);
        setDeliverableUrl('');
        setDeliverableFile(null);
        fetchContract();
      } else {
        toast.error(response.error?.message || 'Failed to submit milestone');
      }
    } catch (error) {
      toast.error('Failed to submit milestone');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveMilestone = async (milestoneId: string, index: number) => {
    if (!confirm('Approve this milestone and release payment?')) return;

    setActionLoading(milestoneId);
    try {
      // Approve on blockchain if escrow is funded
      if (contract?.blockchainJobId) {
        await approveOnChain(contract.id, index);
      }

      const response = await contractApi.approveMilestone(contractId, milestoneId);
      if (response.success) {
        toast.success('Milestone approved! Payment released.');
        fetchContract();
      } else {
        toast.error(response.error?.message || 'Failed to approve milestone');
      }
    } catch (error) {
      toast.error('Failed to approve milestone');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRaiseDispute = async () => {
    const reason = prompt('Please describe the reason for the dispute:');
    if (!reason) return;

    setActionLoading('dispute');
    try {
      const response = await contractApi.raiseDispute(contractId, reason);
      if (response.success) {
        toast.success('Dispute raised. Our team will review it.');
        fetchContract();
      } else {
        toast.error(response.error?.message || 'Failed to raise dispute');
      }
    } catch (error) {
      toast.error('Failed to raise dispute');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!contract || !isOwner) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <XCircle className="h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Contract not found</h3>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/contracts">Back to Contracts</Link>
        </Button>
      </div>
    );
  }

  const otherParty = isClient
    ? {
        name: contract.freelancer?.name || 'Freelancer',
        avatar: secureFreelancerAvatar,
        subtitle: contract.freelancer?.freelancerProfile?.title || 'Freelancer',
        trustScore: contract.freelancer?.freelancerProfile?.trustScore || 0,
      }
    : {
        name: contract.client?.name || 'Client',
        avatar: secureClientAvatar,
        subtitle: contract.client?.clientProfile?.companyName || 'Client',
        trustScore: contract.client?.clientProfile?.trustScore || 0,
      };

  const completedMilestones = contract.milestones?.filter(m => m.status === 'PAID' || m.status === 'APPROVED').length || 0;
  const totalMilestones = contract.milestones?.length || 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Contract Header */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-emerald-100 bg-slate-100">
                    {otherParty.avatar ? (
                      <Image
                        src={otherParty.avatar}
                        alt={otherParty.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-500">
                        {otherParty.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-semibold text-slate-900">{contract.title}</h1>
                      <Badge className={CONTRACT_STATUS_COLORS[contract.status as ContractStatus]}>
                        {contract.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600">
                      Contract with {otherParty.name} · {otherParty.subtitle}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        {otherParty.trustScore}% trust
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Started {formatDate(contract.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-slate-900">
                    ${contract.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-emerald-600">
                    ${contract.paidAmount?.toLocaleString() || 0} paid
                  </div>
                </div>
              </div>

              {/* Escrow Status */}
              {contract.escrowAddress && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-900">Escrow Funded</p>
                    <p className="text-sm text-emerald-700">
                      Funds secured in smart contract
                    </p>
                  </div>
                  {contract.fundingTxHash && (
                    <a
                      href={`https://etherscan.io/tx/${contract.fundingTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1 text-sm text-emerald-600 hover:underline"
                    >
                      View Tx <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg text-slate-900">
                <span className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-emerald-500" />
                  Milestones
                </span>
                <span className="text-sm font-normal text-slate-500">
                  {completedMilestones} / {totalMilestones} completed
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contract.milestones?.map((milestone, index) => {
                const deliverableUrl = milestone.deliverableUrl?.trim();
                const isSecureDeliverable = !!deliverableUrl && /\/api\/uploads\//.test(deliverableUrl);
                const normalizedExternalUrl =
                  deliverableUrl && !isSecureDeliverable
                    ? /^https?:\/\//i.test(deliverableUrl)
                      ? deliverableUrl
                      : `https://${deliverableUrl}`
                    : undefined;
                let displayUrl = deliverableUrl ?? '';

                if (deliverableUrl) {
                  try {
                    const parsed = new URL(normalizedExternalUrl ?? deliverableUrl);
                    displayUrl = `${parsed.hostname}${parsed.pathname === '/' ? '' : parsed.pathname}`;
                  } catch {
                    displayUrl = deliverableUrl.replace(/^https?:\/\//, '');
                  }

                  if (displayUrl.length > 48) {
                    displayUrl = `${displayUrl.slice(0, 45)}…`;
                  }
                }

                return (
                  <div
                    key={milestone.id}
                    className={cn(
                      'rounded-xl border p-4',
                      milestone.status === 'PAID' || milestone.status === 'APPROVED'
                        ? 'border-emerald-200 bg-emerald-50'
                        : milestone.status === 'SUBMITTED'
                        ? 'border-purple-200 bg-purple-50'
                        : 'border-slate-200 bg-white'
                    )}
                  >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                          {index + 1}
                        </span>
                        <h4 className="font-semibold text-slate-900">{milestone.title}</h4>
                        <Badge className={MILESTONE_STATUS_COLORS[milestone.status as MilestoneStatus]}>
                          {milestone.status}
                        </Badge>
                      </div>
                      {milestone.description && (
                        <p className="mt-2 text-sm text-slate-600">{milestone.description}</p>
                      )}
                      {milestone.dueDate && (
                        <p className="mt-1 text-sm text-slate-500">
                          Due: {formatDate(milestone.dueDate)}
                        </p>
                      )}
                      {deliverableUrl && (
                        isSecureDeliverable ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={openingDeliverableId === milestone.id}
                            onClick={() => handleViewDeliverable(milestone.id, deliverableUrl)}
                            className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50/80 to-white/80 px-5 text-emerald-700 shadow-sm hover:from-emerald-100 hover:to-white"
                          >
                            {openingDeliverableId === milestone.id ? (
                              <>
                                <Spinner size="sm" className="border-emerald-500" />
                                Opening…
                              </>
                            ) : (
                              <>
                                <FileUp className="h-4 w-4" />
                                View Deliverable
                              </>
                            )}
                          </Button>
                        ) : (
                          <a
                            href={normalizedExternalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 text-blue-600 shadow-sm transition hover:bg-blue-100"
                          >
                            <Link2 className="h-4 w-4" />
                            <span className="truncate text-sm font-medium">{displayUrl}</span>
                          </a>
                        )
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-slate-900">
                        ${milestone.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {isFreelancer && milestone.status === 'PENDING' && (
                    <div className="mt-4">
                      {submittingMilestone === milestone.id ? (
                        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                          {/* Toggle between URL and File */}
                          <div className="flex gap-2 border-b border-slate-100 pb-3">
                            <button
                              type="button"
                              onClick={() => setSubmitMode('url')}
                              className={cn(
                                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                                submitMode === 'url'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'text-slate-500 hover:bg-slate-100'
                              )}
                            >
                              <Link2 className="h-4 w-4" />
                              Link / URL
                            </button>
                            <button
                              type="button"
                              onClick={() => setSubmitMode('file')}
                              className={cn(
                                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                                submitMode === 'file'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'text-slate-500 hover:bg-slate-100'
                              )}
                            >
                              <Upload className="h-4 w-4" />
                              Upload File
                            </button>
                          </div>

                          {submitMode === 'url' ? (
                            <Input
                              value={deliverableUrl}
                              onChange={(e) => setDeliverableUrl(e.target.value)}
                              placeholder="Enter deliverable URL (e.g., GitHub, Figma, Google Drive)"
                              className="border-slate-200"
                            />
                          ) : (
                            <div className="space-y-2">
                              <label
                                htmlFor={`file-upload-${milestone.id}`}
                                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 transition hover:border-emerald-300 hover:bg-emerald-50"
                              >
                                <Upload className="h-8 w-8 text-slate-400" />
                                <p className="mt-2 text-sm text-slate-600">
                                  {deliverableFile ? deliverableFile.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-slate-400">PDF, ZIP, PNG, JPG up to 50MB</p>
                                <input
                                  id={`file-upload-${milestone.id}`}
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => setDeliverableFile(e.target.files?.[0] || null)}
                                  accept=".pdf,.zip,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.fig,.sketch"
                                />
                              </label>
                              {deliverableFile && (
                                <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm">
                                  <span className="text-emerald-700">{deliverableFile.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => setDeliverableFile(null)}
                                    className="text-slate-400 hover:text-red-500"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSubmittingMilestone(null);
                                setDeliverableUrl('');
                                setDeliverableFile(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSubmitMilestone(milestone.id, index)}
                              disabled={!!actionLoading || uploadingFile}
                              className="bg-emerald-500 text-white hover:bg-emerald-600"
                            >
                              {actionLoading === milestone.id || uploadingFile ? <Spinner size="sm" /> : 'Submit'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setSubmittingMilestone(milestone.id)}
                          className="bg-blue-500 text-white hover:bg-blue-600"
                        >
                          <FileUp className="mr-1 h-3 w-3" />
                          Submit Deliverable
                        </Button>
                      )}
                    </div>
                  )}

                  {isClient && milestone.status === 'SUBMITTED' && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveMilestone(milestone.id, index)}
                        disabled={!!actionLoading}
                        className="bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        {actionLoading === milestone.id ? <Spinner size="sm" /> : (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Approve & Pay
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {(milestone.status === 'PAID' || milestone.status === 'APPROVED') && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed {milestone.approvedAt && `on ${formatDate(milestone.approvedAt)}`}
                    </div>
                  )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contract Summary */}
          <Card className="border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Contract Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total Value</span>
                <span className="font-semibold text-slate-900">
                  ${contract.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-semibold text-emerald-600">
                  ${contract.paidAmount?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Remaining</span>
                <span className="font-semibold text-slate-900">
                  ${((contract.totalAmount || 0) - (contract.paidAmount || 0)).toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Start Date</span>
                <span className="text-slate-900">
                  {contract.startDate ? formatDate(contract.startDate) : formatDate(contract.createdAt)}
                </span>
              </div>
              {contract.endDate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">End Date</span>
                  <span className="text-slate-900">{formatDate(contract.endDate)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {contract.status === 'ACTIVE' && (
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full border-slate-200">
                  <Link href={`/messages?contract=${contract.id}`}>
                    Message {isClient ? 'Freelancer' : 'Client'}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRaiseDispute}
                  disabled={!!actionLoading}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Raise Dispute
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Related Job */}
          {contract.job && (
            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Related Job</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/jobs/${contract.jobId}`}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  {contract.job.title}
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                  {contract.job.category} · {contract.job.type === 'FIXED_PRICE' ? 'Fixed Price' : 'Hourly'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
