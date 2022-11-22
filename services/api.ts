import showMessage from "@components//message";
import axios from "axios";
import { decryptText, encryptText } from "utils/encryptionApi";
import {
  HTTP_STATUS_CONTSTANTS,
  MESSAGE,
  TRANSACTION_STATUS_UPDATE,
} from "../constants";
import { backEndRoutes } from "./backend-routes";

export const axiosHeaderConfig = () => {
  return {
    headers: {
      token: `${localStorage.getItem("token")}`,
    },
  };
};

export const postApi = async (url, data) => {
  console.log("request", url, JSON.stringify(data));
  const formData = new FormData();
  formData.append("data", encryptText(data));
  const response = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      access_token: `${localStorage.getItem("game_access_token")}`,
    },
  });
  if (response?.status >= HTTP_STATUS_CONTSTANTS.ERROR) {
    throw new Error(`Error call API: ${response?.statusText}`);
  } else {
    if (response?.data?.responseCode !== TRANSACTION_STATUS_UPDATE.SUCCESS) {
      console.log("response?.data?", JSON.stringify(response?.data));

      return {
        error: true,
        message: response?.data?.responseMessage,
      };
    } else {
      const responseData = decryptText(response?.data.responseData);
      if (url !== backEndRoutes.getTransactionHistory) {
        console.log(
          `responseApi(): \n ${url}`,
          JSON.stringify({ ...response?.data, responseData })
        );
      }
      return {
        ...response?.data,
        responseData,
      };
    }
  }
};

export const post = async (url, data) => {
  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
      access_token: `${localStorage.getItem("game_access_token")}`,
    },
  });
  if (response?.status >= HTTP_STATUS_CONTSTANTS.ERROR) {
    throw new Error(`Error call API: ${response?.statusText}`);
  } else {
    console.log(`responseApi(): \n ${url}`, {
      ...response?.data,
    });
    return { response: response?.data };
  }
};

export const checkSusscessRequest = (response: any) => {
  return response?.status < HTTP_STATUS_CONTSTANTS.ERROR;
};
