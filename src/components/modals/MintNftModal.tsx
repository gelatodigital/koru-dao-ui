import { useContext, useEffect, useState } from 'react';
import KoruModal from '../globals/KoruModal';
import { AppContext } from '../../contexts/AppContext';
import UiIcon from '../globals/UiIcon';

export default function MintNftModal(props: any) {

    const { setMintModal, nftId, isMinting, setIsMinting } = useContext(AppContext);
    const [isMinted, setIsMinted] = useState<any>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (nftId) {
                setIsMinted(true);
                setIsMinting(false);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [props]);

    return (
        <KoruModal
            close={setMintModal}
            modal={
                <div className="lg:min-w-[680px] p-10 flex flex-col items-center gap-10">
                    {!isMinted && isMinting &&
                      <>
                          <div className="h-32 w-32 mx-auto">
                              <UiIcon icon="loading-2" classes="w-32 h-32 absolute animate animate-spin" />
                          </div>
                          <p className="font-bold text-2xl">
                              NFT minting... please wait a moment...
                          </p>
                      </>
                    }

                    {!isMinted && !isMinting &&
                      <>
                          <div className="h-28 w-28 mx-auto">
                              <UiIcon icon="logo-pic" classes="w-32 h-32" />
                          </div>
                          <p className="font-bold text-2xl">
                              Please sign in your wallet to mint your NFT
                          </p>
                      </>
                    }

                    {isMinted &&
                      <>
                          <img
                            src={`https://ops.infura-ipfs.io/ipfs/QmVUFZH3CcL6cec3Q9p48EWcRWReY8ktMKSZfcPdyBo71H/${nftId}.png`}
                            className="w-64 rounded-full"
                            alt="Nft"
                          />
                          <p className="font-bold text-3xl">
                              Congratulations!
                          </p>
                          <p>
                              You have successfully minted your Koru DAO NFT, now you can start with your first
                              post.
                          </p>
                          <button
                            onClick={() => setMintModal(false)}
                            className="koru-btn _pink">Start post
                          </button>
                      </>
                    }
                </div>
            }
        />
    );
};
