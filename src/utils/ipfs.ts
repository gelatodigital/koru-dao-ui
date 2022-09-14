import { create } from 'ipfs-http-client';

const projectId = import.meta.env.VITE_INFURA_PROJECT_ID;
const projectSecret = import.meta.env.VITE_INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers:{
        authorization: auth,
    }
});

export const uploadToIPFS = async (data: any) => {
    return await client.add(JSON.stringify(data));
};

export const pinToIPFS = async (cid: any) => {
    return await client.pin.add(cid);
};
