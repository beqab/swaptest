import { authTypes, AuthActionTypes } from "../actionTypes/authActionTypes";

interface IState {
  user: any;
  loading: boolean;
  error: string | null;
}
let user = null;
if (typeof window !== "undefined") {
  user = localStorage.getItem("user");

  if (user) {
    user = JSON.parse(user);
  }
}

const initialState = {
  user: user,
  loading: false,
  error: "",
};

const authReducer = (
  state: IState = initialState,
  action: authTypes
): IState => {
  switch (action.type) {
    case AuthActionTypes.SET_USER:
      return { ...state, user: action.payload };

    case AuthActionTypes.AUTH_SUCCESS:
      return { loading: false, error: null, user: action.payload };
    case AuthActionTypes.AUTH_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default authReducer;
