import {
  AuthActionTypes,
  IAuthError,
  IAuthStart,
  IAuthSuccess,
} from "../actionTypes/authActionTypes";
import { setAuthorizationToken } from "../../services/axios-with-token";

export const authStart = (): IAuthStart => {
  return {
    type: AuthActionTypes.AUTH_START,
    payload: true,
  };
};

export const setCurrentUser = (data: any) => {
  // debugger;
  window.localStorage.setItem("game_access_token", data.game_access_token);
  window.localStorage.setItem("token", data.token);
  window.localStorage.setItem("user", JSON.stringify(data));
  setAuthorizationToken(data.token);

  return {
    type: AuthActionTypes.SET_USER,
    payload: data,
  };
};

export const setUserSignOut = (data) => {
  return {
    type: AuthActionTypes.SET_USER,
    payload: data,
  };
};

export const authSuccess = (): IAuthSuccess => {
  return {
    type: AuthActionTypes.AUTH_SUCCESS,
    payload: { isAuth: true },
  };
};

export const authError = (): IAuthError => {
  return {
    type: AuthActionTypes.AUTH_ERROR,
    payload: "mm error wtf?",
  };
};
