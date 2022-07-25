import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { useContext, useEffect } from 'react';

import metamask from '@/assets/icons/icon-metamask.svg';
import walletConnect from '@/assets/icons/icon-wallet-connect.svg';
import { AppContext } from '../../contexts/AppContext';

export default function Networks() {
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();

    const { setConnectModal } = useContext(AppContext);

    const supportedChains = [80001, 137];

    const map: any = {
        metaMask: {
            description: 'Connect to your MetaMask Wallet',
            logo: metamask,
        },
        walletConnect: {
            description: 'Scan with WalletConnect to connect',
            logo: walletConnect,
        },
    };

    useEffect(() => {
        const keyDownHandler = (event: any) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                setConnectModal(false);
            }
        };
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, []);

    return (
        <div className="flex items-center gap-4">
            {isConnected && !supportedChains.includes(chain?.id as number) &&
              <button className="koru-btn _primary" onClick={() => switchNetwork?.(137)}>Switch to Polygon</button>}

            <div>
                {isConnected && (
                    <button
                        onClick={() => disconnect()}
                        className="koru-btn"
                    >
                        Disconnect
                    </button>
                )}

                {!isConnected && <button
                  onClick={() => setConnectModal(true)}
                  className="koru-btn _primary"
                >
                    Connect
                </button>
                }
            </div>

            {error && <p className="text-xs text-gray-400 mt-4">{error.message}</p>}
        </div>
    );
}
