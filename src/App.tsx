import Header from './components/globals/Header';
import { useAccount } from 'wagmi';
import iconGelato from '@/assets/icons/icon-gelato.svg';
import { AppContext } from './contexts/AppContext';
import { useContext } from 'react';
import SendMessageBox from './components/home/SendMessageBox';
import ConnectModal from './components/modals/ConnectModal';
import PostsBox from './components/home/PostsBox';
import NoHandlerModal from './components/modals/NoHandlerModal';
import MintNft from './components/home/MintNft';
import BuyNft from './components/home/BuyNft';
import { useRegisterSW } from 'virtual:pwa-register/react';
import MintNftModal from './components/modals/MintNftModal';

export default function App() {
    const { isConnected } = useAccount();
    const { connectModal, lensHandler, noLensModal, mintModal, isMinting, nftId, totalNftMinted, totalNftSupply } = useContext(AppContext);

    const intervalMS = 45 * 1000;
    useRegisterSW({
        onRegistered(r: any) {
            r &&
            setInterval(async () => {
                console.log('update')
                await r.update();
            }, intervalMS);
        },
    });

    return (
        <div className="mx-auto container p-5 pb-20 relative">
            <Header />
            <main className="mt-6 lg:mt-20 md:w-[640px] mx-auto">

                {isConnected && !nftId &&
                  <>
                      {
                          totalNftMinted === totalNftSupply ?
                              <BuyNft />
                              :
                              <MintNft />
                      }
                  </>
                }

                <SendMessageBox />
                <PostsBox />

            </main>
            <div className="w-44 mx-auto mt-20">
                <img src={iconGelato} alt="Powered by Gelato" />
            </div>

            {connectModal && <ConnectModal />}

            {isConnected && !lensHandler && noLensModal && <NoHandlerModal />}

            {mintModal && <MintNftModal />}

        </div>
    );
}
