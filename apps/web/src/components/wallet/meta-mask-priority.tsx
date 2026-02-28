import { useEffect, useMemo, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Loader2, ShieldCheck, Wallet } from 'lucide-react';
import { useAccount, useConnect } from 'wagmi';
import { toast } from 'sonner';

import { Button, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

type ProviderInfo = {
  isMetaMask?: boolean;
};

interface MetaMaskPriorityConnectProps {
  className?: string;
  compact?: boolean;
}

export function MetaMaskPriorityConnect({ className, compact }: MetaMaskPriorityConnectProps) {
  const { connectors, connectAsync, status, error, reset } = useConnect();
  const { isConnected } = useAccount();
  const [metaMaskDetected, setMetaMaskDetected] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const anyWindow = window as typeof window & {
      ethereum?: {
        isMetaMask?: boolean;
        providers?: Array<{ isMetaMask?: boolean }>;
      };
    };
    const provider = anyWindow.ethereum;
    if (!provider) {
      setMetaMaskDetected(false);
      return;
    }
    if (provider.isMetaMask) {
      setMetaMaskDetected(true);
      return;
    }
    if (Array.isArray(provider.providers)) {
      setMetaMaskDetected(
        provider.providers.some((item: ProviderInfo | undefined) => item?.isMetaMask)
      );
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const metamaskConnector = useMemo(
    () => connectors.find((connector) => connector.id === 'metaMask'),
    [connectors]
  );

  const isConnecting = status === 'pending';

  const handleMetaMaskConnect = async () => {
    if (!metamaskConnector) {
      toast.error('MetaMask connector unavailable. Use "Other wallets" instead.');
      return;
    }

    try {
      await connectAsync({ connector: metamaskConnector });
      toast.success('MetaMask connected');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to connect MetaMask';
      toast.error(message);
      reset();
    }
  };

  return (
    <Card className={cn('border border-slate-200 bg-white shadow-lg', className)}>
      <CardContent className={cn('space-y-4', compact ? 'p-4' : 'p-6')}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Prioritizing MetaMask
            </p>
            <p className="text-sm text-slate-600">
              {metaMaskDetected
                ? 'MetaMask detected. Launch the extension instantly to stay in sync.'
                : 'MetaMask extension not detected — WalletConnect is available as a backup.'}
            </p>
          </div>
          <Button
            type="button"
            onClick={handleMetaMaskConnect}
            disabled={isConnecting || isConnected || !mounted || !metamaskConnector}
            className="whitespace-nowrap"
          >
            {isConnecting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Connecting…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4" /> {isConnected ? 'Connected' : 'Connect MetaMask'}
              </span>
            )}
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Prefer another wallet?</p>
          <p className="text-slate-500">
            Launch Rainbow or mobile wallets through WalletConnect without leaving this screen.
          </p>
          <div className="mt-4">
            <ConnectButton.Custom>
              {({ openConnectModal, mounted }) => (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={openConnectModal}
                  disabled={!mounted}
                >
                  Choose a different wallet
                </Button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MetaMaskPriorityConnect;
