import { useNetwork } from 'wagmi';
// @ts-ignore
import CircularProgress from '../../utils/circularProgress';
import { CountTimer } from './CountTimer';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

export default function SendMessageBox() {

    const { chain } = useNetwork();
    const {
        totalNftMinted,
        totalNftSupply,
    } = useContext(AppContext);

    const openDate = new Date(import.meta.env.VITE_MINT_DATE);

    return (
        <div>
            <div className="koru-box koru-bg-primary mt-6 lg:mt-10 p-10 text-center">
                <p className="lg:text-lg font-medium">
                    Mint a NFT to start your 1st post!
                    <br />
                    January 12, 17:00 CET
                </p>
                <p className="mt-4 font-bold">
                    The Koru DAO NFT minting starts in:
                    <CountTimer direction={'down'}
                                classNames="font-bold ml-2"
                                timestamp={openDate.getTime()} />
                </p>

                <div className="flex justify-center mt-4">
                    <a
                        className="block bg-koru-pink text-white px-6 py-3 rounded-2xl font-medium"
                        href="https://koru.infura-ipfs.io/ipfs/QmVBbqwcdkg4m2bGhCTdRQF1ByDw4pWKUcPfkeRzXJxCo2"
                        target="_blank"
                    >
                        Add it to my calendar
                    </a>
                </div>
            </div>
        </div>
    );
};
