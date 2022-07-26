export const supportedChains: {
    [key: number]: {
        nft: string;
        sponsor: string;
        maxFee: string;
        ops: string;
        forwarder: string;
        subgraphUrl: string;
        lensUrl: string;
    };
} = {
    137: {
        nft: '0x9f43F703101Bf3EE8EB39e7267445B5F2E5Dc620',
        sponsor: '0x5ce6047a715B1919A58C549E6FBc1921B4d9287D',
        maxFee: '0.1',
        ops: '0x527a819db1eb0e34426297b03bae11F2f8B3A19E',
        forwarder: '0xCd8eE05B92746Ef168460D8809bDb26b7321ec30',
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/gelatodigital/poke-me-polygon',
        lensUrl: 'https://api.lens.dev/',
    },
    80001: {
        nft: '0x2334Bb5d5A1547970767315dE048e939C94D6E34',
        sponsor: '0x5ce6047a715B1919A58C549E6FBc1921B4d9287D',
        maxFee: '1',
        ops: '0xB3f5503f93d5Ef84b06993a1975B9D21B962892F',
        forwarder: '0x4055cb250Ec8d539C5222EAa71fa7e30Fe94f8e9',
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/gelatodigital/poke-me-mumbai',
        lensUrl: 'https://api-mumbai.lens.dev/',
    },
};
