import { useAccount, useConnect } from 'wagmi';
import { useContext } from 'react';

import metamask from '@/assets/icons/icon-metamask.svg';
import walletConnect from '@/assets/icons/icon-wallet-connect.svg';
import { AppContext } from '../../contexts/AppContext';

export default function ConnectModal() {
    const { connector } = useAccount();
    const { connect, connectors, isLoading, pendingConnector } = useConnect();

    const handleConnect = async (connector: any) => {
        setConnectModal(false);
        connect(connector);
    };

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

    const { setConnectModal } = useContext(AppContext);

    return (
        <div className="koru-modal">

            <div className="relative">
                <div className="bg-white p-2 text-white rounded-2xl grid lg:grid-cols-2 relative">
                    {connectors
                        .filter((x) => x.ready && x.id !== connector?.id)
                        .map((x) => (
                            <div
                                key={x.id}
                                className="p-4 lg:first-of-type:border-r m-auto">
                                <button onClick={() => handleConnect({ connector: x })}
                                        className="text-black flex flex-col items-center gap-2 hover:bg-gray-100 hover:bg-opacity-50 rounded-2xl lg:p-6 transition-colors"
                                >
                                    <img className="w-10 h-10 lg:w-44 lg:h-44" src={map[x.id].logo} alt={x.name} />
                                    <p className="font-bold text-black text-2xl">{x.name}</p>
                                    <p className="text-koru-gray-light">{map[x.id].description}</p>
                                    {isLoading && x.id === pendingConnector?.id && ' (connecting)'}
                                </button>
                            </div>
                        ))}
                </div>
                <span className="cursor-pointer p-3 absolute text-black icon-close top-1 right-3 hover:opacity-50" onClick={() => setConnectModal(false)} />
            </div>
        </div>
    );
}
