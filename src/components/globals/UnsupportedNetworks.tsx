import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { supportedChains } from '../../blockchain/constants';

export default function UnsupportedNetwork() {
    const { isConnected } = useAccount();
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();

    const supportedChainsIds = Object.keys(supportedChains).map(key => parseInt(key));

    return (
        <div className="flex items-center flex-col gap-4">
            {isConnected && !supportedChainsIds.includes(chain?.id as number) &&
              <button className="koru-btn _primary _small" onClick={() => switchNetwork?.(137)}>
                  Switch to Polygon
              </button>
            }
        </div>
    );
}
