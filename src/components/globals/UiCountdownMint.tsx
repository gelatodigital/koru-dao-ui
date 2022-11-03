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
                    Mint a NFT to start your 1st post!<br />
                    <span>{totalNftSupply - totalNftMinted} </span> Koru DAO NFTs will be available<br />
                    on November 16, 18:00 CET
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
                        href="https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20221111T210000Z%2F20221111T224500Z&details=&location=World&text=KoruDao%20Minting%20Day%21"
                        target="_blank"
                    >
                        Add it to my calendar
                    </a>
                </div>
            </div>
        </div>
    );
};
