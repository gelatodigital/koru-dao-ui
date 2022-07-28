import UiIcon from '../globals/UiIcon';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { GelatoRelaySDK } from '@gelatonetwork/gelato-relay-sdk';
import { useAccount, useNetwork, useProvider, useSigner } from 'wagmi';
import { ethers, Signer } from 'ethers';
import { supportedChains } from '../../blockchain/constants';
import { koruContract } from '../../blockchain/koruContract.factory';

export default function SendMessageBox() {

    const { chain } = useNetwork();
    const provider = useProvider();
    const { address } = useAccount();
    const { data: signer } = useSigner();

    const { lensHandler }: any = useContext(AppContext);
    const lensProfileId = lensHandler?.handle;
    const contentUri = "Hello";
    const contentModule = "0x23b9467334bEb345aAa6fd1545538F3d54436e96";
    const collectModuleInitData = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const referenceModule = "0x0000000000000000000000000000000000000000";
    const referenceModuleInitData = "0x";

    const { address: metaboxAddress, abi: metaboxAbi } =
        GelatoRelaySDK.getMetaBoxAddressAndABI(chain?.id as number);

    const post = async () => {
        try {
            const contract = koruContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);
            const metaBox = new ethers.Contract(metaboxAddress, metaboxAbi, provider);
            const nonce = Number(await metaBox.nonce(address));

            const koruDaoPostData = contract.interface.encodeFunctionData("post", [
                lensProfileId,
                contentUri,
                contentModule,
                collectModuleInitData,
                referenceModule,
                referenceModuleInitData,
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

            debugger;
        } catch (e) {
            console.log(e);
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
                    disabled={!lensHandler}
                    onClick={() => post()}
                    className="koru-btn _primary w-44"
                >
                    Post
                </button>
            </div>
        </div>
    );
};
