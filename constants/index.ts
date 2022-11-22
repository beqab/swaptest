// contract address
export const MAX_ALLOWANCE =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const TOKEN_AOG_ADDRESS = '0x40c8225329bd3e28a043b029e0d07a5344d2c27c';
export const TOKEN_AOG_EXCHANGE = '0x8E66bE4639dDF9ED1f6a3Fa0F920CaC720C643FF';
const TODO = 'todo1';
///////////////////////////////////////////////
export const METAMASK_DEEPLINK = 'https://metamask.io/download';
export const EXTERNAL_URL = {
  BSC_SCAN:
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'
      ? 'https://testnet.bscscan.com/tx'
      : 'https://testnet.bscscan.com/tx',
  AGE_OF_GOD: 'https://nft.ageofgods.net/nft',
};
//api
export const STORE_API_BASE_URL = 'https://bs.ageofgods.net';
export const GAME_API_BASE_URL = 'https://api.ageofgods.net/V1';
export const NFT_BASE_URL = 'https://nft.ageofgods.net';
///////////////////////////////////////////////
export const LIMIT_AMOUT_TOKEN_SWAP = 1;

export const HTTP_STATUS_CONTSTANTS = {
  OK: 200,
  ERROR_CODE_401: 401,
  RESPONSE_OK: 0,
  SERVER_ERROR: 'E0',
  ERROR: 400,
};

export const WALLET_STATUS = {
  CANCEL_METAMASK: 4001,
  NOT_EXISTED_NETWORK: 4092,
};

export const TRANSACTION_STATUS = {
  ERROR: 1,
  SUCCESS: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const TRANSACTION_STATUS_UPDATE = {
  SUCCESS: 100001,
};

export const TYPE_TRANSACTION_SWAP = {
  AOG_TO_GAOG: 2,
  GAOG_TO_AOG: 1,
};

export const TRANSACTION_SORT_TYPE = {
  NA: 0,
  DATE: 1,
  ID: 2,
};
export const TRANSACTION_FILTER_TYPE = {
  NA: 0,
  DATE: 1,
  STATUS: 2,
  MULTI_TYPE: 3,
};
export const TRANSACTION_STATUS_HISTORY = {
  ALL: 0,
  PENDING: 1,
  SUCCESS: 2,
  FAILED: 3,
  CANCEL: 4,
};
export const TRANSACTION_ORDER = {
  ASC: 0,
  DESC: 1,
};

export const MAX_LENGTH_NUMBER_SWAP = 9;
export const MAX_LENGTH_DECIMAL = 2;

export const MESSAGE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  IMG_DONE: 'done',
};

export const TOKEN = [
  {
    name: 'AOG',
    key: 'AOG',
  },
  {
    name: 'gAOG',
    key: 'gAOG',
  },
];
export const ERROR_TEXT = 'This field is require';
