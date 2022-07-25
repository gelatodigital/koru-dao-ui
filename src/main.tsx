import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/index.scss';
import { allChains, configureChains, createClient, WagmiConfig, chain } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { AppProvider } from './contexts/AppContext';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const infuraId = import.meta.env.VITE_INFURA_KEY;

const { chains, provider, webSocketProvider } = configureChains([chain.polygon, chain.polygonMumbai], [
        publicProvider(),
        infuraProvider({ infuraId }),
    ],
);

const client = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
            chains,
            options: {
                qrcode: true,
            },
        }),
    ],
    provider,
    webSocketProvider,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <WagmiConfig client={client}>
            <AppProvider>
                <App />
            </AppProvider>
        </WagmiConfig>
    </StrictMode>,
);
