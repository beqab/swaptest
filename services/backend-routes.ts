// import { STORE_API_BASE_URL, GAME_API_BASE_URL, NFT_BASE_URL } from "./api";

import {
  GAME_API_BASE_URL,
  NFT_BASE_URL,
  STORE_API_BASE_URL,
} from "@constant/s";

export const backEndRoutes = {
  auth: {
    login: () => `${STORE_API_BASE_URL}​/api/login`,
    logout: () => `${GAME_API_BASE_URL}/logout`,
    register: () => `${STORE_API_BASE_URL}/api/register`,
    resetPass: () => `${STORE_API_BASE_URL}/api/reset/password`,
    recoverPass: () => `${STORE_API_BASE_URL}/api/recover/password`,
  },
  profile: {
    getUser: (token: string) => `${STORE_API_BASE_URL}/api/getUser/${token}`,
    getPackages: () => `${STORE_API_BASE_URL}/api/packages`,
  },
  getBalanceGaog: `${GAME_API_BASE_URL}/getGameToken`,
  connectWallet: `${GAME_API_BASE_URL}/updateUserDetails`,
  createTransaction: `${GAME_API_BASE_URL}/createTransaction`,
  getTransactionDetail: `${GAME_API_BASE_URL}/getTransactionDetails`,
  updateTransaction: `${GAME_API_BASE_URL}/updateTransaction`,
  getTransactionHistory: `${GAME_API_BASE_URL}/getTransactionHistory`,
  getListNft: `${NFT_BASE_URL}/api/nfts/searches-swap`,
};
