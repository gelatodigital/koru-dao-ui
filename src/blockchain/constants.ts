export const supportedChains: {
    [key: number]: {
        nft: string;
        sponsor: string;
        maxFee: string;
        target: string;
        subgraphUrl: string;
        lensUrl: string;
    };
} = {
    137: {
        nft: '0x3Fc16819b0271Ad887BE36885b58Cff37117Ec79',
        sponsor: '0x5ce6047a715B1919A58C549E6FBc1921B4d9287D',
        maxFee: '0.1',
        target: '0x7A1EC66a1314a00535D0C327931566A29C90deC8',
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/gelatodigital/poke-me-polygon',
        lensUrl: 'https://api.lens.dev/',
    },
    80001: {
        nft: '0x1d1a00E6222CAB32f116D8fB6680335eA9C3e81a',
        sponsor: '0x5ce6047a715B1919A58C549E6FBc1921B4d9287D',
        maxFee: '1',
        target: '0x2334Bb5d5A1547970767315dE048e939C94D6E34',
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/gelatodigital/poke-me-mumbai',
        lensUrl: 'https://api-mumbai.lens.dev/',
    },
};
