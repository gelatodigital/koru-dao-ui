import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { supportedChains } from '../blockchain/constants';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { nftContract } from '../blockchain/nftContract.factory';
import { GET_USER_BALANCES } from '../utils/utils';
import { ethers, Signer } from 'ethers';
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

    const [nftID, setNftID] = useState<string | null>(null);
    const [opsBalance, setOpsBalance] = useState<number | null>(null);

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


    const fetchAndUpdateBalances = async () => {
        const b = await request(supportedChains[chain?.id as number].subgraphUrl, GET_USER_BALANCES, {
            userId: address?.toLowerCase(),
        });

        setOpsBalance(parseFloat(ethers.utils.formatUnits(b.taskCreator?.balances[0].balance)));
    };

    useEffect(() => {
        if (!signer || !isConnected || !address || !supportedChains[chain?.id as number]?.nft) {
            return;
        }

        getNft();
        fetchAndUpdateBalances();

        const interval = setInterval(() => {
            getNft();
            fetchAndUpdateBalances();
        }, 10000);

        return () => clearInterval(interval);
    }, [address, isConnected, chain, signer]);

    return (
        <AppContext.Provider
            value={{
                connectModal,
                setConnectModal,
                nftID,
                opsBalance,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default { AppProvider, AppContext };
