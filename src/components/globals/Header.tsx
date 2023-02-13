import IconLogo from '../../assets/icons/icon-logo.svg';
import PoweredGelato from '../../assets/icons/icon-gelato-header.svg';
import Networks from './Networks';
import { Account } from './Account';
import { useAccount } from 'wagmi';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function Header() {
    const { isConnected } = useAccount();
    const { nftId } = useContext(AppContext);
    return (
        <header className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-5 items-center">
                <img src={IconLogo} alt="Koru DAO" className="w-40" />
                <img
                    src={PoweredGelato}
                    className="w-36 shrink-0"
                    alt="Powered by Gelato"
                />
            </div>
            <div className="mt-6 md:mt-0 items-center gap-2 md:gap-4 flex">
                {isConnected &&
                  <>
                      {nftId && typeof nftId === 'string' &&
                        <img
                          src={`https://ops.infura-ipfs.io/ipfs/QmVUFZH3CcL6cec3Q9p48EWcRWReY8ktMKSZfcPdyBo71H/${nftId}.png`}
                          className="w-10 rounded-xl"
                          alt="Nft"
                        />
                      }
                      <Account />
                  </>

                }
                <Networks />
            </div>
        </header>
    );
};
