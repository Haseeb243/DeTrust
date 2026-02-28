'use client';

import { useCallback, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, XCircle } from 'lucide-react';

import { Button } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/store';
import { useJobEscrow } from '@/hooks/use-job-escrow';
import { useSecureObjectUrl } from '@/hooks/use-secure-object-url';
import { ContractHeader, EscrowFunding, MilestoneList, ContractSidebar } from '@/components/contracts';
import { MilestoneTimeline } from '@/components/contracts/milestone-timeline';
import { DisputeForm } from '@/components/contracts/dispute-form';
import { useContract, useRaiseDispute } from '@/hooks/queries/use-contracts';

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoFund = searchParams.get('autoFund') === 'true';
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const contractId = params.id as string;
  const { approveMilestone: approveOnChain } = useJobEscrow();

  const { data: contract, isLoading: loading, refetch } = useContract(contractId);
  const raiseDisputeMutation = useRaiseDispute();
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  const isClient = user?.role === 'CLIENT';
  const isFreelancer = user?.role === 'FREELANCER';
  const isOwner = contract?.clientId === user?.id || contract?.freelancerId === user?.id;

  const { objectUrl: secureClientAvatar } = useSecureObjectUrl(contract?.client?.avatarUrl);
  const { objectUrl: secureFreelancerAvatar } = useSecureObjectUrl(contract?.freelancer?.avatarUrl);

  const otherParty = useMemo(() => isClient
    ? {
        name: contract?.freelancer?.name || 'Freelancer',
        avatar: secureFreelancerAvatar,
        subtitle: contract?.freelancer?.freelancerProfile?.title || 'Freelancer',
        trustScore: contract?.freelancer?.freelancerProfile?.trustScore || 0,
      }
    : {
        name: contract?.client?.name || 'Client',
        avatar: secureClientAvatar,
        subtitle: contract?.client?.clientProfile?.companyName || 'Client',
        trustScore: contract?.client?.clientProfile?.trustScore || 0,
      }, [isClient, contract, secureClientAvatar, secureFreelancerAvatar]);

  const handleRaiseDispute = useCallback(() => {
    setShowDisputeForm(true);
  }, []);

  const handleSubmitDispute = useCallback(async (reason: string, evidence: string[]) => {
    try {
      const response = await raiseDisputeMutation.mutateAsync({ contractId, reason, evidence });
      if (response.success) {
        toast.success('Dispute raised. Our team will review it.');
        setShowDisputeForm(false);
      } else {
        toast.error(response.error?.message || 'Failed to raise dispute');
      }
    } catch {
      toast.error('Failed to raise dispute');
    }
  }, [raiseDisputeMutation, contractId]);

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
        <h3 className="mt-4 text-lg font-semibold text-dt-text">Contract not found</h3>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/contracts">Back to Contracts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 text-dt-text-muted hover:text-dt-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
        <div className="space-y-6">
          <ContractHeader contract={contract} otherParty={otherParty} />
          {contract.status === 'PENDING' && isClient && (
            <EscrowFunding contract={contract} onFunded={() => { refetch(); }} autoFund={autoFund} />
          )}
          <MilestoneTimeline milestones={contract.milestones} />
          {showDisputeForm && (
            <DisputeForm
              onSubmit={handleSubmitDispute}
              onCancel={() => setShowDisputeForm(false)}
              loading={raiseDisputeMutation.isPending}
            />
          )}
          <MilestoneList
            contract={contract}
            isClient={!!isClient}
            isFreelancer={!!isFreelancer}
            isAuthenticated={isAuthenticated}
            onApproveOnChain={async (jobId, idx) => { await approveOnChain(jobId, idx); }}
            onRefresh={() => { refetch(); }}
          />
        </div>

        <ContractSidebar
          contract={contract}
          isClient={!!isClient}
          onRaiseDispute={handleRaiseDispute}
          actionLoading={raiseDisputeMutation.isPending}
        />
      </div>
    </div>
  );
}
