Koru DAO

- Gelato Relay SDK showcase `RelaySdk` https://github.com/gelatodigital/relay-sdk

# How Koru DAO works ?

Koru uses Gelato Relay SDK to enable its users to mint a NFT and post messages on Lens without having to pay for
its transactions.

### Overview

`DAPP` > `IPFS` > `Sponsor Server` > `Lens` > `Polygon Chain`

- Only users that has a NFT minted are allow to post messages on Koru.
- Once the user has minted the NFT, it's possible to post messages on Koru on a limited interval.

1- Koru DAPP checks if user has a NFT minted and if it's time to post a message.

```ts
import { Contract } from 'ethers';

const contract = new Contract(address, abi, signerOrProvider);
contract.balanceOf(USER_WALLET_ADDRESS);
```

If wallet doesn't have yet a NFT minted, this is how you can mint:

```ts
import { GelatoRelaySDK } from '@gelatonetwork/gelato-relay-sdk';
import { useSignTypedData } from 'wagmi';

const { signTypedDataAsync } = useSignTypedData();

const contract = nftContract.connect(address, signer);
const { address: metaboxAddress, abi: metaboxAbi } =
    GelatoRelaySDK.getMetaBoxAddressAndABI(chain?.id as number);

const metaBox = new ethers.Contract(metaboxAddress, metaboxAbi, provider);
const nonce = Number(await metaBox.nonce(address));

const metaTxRequest = GelatoRelaySDK.metaTxRequest(
    chain?.id as number,
    supportedChains[chain?.id as number].nft,
    contract.interface.encodeFunctionData("mint", []),
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    2,
    '0.1',
    '20000000',
    walletAddress,
    nonce,
    sponsorAddress,
);

// Get transaction data
const metaTxRequestData = GelatoRelaySDK.getMetaTxRequestWalletPayloadToSign(metaTxRequest);
const userSignature = await signTypedDataAsync(metaTxRequestData);

// Submit to your sponsor server
const resp = await fetch('https://your-sponsor.io/', {
    method: "POST",
    headers: {
        cache: "no-cache",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        userSignature,
        metaTxRequest,
    }),
});
```

2- Generate a IPFS hash from the message.

```ts
const ipfs = {
    version: '1.0.0',
    metadata_id: uuid(),
    description: USER_MESSAGE,
    content: USER_MESSAGE,
    external_url: 'https://lenster.xyz/u/USER_HANDLE',
    image: null,
    imageMimeType: null,
    name: `Post by @lensHandle}`,
    mainContentFocus: 'TEXT',
    contentWarning: null,
    attributes: [
        {
            traitType: 'string',
            key: 'type',
            value: 'post',
        },
    ],
    media: null,
    createdOn: new Date(),
    appId: 'YOUR_APP_ID',
};
const { path } = await uploadToIPFS(ipfs);
return path;
```

3- Post the message to your sponsor server.

```ts
const lensProfileId = LENS_PROFILE_ID;
const contentUri = "https://ipfs.infura.io/ipfs/" + ipfsPATH; // CID
const contentModule = FREE_COLLECT_MODULE_ADDRESS;
const collectModuleInitData = "0x0000000000000000000000000000000000000000000000000000000000000000";
const referenceModule = "0x0000000000000000000000000000000000000000";
const referenceModuleInitData = "0x";

const { address: metaboxAddress, abi: metaboxAbi } =
    GelatoRelaySDK.getMetaBoxAddressAndABI(CHAIN_ID);
const contract = koruContract.connect(address, signer);
const metaBox = new ethers.Contract(metaboxAddress, metaboxAbi, provider);
const nonce = Number(await metaBox.nonce(address));

const koruDaoPostData = contract.interface.encodeFunctionData("post", [
    [
        lensProfileId,
        contentUri,
        contentModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
    ],
]);

const metaTxRequest = GelatoRelaySDK.metaTxRequest(
    CHAIN_ID,
    CONTRACT_ADDRESS,
    koruDaoPostData,
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    2,
    '0.1',
    '20000000',
    walletAddress,
    nonce,
    sponsorAddress,
);

// Get transaction data
const metaTxRequestData = GelatoRelaySDK.getMetaTxRequestWalletPayloadToSign(metaTxRequest);
const userSignature = await signTypedDataAsync(metaTxRequestData);

const resp = await fetch('https://your-sponsor.io/', {
    method: "POST",
    headers: {
        cache: "no-cache",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        userSignature,
        metaTxRequest,
    }),
});
```
