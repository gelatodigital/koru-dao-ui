import UiIcon from '../globals/UiIcon';
import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { GelatoRelaySDK } from '@gelatonetwork/relay-sdk';
import { useAccount, useNetwork, useProvider, useSigner, useSignTypedData } from 'wagmi';
import { BytesLike, ethers, Signer } from 'ethers';
import { supportedChains } from '../../blockchain/constants';
import { koruContract } from '../../blockchain/contracts/koruContract.factory';
import { v4 as uuid } from 'uuid';
import uploadToIPFS from '../../utils/ipfs';
// @ts-ignore
import CircularProgress from '../../utils/circularProgress';
import { CountTimer } from '../globals/CountTimer';

export default function SendMessageBox() {

    const { chain } = useNetwork();
    const provider = useProvider();
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { signTypedDataAsync } = useSignTypedData();

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
            external_url: `${supportedChains[chain?.id as number].lensProfileUrl}${supportedChains[chain?.id as number].lensHandle}`,
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
        return path;
    };

    const testLensPost = async () => {
        // Not sure if this is the correct target contract address
        const targetAddress = "0x2334Bb5d5A1547970767315dE048e939C94D6E34";
        const { data } = await getRequestData();

        const relayRequest = {
            chainId: chain?.id,
            target: targetAddress,
            data: data as BytesLike,
            user: address,
        };

        const _provider = new ethers.providers.Web3Provider(window.ethereum as any);

        const relayResponse = await GelatoRelaySDK.relayWithSponsoredUserAuthCall(
            relayRequest as any,
            _provider,
            'KORU_DAO_KEY',
        );

        console.log(relayResponse);
    };

    const testIncrementContext = async () => {
        const counterAddress = "0x30d97B13e29B0cd42e6ebd48dbD9063465bF1997";
        const abi = ["function incrementContext()"];
        const contract = new ethers.Contract(counterAddress, abi, signer as any);
        const { data } = await contract.populateTransaction.incrementContext();
        const relayRequest = {
            chainId: chain?.id,
            target: counterAddress,
            data: data as BytesLike,
            user: address,
        };
        const _provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const relayResponse = await GelatoRelaySDK.relayWithSponsoredUserAuthCall(
            relayRequest as any,
            _provider,
            'KORU_DAO_KEY',
        );
        console.log(relayResponse);
    };

    const getRequestData = async () => {
        const ipfs = await uploadIpfs();
        const lensProfileId = supportedChains[chain?.id as number].lensProfileId;
        const contentUri = "https://ipfs.infura.io/ipfs/" + ipfs;
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
            const ipfs = await uploadIpfs();
            const lensProfileId = supportedChains[chain?.id as number].lensProfileId;
            const contentUri = "https://ipfs.infura.io/ipfs/" + ipfs;
            const contentModule = supportedChains[chain?.id as number].freeCollectModule;
            const collectModuleInitData = "0x0000000000000000000000000000000000000000000000000000000000000000";
            const referenceModule = "0x0000000000000000000000000000000000000000";
            const referenceModuleInitData = "0x";

            const { address: metaboxAddress, abi: metaboxAbi } =
                GelatoRelaySDK.getMetaBoxAddressAndABI(chain?.id as number);
            const contract = koruContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);
            const metaBox = new ethers.Contract(metaboxAddress, metaboxAbi, provider);
            const nonce = Number(await metaBox.nonce(address));

            const koruDaoPostData = contract.interface.encodeFunctionData("post", [
                [
                    lensProfileId,
                    contentUri,
                    contentModule,
                    collectModuleInitData,
                    referenceModule,
                    referenceModuleInitData,
                ],
            ]);

            const metaTxRequest = GelatoRelaySDK.metaTxRequest(
                chain?.id as number,
                supportedChains[chain?.id as number].koru,
                koruDaoPostData,
                "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                2,
                ethers.utils.parseEther(supportedChains[chain?.id as number].maxFee).toString(),
                '20000000',
                address as string,
                nonce,
                supportedChains[chain?.id as number].sponsor,
            );

            // Get transaction data
            const metaTxRequestData = GelatoRelaySDK.getMetaTxRequestWalletPayloadToSign(metaTxRequest);
            const userSignature = await signTypedDataAsync(metaTxRequestData);

            const resp = await fetch('https://relay-sponsor-backend.herokuapp.com/sponsor/sign', {
                method: "POST",
                headers: {
                    cache: "no-cache",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userSignature,
                    metaTxRequest,
                }),
            });

            if (!resp.ok) {
                throw 'Failed to post message';
            } else {
                // addPostToPublications(); // has to be improved for new messages do not overwrite
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
            <div className="flex gap-3">
                <span className="border p-3 bg-koru-gray text-white" onClick={() => testIncrementContext()}>Test Increment Context</span>
                <span className="border p-3 bg-koru-gray text-white" onClick={() => testLensPost()}>Test Lens post</span>
            </div>
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
                        {!isPosted ?
                            <textarea
                                onChange={(e) => setUserMessage(e.target.value)}
                                disabled={!nftId || !userPost.canPost || (chain?.id === 137 && !lensHandler) || isGettingSignature || parseInt(String((userMessage.length * 100) / 280)) > 100}
                                rows={4}
                                className="w-full p-4 mt-4 min-h-[100px]"
                                placeholder="Hello, world!"
                            /> :
                            <div className="text-center mt-8 font-bold">Your post is being processed.</div>
                        }
                    </div>
                </div>
            </div>
            {address && !isPosted && <div className="flex justify-end mt-10 items-center gap-6">

                <div className="text-sm opacity-30">
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
                </div>

                <CircularProgress
                  size={25}
                  strokeWidth={2}
                  percentage={parseInt(String((userMessage.length * 100) / 280))}
                  color={`var(--koru-color-${parseInt(String((userMessage.length * 100) / 280)) > 100 ? 'red' : 'purple'})`}
                />
                <button
                  disabled={!nftId || !userPost.canPost || (chain?.id === 137 && !lensHandler) || isGettingSignature || parseInt(String((userMessage.length * 100) / 280)) > 100}
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
