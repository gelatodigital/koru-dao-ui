import Header from './components/globals/Header';
import { useAccount } from 'wagmi';
import iconGelato from '@/assets/icons/icon-gelato.svg';
import { AppContext } from './contexts/AppContext';
import { useContext } from 'react';
import ConnectModal from './components/globals/ConnectModal';

export default function App() {
    const { isConnected } = useAccount();
    const { connectModal, nftID, isWinner, hasClaimed, opsTaskId } = useContext(AppContext);

    return (
        <div className="mx-auto container p-5 pb-20 relative">
            <Header />
            <main className={'text-center mt-6 lg:mt-20'}>

                <div className='koru-box mt-6 lg:mt-10 md:w-[640px] mx-auto'>
                    Hello Koru
                </div>

            </main>

            <div className="w-44 mx-auto mt-20">
                <img src={iconGelato} alt="Powered by Gelato" />
            </div>

            {connectModal && <ConnectModal />}
        </div>
    );
}
