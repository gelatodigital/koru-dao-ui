import IconLogo from '../../assets/icons/icon-logo.svg';
import Networks from './Networks';
import { Account } from './Account';
import { useAccount } from 'wagmi';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function Header() {
    const { isConnected } = useAccount();
    const { nftId } = useContext(AppContext);
    return (
        <header className="flex justify-between items-center">
            <img src={IconLogo} alt="Koru DAO" className="w-40" />
            <div className="items-center gap-4 hidden lg:flex">
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
