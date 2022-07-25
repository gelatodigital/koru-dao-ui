import { useState } from 'react';
import loadingIcon from '@/assets/icons/icon-loading.svg';
import MintRelay from './MintRelay';

export default function MintNft() {

    const [isMinting, setIsMinting] = useState<any>(false);

    const handleMinting = () => {
        setIsMinting(true);
    };

    return (
        <div className="setModal mx-auto">
            <div className="">

                {!isMinting &&
                  <div className="">
                      <p className="font-black text-lg lg:text-3xl mt-6">
                          Time to mint your ice-cream!
                      </p>
                      <p className="mt-10">
                          Our <strong className="text-koru-blue">Relay SDK</strong> makes it easy for developers to add
                          gasless transactions to their applications.
                      </p>

                      <MintRelay onMint={handleMinting} />

                      <p className="mt-10">
                          To test it out click to mint and sign the transaction.
                          <br /> Your NFT will be minted for free.
                      </p>
                  </div>
                }

                {isMinting &&
                  <div className="">
                      <p className="font-black text-3xl mt-6">
                          Your NFT is being minted...
                      </p>
                      <img alt="Minting" className="mt-6 w-12 mx-auto" src={loadingIcon} />
                  </div>
                }
            </div>
        </div>
    );
};
