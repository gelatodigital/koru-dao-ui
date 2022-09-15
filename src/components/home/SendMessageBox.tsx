import UiIcon from '../globals/UiIcon';
import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { GelatoRelaySDK } from '@gelatonetwork/relay-sdk';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { BytesLike, Signer } from 'ethers';
import { supportedChains } from '../../blockchain/constants';
import { koruContract } from '../../blockchain/contracts/koruContract.factory';
import { v4 as uuid } from 'uuid';
import { pinToIPFS, uploadToIPFS } from '../../utils/ipfs';
// @ts-ignore
import CircularProgress from '../../utils/circularProgress';
import { CountTimer } from '../globals/CountTimer';

export default function SendMessageBox() {

    const { chain } = useNetwork();
    const { address } = useAccount();
    const { data: signer } = useSigner();

    const { lensHandler, publications, setPublications, userPost, nftId }: any = useContext(AppContext);

    const [userMessage, setUserMessage] = useState<string>('');
    const [isPosted, setIsPosted] = useState<any>(false);
    const [isGettingSignature, setIsGettingSignature] = useState<any>(false);

    const uploadIpfs = async () => {
        const ipfs = {
            version: '1.0.0',
            metadata_id: uuid(),
            description: userMessage,
            content: userMessage,
            external_url: `${supportedChains[chain?.id as number].lensProfileUrl}/u/${supportedChains[chain?.id as number].lensHandle}`,
            image: null,
            imageMimeType: null,
            name: `Post by @${supportedChains[chain?.id as number].lensHandle}`,
            mainContentFocus: 'TEXT',
            contentWarning: null,
            attributes: [
                {
                    traitType: 'string',
                    key: 'type',
                    value: 'post',
                },
            ],
            media: null,
            createdOn: new Date(),
            appId: 'Koru DAO',
        };
        const { path } = await uploadToIPFS(ipfs);
        const pin = await pinToIPFS(path);
        console.log(pin);
        return path;
    };

    const makeLensPost = async () => {
        const targetAddress = supportedChains[chain?.id as number].target;
        const { data } = await getRequestData();

        const relayRequest = {
            chainId: chain?.id,
            target: targetAddress,
            data: data as BytesLike,
            user: address,
        };

        return await GelatoRelaySDK.relayWithSponsoredUserAuthCall(
            relayRequest as any,
            signer?.provider as any,
            'KORU_DAO_KEY',
        );
    };

    const getRequestData = async () => {
        const cid = await uploadIpfs();
        const lensProfileId = supportedChains[chain?.id as number].lensProfileId;
        const contentUri = "https://ipfs.infura.io/ipfs/" + cid;
        const contentModule = supportedChains[chain?.id as number].freeCollectModule;
        const collectModuleInitData = "0x0000000000000000000000000000000000000000000000000000000000000000";
        const referenceModule = "0x0000000000000000000000000000000000000000";
        const referenceModuleInitData = "0x";
        const contract = koruContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);

        return contract.populateTransaction.post([
            lensProfileId,
            contentUri,
            contentModule,
            collectModuleInitData,
            referenceModule,
            referenceModuleInitData],
        );
    };

    const post = async () => {
        try {
            setIsGettingSignature(true);
            const { taskId } = await makeLensPost();
            if (!taskId) {
                throw 'Failed to post message';
            } else {
                setUserMessage('');
                setIsGettingSignature(false);
                setIsPosted(true);
            }

        } catch (e) {
            console.warn('Failed to post message', e);
            setIsGettingSignature(false);
            setIsPosted(false);
        }
    };

    return (
        <div>
            <div className="koru-box mt-6 lg:mt-10 p-10 min-h-[200px]">
                <div className="flex gap-4">
                    <UiIcon icon="logo-pic" classes="w-12 h-12" />
                    <div className="text-left w-full">
                        <h1 className="font-medium">
                            Koru DAO
                        </h1>
                        <p className="koru-gradient-text-1 inline-block font-medium">
                            @Koru DAO
                        </p>
                        <textarea
                            onChange={(e) => setUserMessage(e.target.value)}
                            disabled={isPosted || !nftId || !userPost.canPost || (chain?.id === 137 && !lensHandler) || isGettingSignature || parseInt(String((userMessage.length * 100) / 280)) > 100}
                            rows={4}
                            className="w-full p-4 mt-4 min-h-[100px]"
                            placeholder="Hello, world!"
                            value={userMessage}
                        />
                    </div>
                </div>
            </div>
            {address && <div className="flex justify-end mt-10 items-center gap-6">

                <div className="text-sm opacity-30">

                    {isPosted ?
                        <>
                            <div>
                                You can post again in <CountTimer direction={'down'}
                                                                  timestamp={Date.now() + userPost.postInterval} />.
                            </div>
                        </>
                        :
                        <>
                            {userPost.canPost ?
                                <div>
                                    {userPost.lastPost === 0 ?
                                        nftId ? <p>Go ahead and publish your first post!</p>
                                            : <p>You need to mint a NFT to publish your first post!</p>
                                        :
                                        <p>Your last post was <CountTimer timestamp={userPost.lastPost} /> ago.</p>
                                    }
                                </div>
                                :
                                <div>
                                    You can post again in <CountTimer direction={'down'}
                                                                      timestamp={userPost.lastPost + userPost.postInterval} />.
                                </div>
                            }
                        </>
                    }
                </div>

                <CircularProgress
                  size={25}
                  strokeWidth={2}
                  percentage={parseInt(String((userMessage.length * 100) / 280))}
                  color={`var(--koru-color-${parseInt(String((userMessage.length * 100) / 280)) > 100 ? 'red' : 'purple'})`}
                />
                <button
                  disabled={userMessage.length <= 3 || !nftId || !userPost.canPost || (chain?.id === 137 && !lensHandler) || isGettingSignature || parseInt(String((userMessage.length * 100) / 280)) > 100}
                  onClick={() => post()}
                  className={`koru-btn _primary w-44 flex items-center gap-4 justify-center ${parseInt(String((userMessage.length * 100) / 280)) > 100 ? 'opacity-20' : ''}`}
                >
                    {isGettingSignature ? <UiIcon icon={'loading'} classes="w-6 h-6" /> : 'Post'}
                </button>
            </div>
            }
        </div>
    );
};
