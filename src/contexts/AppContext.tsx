import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { supportedChains } from '../blockchain/constants';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { nftContract } from '../blockchain/contracts/nftContract.factory';
import { GET_DEFAULT_PROFILES, GET_PUBLICATIONS } from '../utils/utils';
import { Signer } from 'ethers';
import request from 'graphql-request';
import { koruContract } from '../blockchain/contracts/koruContract.factory';
import { timeRestriction } from '../blockchain/contracts/timeRestriction.factory';

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

    const [isMinting, setIsMinting] = useState<any>(false);
    const [totalNftMinted, setTotalNftMinted] = useState<number>(0);
    const [totalNftSupply, setTotalNftSupply] = useState<number>(0);
    const [nftId, setNftId] = useState<boolean | null>(true);
    const [lensHandler, setLensHandler] = useState<number | null>(null);
    const [noLensModal, setNoLensModal] = useState<boolean>(false);
    const [publications, setPublications] = useState<any[]>([]);

    const [notEligibleModal, setNotEligibleModal] = useState<boolean>(true);
    const [isEligible, setIsEligible] = useState<boolean>(false);

    const [isMintingOpen, setIsMintingOpen] = useState<boolean | null>(null);

    const [canUserPost, setCanUserPost] = useState<boolean>(false);
    const [userPost, setUserPost] = useState<{ [key: string]: any }>({
        lastPost: null,
        postInterval: null,
    });

    function logState(state: boolean[]) {
        const errorsMap = [
            'User does not have lens profile',
            'User does not follow KoruDao',
            'User does not meet minimum publish amount defined in minPubCount',
            'User does not meet minimum follower amount defined in minFollowers (edited)',
        ];
        state.forEach((v: boolean, index: number) => {
            if (v) {
                console.log(errorsMap[index]);
            }
        });
    }

    const getIsEligible = async () => {
        try {
            const contract = nftContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);
            if (!contract.signer.getAddress) return;

            const isEligible = await contract.isEligible(address);
            logState(isEligible);
            setIsEligible(isEligible[0]);

        } catch (err) {
            setIsEligible(false);
            console.warn('Wallet not eligible');
        }
    };

    const getNft = async () => {
        try {
            const contract = nftContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);
            if (!contract.signer.getAddress) return;

            const tokenId = await contract.tokenOfOwnerByIndex(address, 0);
            setNftId(tokenId.toString());
        } catch (err) {
            setNftId(null);
            console.warn('No nft was found');
        }
    };

    // Get the connected user last post
    const getLastPost = async () => {
        try {
            const nft = nftContract.connect(supportedChains[chain?.id as number].nft, signer as Signer);
            const time = timeRestriction.connect(supportedChains[chain?.id as number].timeRestriction, signer as Signer);

            const tokenId = await nft.tokenOfOwnerByIndex(address, 0);

            if (!tokenId) return;

            const lastPost = await time.lastPost(tokenId);

            const postInterval = await time.actionInterval();

            if (lastPost && postInterval) {
                const _last = Number(lastPost.toString()) * 1000;
                const _interval = Number(postInterval.toString()) * 1000;
                setUserPost(
                    {
                        lastPost: _last,
                        postInterval: _interval,
                        canPost: Date.now() >= (_last + _interval),
                    },
                );
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
            // TODO check if the handler is whitelisted
            setNoLensModal(chain?.id === 137 && !defaultProfile);
        } catch (err) {
            setNoLensModal(true);
            console.warn('No lens handler was found');
        }
    };

    const getAllPosts = async () => {
        try {
            const chainId: number = chain?.id && [137, 80001].includes(Number(chain?.id)) ? chain.id : 137;
            const query = {
                "profileId": supportedChains[chainId]?.lensProfileId,
                "publicationTypes": ["POST", "COMMENT", "MIRROR"],
            };
            const { publications } = await request(supportedChains[chainId].lensUrl, GET_PUBLICATIONS, {
                request: query,
            });

            setPublications(publications?.items);
        } catch (err) {
            console.warn('No posts were found');
        }
    };

    // Check if Minting period is open
    const openDate = new Date(import.meta.env.VITE_MINT_DATE);

    function getIsMintingOpen() {
        const timeNow = new Date();
        setIsMintingOpen(timeNow > openDate);
    }

    useEffect(() => {
        getIsMintingOpen();

        const interval = setInterval(() => {
            getIsMintingOpen();
        }, 1000);

        return () => clearInterval(interval);
    }, [address, isConnected, chain, signer]);


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

        nftAmountLeft();
        getWalletLensHandle();

        if (!noLensModal) {
            getNft();
            getIsEligible();
            getLastPost();
        }

        const interval = setInterval(() => {
            nftAmountLeft();

            if (!noLensModal) {
                getNft();
                getIsEligible();
                getLastPost();
            }

        }, 10000);

        return () => clearInterval(interval);
    }, [address, isConnected, chain, signer]);

    return (
        <AppContext.Provider
            value={{
                setIsMinting,
                isMinting,
                connectModal,
                setConnectModal,
                nftId,
                lensHandler,
                noLensModal,
                setNoLensModal,
                mintModal,
                setMintModal,
                publications,
                setPublications,
                canUserPost,
                totalNftMinted,
                totalNftSupply,
                userPost,
                setNotEligibleModal,
                notEligibleModal,
                isEligible,
                isMintingOpen,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default { AppProvider, AppContext };
