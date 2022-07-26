import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { supportedChains } from '../blockchain/constants';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { nftContract } from '../blockchain/nftContract.factory';
import { GET_DEFAULT_PROFILES } from '../utils/utils';
import { Signer } from 'ethers';
import request from 'graphql-request';

const contextDefaultValues: any = {
    connectModal: true,
};

export const AppContext = createContext<any>(contextDefaultValues);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
    const { data: signer } = useSigner();
    const [connectModal, setConnectModal] = useState<boolean>(false);
    const [mintModal, setMintModal] = useState<boolean>(false);

    const [nftID, setNftID] = useState<string | null>(null);
    const [lensHandler, setLensHandler] = useState<number | null>(null);
    const [noLensModal, setNoLensModal] = useState<boolean>(true);

    const getNft = async () => {
        try {
            const contract = nftContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);
            const tokenId = await contract.tokenOfOwnerByIndex(address, 0);
            if (!tokenId) return;
            const tokenUri = await contract.tokenURI(tokenId);

            if (tokenUri) {
                setNftID(tokenUri);
            }
        } catch (err) {
            setNftID(null);
            console.warn('No nft was found');
        }
    };

    const fetchAndUpdateLensHandle = async () => {
        try {

            const { defaultProfile } = await request(supportedChains[chain?.id as number].lensUrl, GET_DEFAULT_PROFILES, {
                request: {
                    ethereumAddress: address?.toLowerCase(),
                },
            });
            setLensHandler(defaultProfile);
        } catch (err) {
            setNoLensModal(true);
            console.warn('No lens handler was found');
        }
    };

    useEffect(() => {
        if (!signer || !isConnected || !address || !supportedChains[chain?.id as number]?.nft) {
            return;
        }

        getNft();
        fetchAndUpdateLensHandle();

        const interval = setInterval(() => {
            // not needed yet.
        }, 10000);

        return () => clearInterval(interval);
    }, [address, isConnected, chain, signer]);

    return (
        <AppContext.Provider
            value={{
                connectModal,
                setConnectModal,
                nftID,
                lensHandler,
                noLensModal,
                setNoLensModal,
                mintModal,
                setMintModal,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default { AppProvider, AppContext };
