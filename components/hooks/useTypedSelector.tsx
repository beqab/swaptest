import {
  useSelector as __useSelector,
  TypedUseSelectorHook,
} from "react-redux";
import { RootState } from "../../redux/reducers";

export const useSelector: TypedUseSelectorHook<RootState> = __useSelector;
