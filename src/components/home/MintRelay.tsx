import { GelatoRelaySDK } from "@gelatonetwork/gelato-relay-sdk";
import { useAccount, useNetwork, useProvider, useSigner, useSignTypedData } from 'wagmi';
import { supportedChains } from '../../blockchain/constants';
import { ethers, Signer } from 'ethers';
import { nftContract } from '../../blockchain/nftContract.factory';

export default function MintRelay({ onMint }: any) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { signTypedDataAsync } = useSignTypedData();
    const { data: signer } = useSigner();
    const provider = useProvider();

    const mint = async () => {

        try {
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

            // const requestId = await GelatoRelaySDK.sendForwardRequest(forwardRequest, sponsorSignature);
            const res = await fetch('https://relay-sponsor-backend.herokuapp.com/sponsor/sign', {
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
            onMint(true);
        } catch (e) {
            alert('Something went wrong, please try again.');
        }
    };

    return (
        <button
            className="mt-10 koru-btn _primary lg:w-96"
            onClick={() => mint()}
        >
            Mint now for FREE
        </button>
    );
};
