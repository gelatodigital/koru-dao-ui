import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { supportedChains } from '../blockchain/constants';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { nftContract } from '../blockchain/nftContract.factory';
import { GET_DEFAULT_PROFILES, GET_PUBLICATIONS } from '../utils/utils';
import { Signer } from 'ethers';
import request from 'graphql-request';
import { koruContract } from '../blockchain/koruContract.factory';

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

    const [lastPost, setLastPost] = useState<string | null>(null);
    const [nftID, setNftID] = useState<string | null>(null);
    const [lensHandler, setLensHandler] = useState<number | null>(null);
    const [noLensModal, setNoLensModal] = useState<boolean>(false);
    const [publications, setPublications] = useState<any[]>([]);

    const getNft = async () => {
        try {
            const contract = nftContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);
            const tokenId = await contract.balanceOf(address);

            if (tokenId.toString() !== '0') {
                setNftID(tokenId.toString());
            }
        } catch (err) {
            setNftID(null);
            console.warn('No nft was found');
        }
    };

    const getLastPost = async () => {
        try {
            const contract = koruContract.connect(supportedChains[chain?.id as number].koru, signer as Signer);
            const lastPost = await contract.lastPost(address);
            if (lastPost) {
                setLastPost(lastPost);
            }

        } catch (err) {
            console.warn('No lastPost was found');
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
            if (!defaultProfile) {
                setNoLensModal(true);
            }
        } catch (err) {
            setNoLensModal(true);
            console.warn('No lens handler was found');
        }
    };


    const fetchPosts = async () => {
        try {
            const query = {
                "profileId": supportedChains[chain?.id as number]?.lensProfileId,
                "publicationTypes": ["POST", "COMMENT", "MIRROR"],
            };
            const { publications } = await request(supportedChains[chain?.id as number].lensUrl, GET_PUBLICATIONS, {
                request: query,
            });

            setPublications(publications?.items);
        } catch (err) {
            console.warn('No lens handler was found');
        }
    };

    useEffect(() => {
        if (!signer || !isConnected || !address || !supportedChains[chain?.id as number]?.nft) {
            return;
        }

        fetchPosts();
        getNft();
        fetchAndUpdateLensHandle();
        getLastPost();

        const interval = setInterval(() => {
            fetchPosts();
            getNft();
            getLastPost();
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
                publications,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default { AppProvider, AppContext };
