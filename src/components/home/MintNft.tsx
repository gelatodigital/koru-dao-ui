import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { relayTransit } from '../../blockchain/contracts/relayTransit.factory';
import { supportedChains } from '../../blockchain/constants';
import { ethers, Signer } from 'ethers';
import { useAccount, useNetwork, useProvider, useSigner, useSignTypedData } from 'wagmi';
import { relayV0Send } from '../../utils/relayV0';

export default function MintNft() {

    const {
        lensHandler,
        setMintModal,
        isMinting,
        setIsMinting,
        totalNftMinted,
        totalNftSupply,
        isEligible,
    } = useContext(AppContext);

    const { address } = useAccount();
    const { chain } = useNetwork();
    const { data: signer } = useSigner();
    const provider = useProvider();
    const { signTypedDataAsync } = useSignTypedData();

    const mint = async () => {
        if (chain?.id === 137 && !lensHandler) return;
        try {
            setMintModal(true);
            const contract = relayTransit.connect(supportedChains[chain?.id as number].relayTransit, signer as Signer);

            const domain: any = {
                name: "KoruDaoRelayTransit",
                version: "1",
                chainId: chain?.id,
                verifyingContract: supportedChains[chain?.id as number].relayTransit,
            };

            const mintType = [
                {
                    name: "user",
                    type: "address",
                },
                { name: "nonce", type: "uint256" },
                {
                    name: "deadline",
                    type: "uint256",
                },
            ];

            const types = { Mint: mintType };
            const deadline = (await provider.getBlock("latest")).timestamp + 300;
            const nonce = await contract.nonces(address);

            const message = {
                user: address,
                nonce,
                deadline,
            };


            const signature = await signTypedDataAsync({
                domain,
                types,
                value: message,
            });

            const r = "0x" + signature.substring(2, 66);
            const s = "0x" + signature.substring(66, 130);
            const vStr = signature.substring(130, 132);
            const v = parseInt(vStr, 16);

            const sig = { v, r, s, deadline };

            const fee = ethers.utils.parseEther('0.05'); // TODO: add estimations?
            const data = contract.interface.encodeFunctionData("mint", [
                address,
                fee,
                sig,
            ]);

            const response = await relayV0Send(
                Number(chain?.id),
                supportedChains[chain?.id as number].relayTransit,
                data,
                fee.toString(),
                10_000_000,
            );

            if (response) {
                setIsMinting(true);
            }
        } catch (e) {
            debugger;
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
                            <span>{totalNftSupply - totalNftMinted} </span>
                            Koru DAO NFTs available
                        </p>
                        {!lensHandler &&
                          <p className="text-red-600 text-sm block">
                              You must have a Lens handle to mint.
                          </p>
                        }
                        {lensHandler && !isEligible &&
                          <p className="text-red-600 text-sm block">
                              You are not eligible to mint :(
                          </p>
                        }
                    </div>
                </div>
                <button
                    disabled={chain?.id === 137 && !lensHandler || !isEligible}
                    style={chain?.id === 137 && !lensHandler || !isEligible ? { opacity: 0.5 } : {}}
                    onClick={() => mint()}
                    className="koru-btn _pink inline-block"
                >
                    Mint NFT now
                </button>
            </div>
        </div>
    );
};
