import crypto from 'crypto';

import { config } from '../config';

/**
 * IPFS Service — uploads review content (JSON) to IPFS via Pinata.
 * Falls back to computing a local SHA-256 content hash if Pinata is not configured.
 *
 * Used by reviewService to store immutable review content on IPFS (SRS FR-J7.7).
 */

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export class IpfsService {
  private readonly apiKey: string | undefined;
  private readonly secretKey: string | undefined;
  private readonly gateway: string;

  constructor() {
    this.apiKey = config.ipfs.pinataApiKey;
    this.secretKey = config.ipfs.pinataSecretKey;
    this.gateway = config.ipfs.gateway;
  }

  /**
   * Whether the Pinata IPFS integration is configured.
   */
  get isConfigured(): boolean {
    return !!(this.apiKey && this.secretKey);
  }

  /**
   * Upload JSON content to IPFS via Pinata.
   * Returns the IPFS CID (content hash).
   * Falls back to a local SHA-256 hash if Pinata is not configured.
   */
  async uploadJSON(data: Record<string, unknown>, name?: string): Promise<string> {
    if (!this.isConfigured) {
      // Fallback: compute deterministic SHA-256 hash of the content
      const json = JSON.stringify(data, null, 0);
      return `sha256:${crypto.createHash('sha256').update(json).digest('hex')}`;
    }

    const body = JSON.stringify({
      pinataContent: data,
      pinataMetadata: { name: name ?? 'detrust-content' },
    });

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: this.apiKey!,
        pinata_secret_api_key: this.secretKey!,
      },
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[IpfsService] Pinata upload failed:', text);
      // Fallback to local hash on failure
      const json = JSON.stringify(data, null, 0);
      return `sha256:${crypto.createHash('sha256').update(json).digest('hex')}`;
    }

    const result = (await response.json()) as PinataResponse;
    return result.IpfsHash;
  }

  /**
   * Get the gateway URL for an IPFS CID.
   */
  getGatewayUrl(cid: string): string {
    if (cid.startsWith('sha256:')) {
      return ''; // Local hash, no gateway URL
    }
    return `${this.gateway}/${cid}`;
  }
}

export const ipfsService = new IpfsService();
export default ipfsService;