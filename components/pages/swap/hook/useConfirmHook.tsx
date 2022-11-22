import showMessage from "@components//message";
import {
  LIMIT_AMOUT_TOKEN_SWAP,
  MESSAGE,
  TOKEN_AOG_ADDRESS,
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_UPDATE,
} from "@constant/s";
import BigNumber from "bignumber.js";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleSetLoadingTransaction } from "redux/actions/modalAction";
import transactionServices from "services/transaction";
import { useWeb3React } from "@web3-react/core";
import MetamaskService from "services/MetamaskService";
import { convertBigNumber, multipleTwoBigNumber } from "utils";

export const UseConfirmHook = ({
  setVisibleModalConfirm,
  setAmountTokenSwap,
  setBalanceGaog,
  setMessageError,
  setBalanceAog,
  amountTokenSwap,
  isActiveBtnConfirm,
  displayBalanceAog,
  displayBalanceGaog,
  setActiveModalSuccess,
  setActiveModalFail,
  swapAogToGaog,
  setChangeTab,
}) => {
  const dispatch = useDispatch();
  const { library, account: address, active } = useWeb3React();
  const [allowanceERC20, setAllowanceERC20] = useState();
  const wallet = new MetamaskService();
  const user = useSelector((state: any) => ({ ...state.authReducer.user }));

  useEffect(() => {
    if (address && library) {
      getAllowanceERC20(address);
      getBalanceAog();
    }
  }, [address, library]);

  const getAllowanceERC20 = async (account: string) => {
    const response = await wallet.getAllowanceERC20({
      account,
      library,
    });
    setAllowanceERC20(response as any);
    return response;
  };

  useEffect(() => {
    getBalanceGaogToken();
  }, [user.token, address, displayBalanceAog, displayBalanceGaog]);

  const isNeedApproveCurrency = useMemo(() => {
    const value = convertBigNumber(amountTokenSwap);

    return value.gt(allowanceERC20);
  }, [allowanceERC20, amountTokenSwap]);

  const getBalanceGaogToken = async () => {
    const response = await transactionServices.getBalanceGaog({});
    setBalanceGaog(response?.responseData?.game_token);
  };

  const getBalanceAog = async () => {
    try {
      const response = await wallet.getBalance({
        library,
        address,
        addressToken: TOKEN_AOG_ADDRESS,
      });
      setBalanceAog(response.balance);

      const checkMinBalanceAog = new BigNumber(
        multipleTwoBigNumber(response.balance)
      ).isLessThan(LIMIT_AMOUT_TOKEN_SWAP);
      if (checkMinBalanceAog) {
        swapAogToGaog &&
          setMessageError({
            status: true,
            message: "You need at least 1 AOG to swap",
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmSuccess = () => {
    getBalanceGaogToken();
    getBalanceAog();
    dispatch(handleSetLoadingTransaction(false));
    setActiveModalSuccess(true);
  };

  const handleConfirmFail = (internalTx) => async () => {
    dispatch(handleSetLoadingTransaction(false));
    setActiveModalFail(true);
    setAmountTokenSwap("");
    updateTransaction("FAILED", internalTx)();
  };

  const handleCancelMetamask = (internalTx, isSwapGaogToAog) => async () => {
    dispatch(handleSetLoadingTransaction(false));
    setChangeTab(true);
  };

  const updateTransaction = (STATUS, internalTx) => async () => {
    dispatch(handleSetLoadingTransaction(false));
    setChangeTab(true);
  };

  const isTransactionSuccess = (internalTx, STATUS) => async () => {
    try {
      const response = await transactionServices.getTransactionDetail({
        internal_transaction_id: internalTx,
      });

      if (response) {
        if (
          response?.responseData?.transaction_status ===
          TRANSACTION_STATUS?.[STATUS]
        )
          return { status: true };
      }
      0;
      return { status: false };
    } catch (error) {
      console.log(error);
      return { status: false };
    }
  };

  return {
    isNeedApproveCurrency,
    handleConfirmSuccess,
    handleConfirmFail,
    handleCancelMetamask,
    isTransactionSuccess,
    getAllowanceERC20,
    updateTransaction,
  };
};
