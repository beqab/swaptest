import { useDispatch as _useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../redux/actions";

export const useDispatch = () => {
  const dispatch = _useDispatch();

  return bindActionCreators(actions, dispatch);
};
