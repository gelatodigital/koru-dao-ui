import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function MintNft() {

    const { lensHandler, noLensModal, mintModal, setMintModal } = useContext(AppContext);

    const [isMinting, setIsMinting] = useState<any>(false);

    const handleMinting = () => {
        setIsMinting(true);
    };

    return (
        <div className="koru-bg-primary px-6 py-4 rounded-2xl">
            <div className="flex items-center gap-4 justify-between flex-col lg:flex-row">
                <figure className="w-14 shrink-0">
                    <img alt="Nft" src="/images/nft.png" className="rounded-full inline-block" />
                </figure>
                <div className="text-center lg:text-left">
                    <p className="font-bold text-lg koru-gradient-text-3">
                        100/ 1000 Koru DAO NFTs available
                    </p>
                    {!lensHandler && <p className="text-red-600 text-sm block">
                        You must have a Lens handle to mint.
                    </p>}
                </div>
                <button
                    style={!lensHandler ? { opacity: 0.5 } : {}}
                    disabled={!lensHandler}
                    onClick={() => setMintModal(true)}
                    className="koru-btn _pink inline-block"
                >
                    Mint NFT now
                </button>
            </div>
        </div>
    );
};
