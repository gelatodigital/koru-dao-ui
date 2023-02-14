import { useContext, useEffect, useState } from 'react';
import KoruModal from '../globals/KoruModal';
import { AppContext } from '../../contexts/AppContext';
import UiIcon from '../globals/UiIcon';
import axios from 'axios';

export default function MintNftModal(props: any) {

    const { setMintModal, nftId, isMinting, setIsMinting, mintTaskId, setMintTaskId } = useContext(AppContext);
    const [isMinted, setIsMinted] = useState<any>(false);
    const [isMintError, setIsMintError] = useState<any>(false);

    async function getTaskStatus() {
        if (!mintTaskId) return;
        const { data } = await axios.get('https://relay.gelato.digital/tasks/status/' + mintTaskId);
        if (data.task.taskState === 'Cancelled') {
            setIsMintError(true);
            setMintTaskId(null);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (nftId) {
                setIsMinted(true);
                setIsMinting(false);
            }
        }, 500);

        const intervalTaskApi = setInterval(() => getTaskStatus(), 3000);

        return () => {
            clearInterval(interval);
            clearInterval(intervalTaskApi);
        };
    }, [props]);

    return (
        <KoruModal
            close={setMintModal}
            modal={
                <div className="lg:min-w-[680px] p-10 flex flex-col items-center gap-10">

                    {isMintError ?

                        <>
                            <p className="font-bold text-xl">
                                Your mint was unsuccessful. Please try again or
                                <a href="https://discord.gg/rsAS5Gtc"
                                   className="koru-btn _primary mx-auto mt-6 inline-block"
                                   target="_blank"
                                >
                                    reach out to us.
                                </a>
                            </p>
                            <button className="koru-btn _primary" onClick={() => setMintModal(false)}>
                                close
                            </button>
                        </>

                        :

                        <>
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
                        </>
                    }
                </div>
            }
        />
    );
};
