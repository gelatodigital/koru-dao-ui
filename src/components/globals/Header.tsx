import IconLogo from '../../assets/icons/icon-logo.svg';
import PoweredGelato from '../../assets/icons/icon-gelato-header.svg';
import Networks from './Networks';
import { Account } from './Account';
import { useAccount, useNetwork } from 'wagmi';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { supportedChains } from '../../blockchain/constants';

export default function Header() {
    const { isConnected } = useAccount();
    const { nftId } = useContext(AppContext);
    const { chain } = useNetwork();

    const currentChain = supportedChains[chain?.id as number];
    const openSeaUrl = `${currentChain?.openSeaUrl}${currentChain?.nft}/${nftId}`;

    return (
        <header className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-5 items-center">
                <img src={IconLogo} alt="Koru DAO" className="w-40" />
                <a href="https://www.gelato.network/"
                   target="_blank"
                >
                    <img
                        src={PoweredGelato}
                        className="w-36 shrink-0"
                        alt="Powered by Gelato"
                    />
                </a>
            </div>
            <div className="mt-6 md:mt-0 items-center gap-2 md:gap-4 flex">
                {isConnected &&
                  <>
                      {nftId && typeof nftId === 'string' &&
                        <a href={openSeaUrl} target="_blank">
                            <img
                              src={`https://ops.infura-ipfs.io/ipfs/QmVUFZH3CcL6cec3Q9p48EWcRWReY8ktMKSZfcPdyBo71H/${nftId}.png`}
                              className="w-10 rounded-xl"
                              alt="Nft"
                            />
                        </a>
                      }
                      <Account />
                  </>

                }
                <Networks />
            </div>
        </header>
    );
};
