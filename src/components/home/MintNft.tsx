import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { nftContract } from '../../blockchain/contracts/nftContract.factory';
import { supportedChains } from '../../blockchain/constants';
import { BytesLike, Signer } from 'ethers';
import { useAccount, useNetwork, useProvider, useSigner, useSignTypedData } from 'wagmi';
import MintNftModal from '../modals/MintNftModal';
import { GelatoRelaySDK } from '@gelatonetwork/relay-sdk';

export default function MintNft() {

    const { lensHandler, setMintModal, isMinting, setIsMinting, totalNftMinted, totalNftSupply } = useContext(AppContext);
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { signTypedDataAsync } = useSignTypedData();
    const { data: signer } = useSigner();
    const provider = useProvider();

    const mint = async () => {
        if (chain?.id === 137 && !lensHandler) return;
        try {
            setMintModal(true);
            const contract = nftContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);

            const { data } = await contract.populateTransaction.mint([]);

            const relayRequest = {
                chainId: chain?.id,
                target: supportedChains[chain?.id as number].nft,
                data: data as BytesLike,
                user: address,
            };

            const { taskId } = await GelatoRelaySDK.relayWithSponsoredUserAuthCall(
                relayRequest as any,
                signer?.provider as any,
                'KORU_DAO_KEY',
            );

            if (taskId) {
                setIsMinting(true);
            }
        } catch (e) {
            setMintModal(false);
            setIsMinting(false);
        }
    };

    return (
        <div className="koru-bg-primary px-6 py-4 rounded-2xl">
            <div className="flex items-center gap-4 justify-between flex-col lg:flex-row">
                <div className="flex items-center gap-6">
                    <figure className="w-14 shrink-0">
                        <img alt="Nft" src="/images/nft.png" className="rounded-full inline-block" />
                    </figure>
                    <div className="text-center lg:text-left">
                        <p className="font-bold text-lg koru-gradient-text-3">
                            {chain?.id === 137 && <span>{totalNftSupply - totalNftMinted} </span>}
                            Koru DAO NFTs available
                        </p>
                        {chain?.id === 137 && !lensHandler && <p className="text-red-600 text-sm block">
                            You must have a Lens handle to mint.
                        </p>}
                    </div>
                </div>
                <button
                    disabled={chain?.id === 137 && !lensHandler}
                    style={chain?.id === 137 && !lensHandler ? { opacity: 0.5 } : {}}
                    onClick={() => mint()}
                    className="koru-btn _pink inline-block"
                >
                    Mint NFT now
                </button>
            </div>
        </div>
    );
};
