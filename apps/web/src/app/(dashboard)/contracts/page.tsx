'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  FileCheck,
  Shield,
  XCircle,
} from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { contractApi, type Contract, type ContractStatus, type GetContractsParams } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<ContractStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  ACTIVE: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  DISPUTED: 'bg-orange-100 text-orange-700',
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const TABS: { value: ContractStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DISPUTED', label: 'Disputed' },
];

export default function ContractsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ContractStatus | ''>('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const isClient = user?.role === 'CLIENT';

  const fetchContracts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: GetContractsParams = {
        page,
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
        role: isClient ? 'client' : 'freelancer',
      };
      if (activeTab) {
        params.status = activeTab;
      }

      const response = await contractApi.listContracts(params);

      if (response.success && response.data) {
        setContracts(response.data.items);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
          hasNext: response.data.hasNext,
          hasPrev: response.data.hasPrev,
        });
      }
    } catch (error) {
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  }, [activeTab, isClient]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const getOtherParty = (contract: Contract) => {
    if (isClient) {
      return {
        name: contract.freelancer?.name || 'Freelancer',
        avatar: contract.freelancer?.avatarUrl,
        subtitle: contract.freelancer?.freelancerProfile?.title || 'Freelancer',
        trustScore: contract.freelancer?.freelancerProfile?.trustScore || 0,
      };
    }
    return {
      name: contract.client?.name || 'Client',
      avatar: contract.client?.avatarUrl,
      subtitle: contract.client?.clientProfile?.companyName || 'Client',
      trustScore: contract.client?.clientProfile?.trustScore || 0,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Active Contracts</h1>
          <p className="text-slate-600">
            {isClient ? 'Manage your contracts with freelancers' : 'Track your ongoing contracts'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={cn(
              'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition',
              activeTab === tab.value
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contracts List */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : contracts.length === 0 ? (
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {activeTab ? `No ${activeTab.toLowerCase()} contracts` : 'No contracts yet'}
            </h3>
            <p className="mt-2 text-slate-600">
              {isClient
                ? 'Accept a proposal to create a contract'
                : 'Get your proposals accepted to start contracts'}
            </p>
            <Button
              asChild
              className="mt-4 bg-emerald-500 text-white hover:bg-emerald-600"
            >
              <Link href={isClient ? '/jobs/mine' : '/jobs'}>
                {isClient ? 'View My Jobs' : 'Find Jobs'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => {
            const otherParty = getOtherParty(contract);
            const completedMilestones = contract.milestones?.filter(m => m.status === 'PAID' || m.status === 'APPROVED').length || 0;
            const totalMilestones = contract.milestones?.length || 0;
            const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

            return (
              <Link key={contract.id} href={`/contracts/${contract.id}`}>
                <Card className="border-slate-200 bg-white shadow-md transition-all hover:border-emerald-200 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      {/* Contract Info */}
                      <div className="flex items-start gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-emerald-100 bg-slate-100">
                          {otherParty.avatar ? (
                            <Image
                              src={otherParty.avatar}
                              alt={otherParty.name}
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-500">
                              {otherParty.name[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {contract.title}
                            </h3>
                            <Badge className={STATUS_COLORS[contract.status as ContractStatus]}>
                              {contract.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">
                            with {otherParty.name} · {otherParty.subtitle}
                          </p>
                          <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
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

                      {/* Amount & Progress */}
                      <div className="text-right">
                        <div className="text-xl font-semibold text-slate-900">
                          ${contract.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-500">
                          ${contract.paidAmount?.toLocaleString() || 0} paid
                        </div>
                      </div>
                    </div>

                    {/* Milestone Progress */}
                    {totalMilestones > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-slate-500">
                            <FileCheck className="h-4 w-4" />
                            Milestones
                          </span>
                          <span className="font-medium text-slate-900">
                            {completedMilestones} / {totalMilestones} completed
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Escrow Status */}
                    {contract.escrowAddress && (
                      <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-700">Escrow funded on-chain</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-600">
                Showing {(pagination.page - 1) * 10 + 1} to{' '}
                {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} contracts
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => fetchContracts(pagination.page - 1)}
                  className="border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => fetchContracts(pagination.page + 1)}
                  className="border-slate-200"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
