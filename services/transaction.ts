// import { axiosHeaderConfig } from "../api";
import axios from "axios";
import { axiosHeaderConfig, post, postApi } from "./api";
import { backEndRoutes } from "./backend-routes";

class TransactionServices {
  getBalanceGaog = (data?: any) => {
    return postApi(backEndRoutes.getBalanceGaog, data);
  };
  connectWallet = (data?: any) => {
    return postApi(backEndRoutes.connectWallet, data);
  };
  createTransaction = (data?: any) => {
    return postApi(backEndRoutes.createTransaction, data);
  };
  getTransactionDetail = (data?: any) => {
    return postApi(backEndRoutes.getTransactionDetail, data);
  };
  updateTransaction = (data?: any) => {
    data.transaction_token = localStorage.getItem("game_access_token");
    return postApi(backEndRoutes.updateTransaction, data);
  };
  getTransactionHistory = (data?: any) => {
    return postApi(backEndRoutes.getTransactionHistory, data);
  };
  getListNft = (data?: any) => {
    return post(backEndRoutes.getListNft, data);
  };
}

const transactionServices = new TransactionServices();

export default transactionServices;
