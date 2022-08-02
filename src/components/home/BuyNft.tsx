import { supportedChains } from '../../blockchain/constants';
import { useNetwork } from 'wagmi';

export default function BuyNft() {

    const { chain } = useNetwork();

    return (
        <div className="koru-bg-primary px-6 py-4 rounded-2xl">
            <div className="flex items-center gap-4 justify-between flex-col lg:flex-row">
                <div className="flex items-center gap-6">
                    <figure className="w-14 shrink-0">
                        <img alt="Nft" src="/images/nft.png" className="rounded-full inline-block" />
                    </figure>
                    <div className="text-center lg:text-left">
                        <p className="font-bold text-lg koru-gradient-text-3">
                            The Minting Period is Over, Get a Koru DAO NFT on OpenSea
                        </p>
                    </div>
                </div>
                <a
                    href={`${supportedChains[chain?.id as number ?? 137].openSeaUrl}`}
                    className="koru-btn _pink inline-block"
                    target='_blank'
                >
                    Get NFT now
                </a>
            </div>

        </div>
    );
};
