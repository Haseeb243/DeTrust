'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAccount, useBalance } from 'wagmi';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Filter,
  Shield,
  Wallet,
  XCircle,
} from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Spinner } from '@/components/ui/spinner';
import { contractApi, type Contract } from '@/lib/api';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

type TransactionType = 'payment' | 'withdrawal' | 'deposit' | 'escrow';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  contractId?: string;
  contractTitle?: string;
  txHash?: string;
  createdAt: string;
}

const TYPE_COLORS: Record<TransactionType, string> = {
  payment: 'bg-emerald-100 text-emerald-700',
  withdrawal: 'bg-blue-100 text-blue-700',
  deposit: 'bg-purple-100 text-purple-700',
  escrow: 'bg-amber-100 text-amber-700',
};

const STATUS_ICONS = {
  completed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  failed: <XCircle className="h-4 w-4 text-red-500" />,
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function PaymentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'incoming' | 'outgoing'>('all');

  const isClient = user?.role === 'CLIENT';

  // Simulated transactions from contracts
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchPaymentData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await contractApi.listContracts({
        role: isClient ? 'client' : 'freelancer',
        limit: 50,
      });

      if (response.success && response.data) {
        setContracts(response.data.items);
        
        // Generate transactions from milestones
        const txs: Transaction[] = [];
        response.data.items.forEach((contract) => {
          contract.milestones?.forEach((milestone) => {
            if (milestone.status === 'PAID' || milestone.status === 'APPROVED') {
              txs.push({
                id: milestone.id,
                type: isClient ? 'payment' : 'payment',
                amount: milestone.amount,
                status: 'completed',
                description: `${milestone.title} - ${contract.title}`,
                contractId: contract.id,
                contractTitle: contract.title,
                createdAt: milestone.approvedAt || milestone.paidAt || contract.createdAt,
              });
            }
          });
          
          // Add escrow funding transaction if exists
          if (contract.fundingTxHash) {
            txs.push({
              id: `escrow-${contract.id}`,
              type: 'escrow',
              amount: contract.totalAmount,
              status: 'completed',
              description: `Escrow funded for ${contract.title}`,
              contractId: contract.id,
              contractTitle: contract.title,
              txHash: contract.fundingTxHash,
              createdAt: contract.createdAt,
            });
          }
        });
        
        // Sort by date
        txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTransactions(txs);
      }
    } catch (error) {
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  useEffect(() => {
    fetchPaymentData();
  }, [fetchPaymentData]);

  // Calculate totals
  const totalEarned = transactions
    .filter((t) => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalPending = contracts
    .filter((c) => c.status === 'ACTIVE')
    .reduce((sum, c) => sum + ((c.totalAmount || 0) - (c.paidAmount || 0)), 0);

  const totalEscrow = contracts
    .filter((c) => c.escrowAddress && c.status === 'ACTIVE')
    .reduce((sum, c) => sum + (c.totalAmount || 0), 0);

  const filteredTransactions = transactions.filter((t) => {
    if (activeTab === 'incoming') return t.type === 'payment' && !isClient;
    if (activeTab === 'outgoing') return t.type === 'payment' && isClient;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payments</h1>
          <p className="text-slate-600">
            {isClient ? 'Track payments to freelancers' : 'Track your earnings and withdrawals'}
          </p>
        </div>
      </div>

      {/* Wallet & Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Wallet Balance */}
        <Card className="border-slate-200 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-100">Wallet Balance</p>
                <p className="mt-1 text-3xl font-semibold">
                  {isConnected && ethBalance
                    ? `${Number(ethBalance.formatted).toFixed(4)} ${ethBalance.symbol}`
                    : '-- ETH'}
                </p>
                {address && (
                  <p className="mt-1 text-sm text-emerald-100 font-mono">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                )}
              </div>
              <Wallet className="h-12 w-12 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        {/* Total Earned/Paid */}
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{isClient ? 'Total Paid' : 'Total Earned'}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  ${totalEarned.toLocaleString()}
                </p>
              </div>
              {isClient ? (
                <ArrowUpRight className="h-8 w-8 text-red-400" />
              ) : (
                <ArrowDownLeft className="h-8 w-8 text-emerald-400" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  ${totalPending.toLocaleString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>

        {/* In Escrow */}
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">In Escrow</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  ${totalEscrow.toLocaleString()}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {(['all', 'incoming', 'outgoing'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium capitalize transition',
              activeTab === tab
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            {tab === 'all' ? 'All Transactions' : tab}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <DollarSign className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No transactions yet</h3>
            <p className="mt-2 text-slate-600">
              {isClient
                ? 'Payments will appear when you approve milestones'
                : 'Earnings will appear when clients approve your work'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        tx.type === 'payment' && !isClient
                          ? 'bg-emerald-100'
                          : tx.type === 'payment' && isClient
                          ? 'bg-red-100'
                          : tx.type === 'escrow'
                          ? 'bg-amber-100'
                          : 'bg-blue-100'
                      )}
                    >
                      {tx.type === 'payment' && !isClient ? (
                        <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                      ) : tx.type === 'payment' && isClient ? (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      ) : tx.type === 'escrow' ? (
                        <Shield className="h-5 w-5 text-amber-600" />
                      ) : (
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{tx.description}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        {STATUS_ICONS[tx.status]}
                        <span>{formatDate(tx.createdAt)}</span>
                        {tx.txHash && (
                          <a
                            href={`https://etherscan.io/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-emerald-600 hover:underline"
                          >
                            View Tx <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'text-lg font-semibold',
                        tx.type === 'payment' && !isClient
                          ? 'text-emerald-600'
                          : tx.type === 'payment' && isClient
                          ? 'text-red-600'
                          : 'text-slate-900'
                      )}
                    >
                      {tx.type === 'payment' && !isClient ? '+' : tx.type === 'payment' && isClient ? '-' : ''}
                      ${tx.amount.toLocaleString()}
                    </p>
                    <Badge className={TYPE_COLORS[tx.type]}>{tx.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Contracts with Pending Payments */}
      {contracts.filter((c) => c.status === 'ACTIVE').length > 0 && (
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900">
              Active Contracts with Pending Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contracts
              .filter((c) => c.status === 'ACTIVE')
              .map((contract) => {
                const pendingAmount = (contract.totalAmount || 0) - (contract.paidAmount || 0);
                const pendingMilestones = contract.milestones?.filter(
                  (m) => m.status !== 'PAID' && m.status !== 'APPROVED'
                ).length || 0;

                return (
                  <Link
                    key={contract.id}
                    href={`/contracts/${contract.id}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{contract.title}</p>
                      <p className="text-sm text-slate-500">
                        {pendingMilestones} milestone{pendingMilestones !== 1 ? 's' : ''} pending
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        ${pendingAmount.toLocaleString()} remaining
                      </p>
                      {contract.escrowAddress && (
                        <Badge className="bg-emerald-100 text-emerald-700">Escrow Active</Badge>
                      )}
                    </div>
                  </Link>
                );
              })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
