import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { nftContract } from '../../blockchain/nftContract.factory';
import { supportedChains } from '../../blockchain/constants';
import { ethers, Signer } from 'ethers';
import { GelatoRelaySDK } from '@gelatonetwork/gelato-relay-sdk';
import { useAccount, useNetwork, useProvider, useSigner, useSignTypedData } from 'wagmi';
import MintNftModal from '../modals/MintNftModal';

export default function MintNft() {

    const { lensHandler, setMintModal, mintModal, totalNftMinted, totalNftSupply } = useContext(AppContext);
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { signTypedDataAsync } = useSignTypedData();
    const { data: signer } = useSigner();
    const provider = useProvider();

    const [isMinting, setIsMinting] = useState<any>(false);

    const mint = async () => {
        if (!lensHandler) return;
        try {
            setMintModal(true);
            const contract = nftContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);
            const { address: metaboxAddress, abi: metaboxAbi } =
                GelatoRelaySDK.getMetaBoxAddressAndABI(chain?.id as number);

            const metaBox = new ethers.Contract(metaboxAddress, metaboxAbi, provider);
            const nonce = Number(await metaBox.nonce(address));

            const metaTxRequest = GelatoRelaySDK.metaTxRequest(
                chain?.id as number,
                supportedChains[chain?.id as number].nft,
                contract.interface.encodeFunctionData("mint", []),
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

            setIsMinting(true);

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
                throw 'Failed to mint';
            }
        } catch (e) {
            setMintModal(false);
            setIsMinting(false);
        }
    };

    return (
        <div className="koru-bg-primary px-6 py-4 rounded-2xl">
            <div className="flex items-center gap-4 justify-between flex-col lg:flex-row">
                <figure className="w-14 shrink-0">
                    <img alt="Nft" src="/images/nft.png" className="rounded-full inline-block" />
                </figure>
                <div className="text-center lg:text-left">
                    <p className="font-bold text-lg koru-gradient-text-3">
                        {totalNftMinted}/ {totalNftSupply} Koru DAO NFTs available
                    </p>
                    {!lensHandler && <p className="text-red-600 text-sm block">
                        You must have a Lens handle to mint.
                    </p>}
                </div>
                <button
                    disabled={!lensHandler}
                    style={!lensHandler ? { opacity: 0.5 } : {}}
                    onClick={() => mint()}
                    className="koru-btn _pink inline-block"
                >
                    Mint NFT now
                </button>
            </div>

            {mintModal && <MintNftModal propIsMinting={isMinting} />}
        </div>
    );
};
