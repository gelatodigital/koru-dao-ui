export const supportedChains: {
    [key: number]: {
        lensHandle: string;
        lensProfileId: string;
        lensProfileUrl: string;
        nft: string;
        sponsor: string;
        koru: string;
        freeCollectModule: string;
        lensHub: string;
        maxFee: string;
        target: string;
        subgraphUrl: string;
        lensUrl: string;
        openSeaUrl: string;
        relayTransit: string;
        timeRestriction: string
        openSeaCollection: string
    };
} = {
    137: {
        lensHandle: 'korudao.lens',
        lensProfileId: '0xa738',
        nft: '0xD4ed111F25087cea967ac3be548d52577C92b424',
        sponsor: '0x5ce6047a715B1919A58C549E6FBc1921B4d9287D',
        koru: '0x6bC45934A408f7151093479bf59933cD3B75701d',
        freeCollectModule: '0x23b9467334bEb345aAa6fd1545538F3d54436e96',
        lensHub: '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d',
        relayTransit: '0xcEDdF46A0B2AFBFEeD1E27ebD99CB804E03706B3',
        timeRestriction: '0xd0241F545A695928b3B7826d40230b5D55695f2B',
        maxFee: '0.1',
        target: '0x7A1EC66a1314a00535D0C327931566A29C90deC8',
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/gelatodigital/poke-me-polygon',
        lensUrl: 'https://api.lens.dev/',
        lensProfileUrl: 'https://lenster.xyz',
        openSeaUrl: 'https://opensea.io/assets/matic/',
        openSeaCollection: 'https://opensea.io/collection/korudao',
    },
    80001: {
        lensHandle: 'korudaomumbai.test',
        lensProfileId: '0x6BFF',
        nft: '0xD4ed111F25087cea967ac3be548d52577C92b424',
        sponsor: '0x5ce6047a715B1919A58C549E6FBc1921B4d9287D',
        koru: '0x6bC45934A408f7151093479bf59933cD3B75701d',
        freeCollectModule: '0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c',
        lensHub: '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82',
        relayTransit: '0xC401cA07564D54bA47b542eD9838A2a36648C954',
        timeRestriction: '0xd0241F545A695928b3B7826d40230b5D55695f2B',
        maxFee: '1',
        target: '0x2334Bb5d5A1547970767315dE048e939C94D6E34',
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/gelatodigital/poke-me-mumbai',
        lensUrl: 'https://api-mumbai.lens.dev/',
        lensProfileUrl: 'https://testnet.lenster.xyz',
        openSeaUrl: 'https://testnets.opensea.io/assets/mumbai/',
        openSeaCollection: 'https://testnets.opensea.io/collection/koru-dao-nft',
    },
};
