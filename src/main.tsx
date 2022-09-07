import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/index.scss';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { AppProvider } from './contexts/AppContext';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider, webSocketProvider } = configureChains([chain.polygon, chain.polygonMumbai], [
        publicProvider(),
        infuraProvider(),
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
