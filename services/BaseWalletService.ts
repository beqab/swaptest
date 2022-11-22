import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import TokenJSON from "../constants/abi/token.json";
import ExchangeJSON from "../constants/abi/exchange.json";
import BigNumber from "bignumber.js";
import { formatUnits } from "@ethersproject/units";
// import * as Sentry from "@sentry/nextjs";
import {
  MAX_ALLOWANCE,
  MESSAGE,
  TOKEN_AOG_ADDRESS,
  TOKEN_AOG_EXCHANGE,
  WALLET_STATUS,
} from "../constants";
import { convertBigNumber } from "../utils";
import showMessage from "@components//message";

export function isAddress(address: string) {
  try {
    return getAddress(address);
  } catch {
    return false;
  }
}

export const convertEToNumber = (value: any, number: any) => {
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });

  return (
    new BigNumber(value).toNumber() / new BigNumber(10).pow(number).toNumber()
  );
};

export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library?.getSigner(account).connectUnchecked();
}

function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || isNativeToken(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}

export function isNativeToken(address: string) {
  return address === AddressZero;
}

export default class BaseWalletService {
  address: string | null;
  needTobeInitiated: any;
  initUnit256: any;

  constructor(props: any) {
    this.address = props?.address;
  }

  getBalance = async ({
    library,
    address,
    addressToken,
  }: {
    library: any;
    address: string;
    addressToken: string;
  }) => {
    const tokenInst = await getContract(
      addressToken,
      TokenJSON.output.abi,
      library
    );
    if (address) {
      const balance = await tokenInst.balanceOf(address);
      return { balance: balance.toString() };
    } else {
      return {
        balance: 0,
      };
    }
  };

