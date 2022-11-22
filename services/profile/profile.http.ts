import { axiosHeaderConfig } from "../api";
import { axiosWithToken } from "../axios-with-token";
import axios from "axios";
import { backEndRoutes } from "../backend-routes";

class _ProfileService {
  getUser = (token: string) => {
    return axios.get(backEndRoutes.profile.getUser(token));
  };

  getPackages = () => {
    return axios.get(backEndRoutes.profile.getPackages());
  };

  //   logout = () => {
  //     return axiosWithToken.post(
  //       backEndRoutes.auth.logout(),
  //       axiosHeaderConfig()
  //     );
  //   };
}

export const ProfileService = new _ProfileService();
