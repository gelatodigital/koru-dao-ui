import { BigNumber, ethers } from 'ethers';
import { gql } from 'graphql-request';

export const formatTokenAmount = (amount: string, precisionDigits?: number): number =>
    Math.floor(parseFloat(ethers.utils.formatUnits(amount)) * 10 ** (precisionDigits || 6)) /
    10 ** (precisionDigits || 6);

export const formatNumber = (amount: number, digits?: number): string => {
    return amount.toLocaleString(undefined, {
        maximumFractionDigits: digits || 2,
    });
};

function toHex(value: any): string {
    return value?.toString(16);
}

export const checkIfJSONAndFormat = (stringToCheck: string): string | boolean | BigNumber | Record<string, unknown> => {
    try {
        const stringObj = JSON.parse(stringToCheck);
        if (typeof stringObj === 'number') return BigNumber.from(toHex(stringObj));
        if (typeof stringObj === 'boolean') return stringObj;
        if (typeof stringObj === 'object') return stringObj;
        if (typeof stringObj === 'string') return stringObj;
        return stringToCheck;
    } catch (_) {
        return stringToCheck;
    }
};

export const isFalseAndNotNull = (value: any): boolean => {
    return value !== false && value !== null;
};

export function formatDate(date: Date | string | number, fullDate = false): string {
    if (!date) {
        return '';
    }
    const dateObject = new Date(date);
    const defaultOptions = fullDate
        ? {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            literal: ', ',
        }
        : null;

    try {
        return new Intl.DateTimeFormat(navigator.language, defaultOptions as any).format(dateObject);
    } catch (e) {
        return 'Invalid date';
    }
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function capitalizeFirstLetter(value: string) {
    if (!value) return;
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export const truncateStringInTheMiddle = (str: string, strPositionStart: number, strPositionEnd: number) => {
    const minTruncatedLength = strPositionStart + strPositionEnd;
    if (minTruncatedLength < str.length) {
        return `${str.substr(0, strPositionStart)}...${str.substr(str.length - strPositionEnd, str.length)}`;
    }
    return str;
};

export const preventNonNumeric = (event: any) => {
    if (event.key.length === 1 && /\D/.test(event.key)) {
        event.preventDefault();
    }
};

export function isValidHash(hash: string): boolean {
    return /^0x[\da-f]{64}$/i.test(hash);
}

export function sameAccounts(account1: string | undefined, account2: string | undefined) {
    return !!(account1 && account2 && account1.toLowerCase() === account2.toLowerCase());
}

export const convertFuncArgToString = (funcArg: { _hex: string; _address: string; _bytes: string }): string => {
    if (funcArg._hex) return parseInt(funcArg._hex, 16).toString();
    if (funcArg._address) return funcArg._address;
    if (funcArg._bytes) return funcArg._bytes;
    return funcArg.toString();
};

export const secondsToDHS = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600) % 3600;
    const minutes = Math.floor(seconds / 60) % 60;
    const sec = seconds % 60;
    return `${days ? days + ' days ' : ''}${hours ? hours + ' hours ' : ''}${minutes ? minutes + ' minutes ' : ''}${
        sec ? sec + ' seconds ' : ''
    }`;
};

export function unixToDate(unix: number): string {
    return new Date(unix * 1000).toISOString();
}

export function toIsoDate(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${year}-${month < 10 ? 0 : ''}${month}-${day < 10 ? 0 : ''}${day}`;
}

export const GET_USER_BALANCES = gql`
    query getUserBalances($userId: String) {
        taskCreator(id: $userId) {
            id
            balances {
                id
                paymentToken {
                    id
                    name
                    symbol
                    decimals
                }
                balance
            }
        }
    }
`;

export const GET_DEFAULT_PROFILES = gql`
  query($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
         type
        }
        ... on RevertFollowModuleSettings {
         type
        }
      }
    }
  }
`;

export const GET_PUBLICATIONS = gql`
  query($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        __typename 
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  fragment MediaFields on Media {
    url
    mimeType
  }

  fragment ProfileFields on Profile {
    id
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
        isFollowedByMe
    isFollowing(who: null)
        followNftAddress
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    ownedBy
    dispatcher {
      address
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
      ... on ProfileFollowModuleSettings {
       type
      }
      ... on RevertFollowModuleSettings {
       type
      }
    }
  }

  fragment PublicationStatsFields on PublicationStats { 
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }

  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on EmptyCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
        hidden
        reaction(request: null)
    mirrors(profileId: null)
    hasCollectedByMe
  }

  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
        hidden
        reaction(request: null)
    hasCollectedByMe
  }

  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
     ... on Post {
        ...PostFields          
     }
     ... on Comment {
        ...CommentFields          
     }
    }
  }

  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
        hidden
        reaction(request: null)
    mirrors(profileId: null)
    hasCollectedByMe
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
             ...PostFields          
          }
          ... on Comment {
             ...CommentMirrorOfFields        
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
         ...MirrorBaseFields
      }
    }
  }
`

// export const getPublications = (getPublicationQuery) => {
//     return apolloClient.query({
//         query: gql(GET_PUBLICATIONS),
//         variables: {
//             request: getPublicationQuery
//         },
//     })
// }
