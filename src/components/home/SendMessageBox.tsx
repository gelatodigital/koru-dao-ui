import UiIcon from '../globals/UiIcon';
import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { GelatoRelaySDK } from '@gelatonetwork/gelato-relay-sdk';
import { useAccount, useNetwork, useProvider, useSigner, useSignTypedData } from 'wagmi';
import { ethers, Signer } from 'ethers';
import { supportedChains } from '../../blockchain/constants';
import { koruContract } from '../../blockchain/koruContract.factory';

export default function SendMessageBox() {

    const { chain } = useNetwork();
    const provider = useProvider();
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const { signTypedDataAsync } = useSignTypedData();

    const { lensHandler }: any = useContext(AppContext);

    const [isPosting, setIsPosting] = useState<any>(false);
    const [isGettingSignature, setIsGettingSignature] = useState<any>(false);

    const post = async () => {
        try {
            setIsGettingSignature(true);
            const lensProfileId = supportedChains[chain?.id as number].lensProfileId;
            const contentUri = "";
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

            setIsPosting(true);

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
            }

        } catch (e) {
            console.warn('Failed to post message', e);
            setIsGettingSignature(false);
            setIsPosting(false);
        } finally {
            setIsGettingSignature(false);
            setIsPosting(false);
        }
    };

    return (
        <div>
            <div className="koru-box mt-6 lg:mt-10 p-10">
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
                            disabled={!lensHandler}
                            rows={4}
                            className="w-full p-4 mt-4 min-h-[100px]"
                            placeholder="Hello, world!"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-10">
                <button
                    disabled={!lensHandler || isGettingSignature}
                    onClick={() => post()}
                    className="koru-btn _primary w-44 flex items-center gap-4 justify-center"
                >
                    {isGettingSignature ? <UiIcon icon={'loading'} classes="w-6 h-6" /> : 'Post'}
                </button>
            </div>
        </div>
    );
};
