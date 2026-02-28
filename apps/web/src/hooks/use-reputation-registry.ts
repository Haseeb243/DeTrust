'use client';

import { useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { keccak256, toHex, type Address, type Hash } from 'viem';
import { toast } from 'sonner';

// ReputationRegistry contract ABI (from packages/contracts/contracts/core/ReputationRegistry.sol)
const REPUTATION_REGISTRY_ABI = [
  {
    name: 'recordFeedback',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'jobId', type: 'bytes32' },
      { name: 'reviewed', type: 'address' },
      { name: 'contentHash', type: 'bytes32' },
      { name: 'rating', type: 'uint8' },
    ],
    outputs: [],
  },
  {
    name: 'getUserFeedback',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'jobId', type: 'bytes32' },
          { name: 'reviewer', type: 'address' },
          { name: 'reviewed', type: 'address' },
          { name: 'contentHash', type: 'bytes32' },
          { name: 'rating', type: 'uint8' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
  },
  {
    name: 'getAverageRating',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'averageTimes100', type: 'uint256' },
      { name: 'count', type: 'uint256' },
    ],
  },
] as const;

// Default contract address - update this with deployed address
const REPUTATION_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REPUTATION_ADDRESS ||
  '0x0000000000000000000000000000000000000000') as Address;

interface RecordFeedbackParams {
  contractId: string; // Database contract ID
  reviewedWalletAddress: Address;
  contentHash: string; // SHA-256 hash from backend
  overallRating: number; // 1-5
}

export function useReputationRegistry() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Record feedback on the blockchain
   * This is called after creating a review in the database
   */
  const recordFeedback = useCallback(
    async ({ contractId, reviewedWalletAddress, contentHash, overallRating }: RecordFeedbackParams) => {
      if (!address || !walletClient || !publicClient) {
        toast.error('Please connect your wallet');
        return null;
      }

      setIsSubmitting(true);

      try {
        // Convert contract ID to bytes32 (keccak256 hash)
        const jobId = keccak256(toHex(contractId));

        // Convert content hash (hex string) to bytes32
        const contentHashBytes32 = contentHash.startsWith('0x')
          ? (contentHash as Hash)
          : (`0x${contentHash}` as Hash);

        // Convert rating to uint8 (must be 1-5)
        const rating = Math.round(overallRating);
        if (rating < 1 || rating > 5) {
          throw new Error('Rating must be between 1 and 5');
        }

        // Simulate the transaction to check for errors
        const { request } = await publicClient.simulateContract({
          address: REPUTATION_REGISTRY_ADDRESS,
          abi: REPUTATION_REGISTRY_ABI,
          functionName: 'recordFeedback',
          args: [jobId, reviewedWalletAddress, contentHashBytes32, rating],
          account: address,
        });

        // Execute the transaction
        const hash = await walletClient.writeContract(request);

        toast.loading('Recording review on blockchain...', { id: hash });

        // Wait for confirmation
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        });

        if (receipt.status === 'success') {
          toast.success('Review recorded on blockchain', { id: hash });
          return {
            txHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
          };
        } else {
          toast.error('Transaction failed', { id: hash });
          return null;
        }
      } catch (error: any) {
        console.error('Error recording feedback:', error);

        // Parse common errors
        if (error.message?.includes('Already submitted')) {
          toast.error('You have already submitted a review for this contract');
        } else if (error.message?.includes('Rating out of range')) {
          toast.error('Rating must be between 1 and 5');
        } else if (error.message?.includes('Invalid reviewed')) {
          toast.error('Invalid recipient address');
        } else {
          toast.error(error.shortMessage || error.message || 'Failed to record feedback on blockchain');
        }

        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [address, walletClient, publicClient]
  );

  /**
   * Get all feedback records for a user
   */
  const getUserFeedback = useCallback(
    async (userAddress: Address) => {
      if (!publicClient) {
        return [];
      }

      try {
        const feedback = await publicClient.readContract({
          address: REPUTATION_REGISTRY_ADDRESS,
          abi: REPUTATION_REGISTRY_ABI,
          functionName: 'getUserFeedback',
          args: [userAddress],
        });

        return feedback;
      } catch (error) {
        console.error('Error getting user feedback:', error);
        return [];
      }
    },
    [publicClient]
  );

  /**
   * Get average rating for a user
   */
  const getAverageRating = useCallback(
    async (userAddress: Address) => {
      if (!publicClient) {
        return { average: 0, count: 0 };
      }

      try {
        const [averageTimes100, count] = await publicClient.readContract({
          address: REPUTATION_REGISTRY_ADDRESS,
          abi: REPUTATION_REGISTRY_ABI,
          functionName: 'getAverageRating',
          args: [userAddress],
        });

        return {
          average: Number(averageTimes100) / 100,
          count: Number(count),
        };
      } catch (error) {
        console.error('Error getting average rating:', error);
        return { average: 0, count: 0 };
      }
    },
    [publicClient]
  );

  return {
    recordFeedback,
    getUserFeedback,
    getAverageRating,
    isSubmitting,
    contractAddress: REPUTATION_REGISTRY_ADDRESS,
  };
}
