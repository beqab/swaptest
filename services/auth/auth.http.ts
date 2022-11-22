import { axiosHeaderConfig, postApi } from "../api";
import { axiosWithToken } from "../axios-with-token";
import axios from "axios";
import { backEndRoutes } from "../backend-routes";

class _AuthService {
  login = (data: any) => {
    return axios.post(backEndRoutes.auth.login(), data);
  };

  logout = (data: any) => {
    return postApi(backEndRoutes.auth.logout(), data);
  };

  register = (data: any) => {
    return axios.post(backEndRoutes.auth.register(), data);
  };

  resetPass = (data: any) => {
    return axios.post(backEndRoutes.auth.resetPass(), data);
  };

  recoverPass = (data: any) => {
    return axios.post(backEndRoutes.auth.recoverPass(), data);
  };

  getUser = (data?: any) => {
    // return axios.get();
  };
}

export const AuthService = new _AuthService();
