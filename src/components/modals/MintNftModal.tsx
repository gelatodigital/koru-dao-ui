import { useContext, useEffect, useState } from 'react';
import KoruModal from '../globals/KoruModal';
import { AppContext } from '../../contexts/AppContext';
import UiIcon from '../globals/UiIcon';

export default function MintNftModal() {

    const { setMintModal, nftId } = useContext(AppContext);

    const [isMinting, setIsMinting] = useState<any>(true);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('minting');
            if (nftId) {
                setIsMinting(false);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <KoruModal
            close={setMintModal}
            modal={
                <div className="lg:min-w-[680px] p-10 flex flex-col items-center gap-10">
                    {isMinting &&
                      <>
                          <div className="h-32 w-32 mx-auto">
                              <UiIcon icon="loading-2" classes="w-32 h-32 absolute animate animate-spin" />
                          </div>
                          <p className="font-bold text-2xl">

                              NFT minting
                          </p>
                      </>
                    }

                    {!isMinting &&
                      <>
                          <div className="h-28 w-28 mx-auto">
                              <UiIcon icon="logo-pic" classes="w-32 h-32" />
                          </div>
                          <p className="font-bold text-3xl">
                              Congratulations!
                          </p>
                          <p>
                              You have successfully minted your Koru DAO NFT, now you can start with your first post.
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
