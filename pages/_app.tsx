// @ts-ignore
import "../styles/globals.scss";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import store from "../redux/store";
import { createWrapper } from "next-redux-wrapper";
import "react-toastify/dist/ReactToastify.css";
//@ts-ignore
import { WalletProvider, useWalletProvider } from "@react-dapp/wallet";
//@ts-ignore
import { UtilsProvider } from "@react-dapp/utils";
import LayoutApp from "../components/layout/index";
import { Web3ReactProvider } from "@web3-react/core";

import { Web3Provider } from "@ethersproject/providers";

export const LIBRARY_CONSTANTS = {
  getLibrary: (provider: any): Web3Provider => {
    const library = new Web3Provider(
      provider,
      typeof provider.chainId === "number"
        ? provider.chainId
        : typeof provider.chainId === "string"
        ? parseInt(provider.chainId)
        : "any"
    );

    return library;
  },
};

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider store={store}>
      <WalletProvider>
        {/* <UtilWrapper> */}
        <Web3ReactProvider getLibrary={LIBRARY_CONSTANTS.getLibrary}>
          <LayoutApp>
            <Component {...pageProps} />
          </LayoutApp>
        </Web3ReactProvider>
        {/* </UtilWrapper> */}
      </WalletProvider>
    </Provider>
  );
}

const UtilWrapper = ({ children }) => {
  const { library } = useWalletProvider();

  return (
    <UtilsProvider
      config={{
        provider: library,
        wrappedNative: {
          address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          symbol: "WBNB",
          name: "WBNB",
          decimals: 18,
        },
        usd: {
          address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
          name: "BUSD",
          symbol: "BUSD",
          decimals: 18,
        },
        nativeUsdLp: {
          name: "LP",
          address: "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16",
          symbol: "LP",
          decimals: 18,
        },
      }}
    >
      {children}
    </UtilsProvider>
  );
};

const makeStore = () => store;
const wrapper = createWrapper(makeStore as any);
export default wrapper.withRedux(MyApp);
