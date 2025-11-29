'use client';

import { useState, useCallback, useMemo } from 'react';
import { useAccount, usePublicClient, useWalletClient, useChainId } from 'wagmi';
import { parseEther, formatEther, keccak256, toHex, type Address, type Hash } from 'viem';

// JobEscrow contract ABI (simplified for the functions we need)
const JOB_ESCROW_ABI = [
  {
    name: 'createJob',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'jobId', type: 'bytes32' },
      { name: 'freelancer', type: 'address' },
      { name: 'milestoneAmounts', type: 'uint256[]' },
    ],
    outputs: [],
  },
  {
    name: 'submitMilestone',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'bytes32' },
      { name: 'milestoneIndex', type: 'uint256' },
      { name: 'deliverableHash', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'approveMilestone',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'bytes32' },
      { name: 'milestoneIndex', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'raiseDispute',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'jobId', type: 'bytes32' }],
    outputs: [],
  },
  {
    name: 'jobs',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'jobId', type: 'bytes32' }],
    outputs: [
      { name: 'client', type: 'address' },
      { name: 'freelancer', type: 'address' },
      { name: 'totalAmount', type: 'uint256' },
      { name: 'paidAmount', type: 'uint256' },
      { name: 'platformFee', type: 'uint256' },
      { name: 'status', type: 'uint8' },
      { name: 'createdAt', type: 'uint256' },
    ],
  },
  {
    name: 'getMilestones',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'jobId', type: 'bytes32' }],
    outputs: [
      {
        name: 'milestones',
        type: 'tuple[]',
        components: [
          { name: 'amount', type: 'uint256' },
          { name: 'status', type: 'uint8' },
          { name: 'deliverableHash', type: 'string' },
          { name: 'submittedAt', type: 'uint256' },
          { name: 'approvedAt', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'platformFeePercent',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// Contract addresses by chain
// WARNING: Production addresses (137, 80002) are placeholders - must be updated after deployment
// Using these placeholder addresses will cause transactions to fail silently
const CONTRACT_ADDRESSES: Record<number, Address> = {
  31337: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // localhost (from deployments/localhost.json)
  137: '0x0000000000000000000000000000000000000000', // polygon mainnet - UPDATE AFTER DEPLOYMENT
  80002: '0x0000000000000000000000000000000000000000', // polygon amoy - UPDATE AFTER DEPLOYMENT
};

export enum JobStatus {
  Created = 0,
  Funded = 1,
  InProgress = 2,
  Completed = 3,
  Disputed = 4,
  Cancelled = 5,
}

export enum MilestoneStatus {
  Pending = 0,
  InProgress = 1,
  Submitted = 2,
  Approved = 3,
  Paid = 4,
  Disputed = 5,
}

export interface OnChainJob {
  client: Address;
  freelancer: Address;
  totalAmount: bigint;
  paidAmount: bigint;
  platformFee: bigint;
  status: JobStatus;
  createdAt: bigint;
}

export interface OnChainMilestone {
  amount: bigint;
  status: MilestoneStatus;
  deliverableHash: string;
  submittedAt: bigint;
  approvedAt: bigint;
}

export function useJobEscrow() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = useMemo(() => CONTRACT_ADDRESSES[chainId] || null, [chainId]);

  // Convert database job ID to bytes32
  const toBytes32JobId = useCallback((jobId: string): `0x${string}` => {
    return keccak256(toHex(jobId));
  }, []);

  // Get platform fee percentage
  const getPlatformFee = useCallback(async (): Promise<number> => {
    if (!publicClient || !contractAddress) return 3;
    try {
      const fee = await publicClient.readContract({
        address: contractAddress,
        abi: JOB_ESCROW_ABI,
        functionName: 'platformFeePercent',
      });
      return Number(fee);
    } catch (err) {
      console.error('Failed to get platform fee:', err);
      return 3;
    }
  }, [publicClient, contractAddress]);

  // Calculate total amount including platform fee
  const calculateTotalWithFee = useCallback(
    async (totalAmount: number): Promise<{ total: bigint; fee: bigint }> => {
      const feePercent = await getPlatformFee();
      const totalWei = parseEther(totalAmount.toString());
      const feeWei = (totalWei * BigInt(feePercent)) / BigInt(100);
      return {
        total: totalWei + feeWei,
        fee: feeWei,
      };
    },
    [getPlatformFee]
  );

  // Create job with escrow funding
  const createJobEscrow = useCallback(
    async (
      jobId: string,
      freelancerAddress: Address,
      milestoneAmounts: number[]
    ): Promise<{ txHash: Hash; blockchainJobId: string }> => {
      if (!walletClient || !address || !contractAddress) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const blockchainJobId = toBytes32JobId(jobId);
        const milestoneAmountsWei = milestoneAmounts.map((amt) => parseEther(amt.toString()));
        const totalAmount = milestoneAmounts.reduce((a, b) => a + b, 0);
        const { total } = await calculateTotalWithFee(totalAmount);

        const txHash = await walletClient.writeContract({
          address: contractAddress,
          abi: JOB_ESCROW_ABI,
          functionName: 'createJob',
          args: [blockchainJobId, freelancerAddress, milestoneAmountsWei],
          value: total,
        });

        // Wait for transaction confirmation
        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

        return { txHash, blockchainJobId };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create job escrow';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [walletClient, address, contractAddress, publicClient, toBytes32JobId, calculateTotalWithFee]
  );

  // Get job from blockchain
  const getJob = useCallback(
    async (jobId: string): Promise<OnChainJob | null> => {
      if (!publicClient || !contractAddress) return null;

      try {
        const blockchainJobId = toBytes32JobId(jobId);
        const result = await publicClient.readContract({
          address: contractAddress,
          abi: JOB_ESCROW_ABI,
          functionName: 'jobs',
          args: [blockchainJobId],
        });

        const [client, freelancer, totalAmount, paidAmount, platformFee, status, createdAt] = result;

        if (client === '0x0000000000000000000000000000000000000000') {
          return null;
        }

        return {
          client,
          freelancer,
          totalAmount,
          paidAmount,
          platformFee,
          status: status as JobStatus,
          createdAt,
        };
      } catch (err) {
        console.error('Failed to get job:', err);
        return null;
      }
    },
    [publicClient, contractAddress, toBytes32JobId]
  );

  // Get milestones for a job
  const getMilestones = useCallback(
    async (jobId: string): Promise<OnChainMilestone[]> => {
      if (!publicClient || !contractAddress) return [];

      try {
        const blockchainJobId = toBytes32JobId(jobId);
        const result = await publicClient.readContract({
          address: contractAddress,
          abi: JOB_ESCROW_ABI,
          functionName: 'getMilestones',
          args: [blockchainJobId],
        });

        return result.map((m) => ({
          amount: m.amount,
          status: m.status as MilestoneStatus,
          deliverableHash: m.deliverableHash,
          submittedAt: m.submittedAt,
          approvedAt: m.approvedAt,
        }));
      } catch (err) {
        console.error('Failed to get milestones:', err);
        return [];
      }
    },
    [publicClient, contractAddress, toBytes32JobId]
  );

  // Submit milestone deliverable (freelancer)
  const submitMilestone = useCallback(
    async (jobId: string, milestoneIndex: number, deliverableHash: string): Promise<Hash> => {
      if (!walletClient || !address || !contractAddress) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const blockchainJobId = toBytes32JobId(jobId);

        const txHash = await walletClient.writeContract({
          address: contractAddress,
          abi: JOB_ESCROW_ABI,
          functionName: 'submitMilestone',
          args: [blockchainJobId, BigInt(milestoneIndex), deliverableHash],
        });

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

        return txHash;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to submit milestone';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [walletClient, address, contractAddress, publicClient, toBytes32JobId]
  );

  // Approve milestone (client)
  const approveMilestone = useCallback(
    async (jobId: string, milestoneIndex: number): Promise<Hash> => {
      if (!walletClient || !address || !contractAddress) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const blockchainJobId = toBytes32JobId(jobId);

        const txHash = await walletClient.writeContract({
          address: contractAddress,
          abi: JOB_ESCROW_ABI,
          functionName: 'approveMilestone',
          args: [blockchainJobId, BigInt(milestoneIndex)],
        });

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

        return txHash;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to approve milestone';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [walletClient, address, contractAddress, publicClient, toBytes32JobId]
  );

  // Raise dispute
  const raiseDispute = useCallback(
    async (jobId: string): Promise<Hash> => {
      if (!walletClient || !address || !contractAddress) {
        throw new Error('Wallet not connected');
      }

      setLoading(true);
      setError(null);

      try {
        const blockchainJobId = toBytes32JobId(jobId);

        const txHash = await walletClient.writeContract({
          address: contractAddress,
          abi: JOB_ESCROW_ABI,
          functionName: 'raiseDispute',
          args: [blockchainJobId],
        });

        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

        return txHash;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to raise dispute';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [walletClient, address, contractAddress, publicClient, toBytes32JobId]
  );

  return {
    loading,
    error,
    contractAddress,
    isConnected: Boolean(address && contractAddress),
    createJobEscrow,
    getJob,
    getMilestones,
    submitMilestone,
    approveMilestone,
    raiseDispute,
    calculateTotalWithFee,
    formatEther,
  };
}

export default useJobEscrow;
