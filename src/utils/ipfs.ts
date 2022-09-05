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

const uploadToIPFS = async (data: any) => {
    return await client.add(JSON.stringify(data));
};

export default uploadToIPFS;

// class IpfsHelper {
//     ipfs: any;
//
//     constructor() {
//         this.makeInstance();
//     }
//
//     async makeInstance() {
//         this.ipfs = await IPFS.create();
//     }
//
//     add(data: any) {
//         return this.ipfs.add(JSON.stringify(data));
//     }
// }
//
// const ipfsHelper = new IpfsHelper();
//
// export default ipfsHelper;