  setAllowanceERC20 = async ({
    account,
    library,
    onSuccess,
    onError,
    onLoading,
    onCancelMetamask,
  }: {
    account?: string;
    library?: any;
    onCancelMetamask?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    onLoading?: () => void;
  }) => {
    try {
      const contract = getContract(
        TOKEN_AOG_ADDRESS,
        TokenJSON.output.abi,
        library,
        account
      );

      const response = await contract.approve(
        TOKEN_AOG_EXCHANGE,
        MAX_ALLOWANCE
      );

      if (response?.hash) {
        const receipt = await response.wait();
        // onLoading && onLoading();setInt
        if (receipt?.status) {
          onSuccess && onSuccess();
        } else {
          return;
        }
      }
    } catch (error) {
      console.log(error);

      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError();
        console.log("erooorrrr");
      }
      throw new Error(error);
    }
  };

  getAllowanceERC20 = async ({
    account,
    library,
  }: {
    account?: string;
    library?: any;
  }) => {
    try {
      const contract = getContract(
        TOKEN_AOG_ADDRESS,
        TokenJSON.output.abi,
        library,
        account
      );

      const response = await contract.allowance(account, TOKEN_AOG_EXCHANGE);
      return new BigNumber(response.toString());
    } catch (e) {
      console.log(e);

      return 0;
    }
  };

  swapTokensForPoints = async ({
    internalTx,
    amount,
    onCancelMetamask,
    onSuccess,
    onError,
    library,
    account,
    setLinkViewBsc,
    isTransactionSuccess,
    updateTransaction,
  }: {
    internalTx?: number;
    library?: any;
    account?: string;
    amount?: number;
    onCancelMetamask?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    setLinkViewBsc?: any;
    isTransactionSuccess?: any;
    updateTransaction: () => void;
  }) => {
    try {
      const contract = getContract(
        TOKEN_AOG_EXCHANGE,
        ExchangeJSON.output.abi,
        library,
        account
      );
      const convertAmount = convertBigNumber(amount).toString();
      const convertInternalTx = internalTx.toString();

      const response = await contract.swapTokensForPoints(
        convertInternalTx,
        convertAmount
      );

      if (response?.hash) {
        const receipt = await response.wait();
        if (receipt?.status) {
          const checkStatusTransaction = setInterval(async () => {
            const { status } = await isTransactionSuccess();

            if (status) {
              clearInterval(checkStatusTransaction);
              onSuccess && onSuccess();

              setLinkViewBsc & setLinkViewBsc(response?.hash);
            }
          }, 10000);
        } else {
          updateTransaction && updateTransaction();
          return;
        }
      }
    } catch (error) {
      console.log(
        `data : address : ${account},internalTx : ${internalTx}, amount : ${amount}`
      );
      console.log("error", error);

      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        showMessage(MESSAGE.ERROR, error?.reason);
        onError && onError();

        // Sentry.captureException(
        //   new Error(`errorswapTokensForPoints : ${error}`)
        // );
      }
    }
  };

  swapPointsForToken = async ({
    internalTx,
    amount,
    signature,
    receiver,
    onSuccess,
    onError,
    library,
    account,
    setLinkViewBsc,
    onCancelMetamask,
    isTransactionSuccess,
    updateTransaction,
  }: {
    internalTx?: number;
    amount?: number;
    signature?: string;
    library?: any;
    account?: string;
    receiver?: string;
    onSuccess?: () => void;
    onError?: () => void;
    setLinkViewBsc?: any;
    onCancelMetamask?: () => void;
    isTransactionSuccess?: any;
    updateTransaction: () => void;
  }) => {
    try {
      const contract = getContract(
        TOKEN_AOG_EXCHANGE,
        ExchangeJSON.output.abi,
        library,
        account
      );

      const convertAmount = convertBigNumber(amount).toString();
      const convertInternalTx = internalTx.toString();

      const response = await contract.swapPointsForTokens(
        convertInternalTx,
        receiver,
        convertAmount,
        signature
      );

      if (response?.hash) {
        const receipt = await response.wait();

        if (receipt?.status) {
          const checkStatusTransaction = setInterval(async () => {
            const { status } = await isTransactionSuccess();
            if (status) {
              clearInterval(checkStatusTransaction);
              onSuccess && onSuccess();
              setLinkViewBsc & setLinkViewBsc(response?.hash);
            }
          }, 10000);
        } else {
          updateTransaction && updateTransaction();
          return;
        }
      }
    } catch (error) {
      console.log(
        `data : address : ${account},internalTx : ${internalTx}, amount : ${amount}, signature : ${signature},receiver :${receiver} `
      );
      console.log("error", error);
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        showMessage(MESSAGE.ERROR, error?.reason);
        onError && onError();
        // Sentry.captureException(
        //   new Error(`errorswapPointsForToken : ${error}`)
        // );
      }
    }
  };

  swapDatas = async ({
    internalTx,
    account,
    library,
  }: {
    internalTx: any;
    account?: string;
    library?: any;
  }) => {
    const contract = getContract(
      TOKEN_AOG_EXCHANGE,
      ExchangeJSON.output.abi,
      library,
      account
    );
    const convertInternalTx = internalTx.toString();
    const response = await contract.swapDatas(convertInternalTx);
    return response;
  };

  invalidTx = async ({
    internalTx,
    account,
    library,
  }: {
    internalTx: any;
    account?: string;
    library?: any;
  }) => {
    const contract = getContract(
      TOKEN_AOG_EXCHANGE,
      ExchangeJSON.output.abi,
      library,
      account
    );
    const convertInternalTx = internalTx.toString();
    const response = await contract.invalidTx(convertInternalTx);
    return response;
  };

  cancelTx = async ({
    internalTx,
    amount,
    signature,
    receiver,
    onSuccess,
    onError,
    library,
    account,
    onCancelMetamask,
    isTransactionSuccess,
  }: {
    internalTx?: any;
    amount?: number;
    signature?: string;
    library?: any;
    account?: string;
    receiver?: string;
    onSuccess?: () => void;
    onError?: (error) => void;
    onCancelMetamask?: () => void;
    isTransactionSuccess?: any;
  }) => {
    try {
      const contract = getContract(
        TOKEN_AOG_EXCHANGE,
        ExchangeJSON.output.abi,
        library,
        account
      );

      const convertAmount = convertBigNumber(amount).toString();
      const convertInternalTx = internalTx.toString();

      // Check transaction is invalid
      const isInvalid = await contract.invalidTx(convertInternalTx);
      if (isInvalid) {
        const checkStatusTransaction = setInterval(async () => {
          const { status } = await isTransactionSuccess();
          if (status) {
            clearInterval(checkStatusTransaction);
            onSuccess && onSuccess();
          }
        }, 5000);
      } else {
        const response = await contract.cancelTx(
          convertInternalTx,
          receiver,
          convertAmount,
          signature
        );

        if (response?.hash) {
          const receipt = await response.wait();

          if (receipt?.status) {
            const checkStatusTransaction = setInterval(async () => {
              const { status } = await isTransactionSuccess();
              if (status) {
                clearInterval(checkStatusTransaction);
                onSuccess && onSuccess();
              }
            }, 10000);
          } else {
            return;
          }
        }
      }
    } catch (error) {
      console.log(
        `data : address : ${account},internalTx : ${internalTx}, amount : ${amount}, signature : ${signature},receiver :${receiver} `
      );
      console.log("error", error);
      if (WALLET_STATUS.CANCEL_METAMASK === error?.code) {
        onCancelMetamask && onCancelMetamask();
      } else {
        onError && onError(error);
        // Sentry.captureException(new Error(`errorcancelTx : ${error}`));
      }
    }
  };
}
