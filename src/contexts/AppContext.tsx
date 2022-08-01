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

    const [totalNftMinted, setTotalNftMinted] = useState<number>(0);
    const [totalNftSupply, setTotalNftSupply] = useState<number>(0);
    const [canUserPost, setCanUserPost] = useState<boolean>(false);
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
            const postInterval = await contract.postInterval();
            if (lastPost && postInterval) {
                const _last = Number(lastPost.toString()) * 1000;
                const _interval = Number(postInterval.toString()) * 1000;
                setCanUserPost(Date.now() >= (_last + _interval));
            }

        } catch (err) {
            console.warn('No lastPost was found');
        }
    };

    const nftAmountLeft = async () => {
        try {
            const contract = nftContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);
            const totalSupply = await contract.totalSupply();
            const maxSupply = await contract.maxSupply();

            if (totalSupply) {
                setTotalNftMinted(totalSupply.toString());
            }
            if (maxSupply) {
                setTotalNftSupply(maxSupply.toString());
            }
        } catch (err) {
            console.warn('No total supply was found');
        }
    };

    const getWalletLensHandle = async () => {
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


    const getAllPosts = async () => {
        try {
            const query = {
                "profileId": supportedChains[chain?.id as number ?? 137]?.lensProfileId,
                "publicationTypes": ["POST", "COMMENT", "MIRROR"],
            };
            const { publications } = await request(supportedChains[chain?.id as number ?? 137].lensUrl, GET_PUBLICATIONS, {
                request: query,
            });

            setPublications(publications?.items);
        } catch (err) {
            console.warn('No posts were found');
        }
    };


    useEffect(() => {
        getAllPosts();
        const interval = setInterval(() => {
            getAllPosts();
        }, 10000);

        return () => clearInterval(interval);
    }, [address, isConnected, chain, signer]);


    useEffect(() => {
        if (!signer || !isConnected || !address || !supportedChains[chain?.id as number]?.nft) {
            return;
        }

        getNft();
        nftAmountLeft();
        getWalletLensHandle();
        getLastPost();

        const interval = setInterval(() => {
            getLastPost();
            nftAmountLeft();
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
                canUserPost,
                totalNftMinted,
                totalNftSupply,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default { AppProvider, AppContext };
