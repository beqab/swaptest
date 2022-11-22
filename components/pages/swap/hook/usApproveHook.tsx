import showMessage from "@components//message";
import { MESSAGE } from "@constant/s";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { handleSetLoadingTransaction } from "redux/actions/modalAction";

const UseApproveHook = ({
  setVisibleModalConfirm,
  setIsActiveBtnCancel,
  setIsLoading,
  getAllowanceERC20,
  setActiveButtonApprove,
  setIsActiveBtnConfirm,
}) => {
  const dispatch = useDispatch();
  const { account: address } = useWeb3React();

  const handleApproveCurrencySuccess = async () => {
    // const response = await getAllowanceERC20(address);

    // if (response.toString() !== "0") {
    setActiveButtonApprove(false);
    dispatch(handleSetLoadingTransaction(false));
    setVisibleModalConfirm(true);
    showMessage(MESSAGE.SUCCESS, "Approve currency successfully");
    setIsActiveBtnCancel(false);
    // }
  };

  const handleApproveCurrencyFailed = () => {
    // setIsLoading(false);
    setTimeout(() => {
      getAllowanceERC20();
    }, 12000);
    dispatch(handleSetLoadingTransaction(false));
    showMessage(MESSAGE.ERROR, "Approve currency unsuccessfully");
    setIsActiveBtnCancel(false);
  };

  const handleCancleApproveMemask = () => {
    dispatch(handleSetLoadingTransaction(false));
    setVisibleModalConfirm(true);
    setIsActiveBtnCancel(false);
    //setIsLoading(false);
  };

  const handleLoadingApprove = () => {
    dispatch(handleSetLoadingTransaction(false));
    // setIsLoading(true);
  };
  return {
    handleApproveCurrencySuccess,
    handleApproveCurrencyFailed,
    handleCancleApproveMemask,
    handleLoadingApprove,
  };
};

export default UseApproveHook;
