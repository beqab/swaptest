import AppButton from "@components//button";
import showMessage from "@components//message";
import NumberFormat from "@components//NumberFormat";
import { MESSAGE, TYPE_TRANSACTION_SWAP } from "@constant/s";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useDispatch } from "react-redux";
import { handleSetLoadingTransaction } from "redux/actions/modalAction";
import MetamaskService from "services/MetamaskService";
import transactionServices from "services/transaction";

const ModalSwapConfirm = ({
  isNeedApproveCurrency,
  amountTokenSwap,
  swapAogToGaog,
  swapGaogToAog,
  isLoading,
  isActiveBtnCancel,
  setVisibleModalConfirm,
  setIsActiveBtnCancel,
  setIsLoading,
  setAmountTokenSwap,
  setLinkViewBsc,
  setActiveModalFail,
  handleConfirmSuccess,
  handleApproveCurrencySuccess,
  handleApproveCurrencyFailed,
  handleCancleApproveMemask,
  handleLoadingApprove,
  handleConfirmFail,
  handleCancelMetamask,
  isTransactionSuccess,
  updateTransaction,
  activeButtonApprove,
  isActiveBtnConfirm,
  setChangeTab
}) => {
  const { library, account: address, active } = useWeb3React();
  const dispatch = useDispatch();
  const wallet = new MetamaskService();

  const handleApproveToken = async () => {
    setVisibleModalConfirm(false);
    dispatch(handleSetLoadingTransaction(true));
    //setIsLoading(true);
    setIsActiveBtnCancel(true);
    try {
      await wallet.setAllowanceERC20({
        account: address,
        library,
        onSuccess: handleApproveCurrencySuccess,
        onError: handleApproveCurrencyFailed,
        onCancelMetamask: handleCancleApproveMemask,
        onLoading: handleLoadingApprove,
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setVisibleModalConfirm(false);
    dispatch(handleSetLoadingTransaction(true));

    try {
      const response = await transactionServices.createTransaction({
        game_token: amountTokenSwap,
        transaction_type: swapAogToGaog
          ? TYPE_TRANSACTION_SWAP.AOG_TO_GAOG
          : TYPE_TRANSACTION_SWAP.GAOG_TO_AOG,
        transaction_time_stamp: new Date().valueOf(),
      });
      if (response?.error) {
        setChangeTab(true)
        showMessage(MESSAGE.ERROR, response?.message);
        dispatch(handleSetLoadingTransaction(false));
        setAmountTokenSwap("");
      } else {
        const internal_transaction_id =
          response?.responseData?.internal_transaction_id;
        const signature = response?.responseData?.signature;

        if (swapAogToGaog) {
          await wallet.swapTokensForPoints({
            library,
            account: address,
            internalTx: internal_transaction_id,
            amount: amountTokenSwap,
            onSuccess: handleConfirmSuccess,
            onError: handleConfirmFail(internal_transaction_id),
            setLinkViewBsc,
            onCancelMetamask: handleCancelMetamask(
              internal_transaction_id,
              false
            ),
            isTransactionSuccess: isTransactionSuccess(
              internal_transaction_id,
              "SUCCESS"
            ),
            updateTransaction: updateTransaction(
              "FAILED",
              internal_transaction_id
            ),
          });
        } else {
          await wallet.swapPointsForToken({
            library,
            account: address,
            internalTx: internal_transaction_id,
            amount: amountTokenSwap,
            signature: signature,
            receiver: address,
            onSuccess: handleConfirmSuccess,
            onError: handleConfirmFail(internal_transaction_id),
            setLinkViewBsc,
            onCancelMetamask: handleCancelMetamask(
              internal_transaction_id,
              true
            ),
            isTransactionSuccess: isTransactionSuccess(
              internal_transaction_id,
              "SUCCESS"
            ),
            updateTransaction: updateTransaction(
              "FAILED",
              internal_transaction_id
            ),
          });
        }
      }
    } catch (error) {
      console.log(error);
      setChangeTab(true);
      showMessage(MESSAGE.ERROR, error?.message);
      dispatch(handleSetLoadingTransaction(false));
      setActiveModalFail(true);
    }
  };

  return (
    <div className="modalContain">
      <img
        src="/icons/icon-cancel-white.png"
        onClick={() => {
          !isActiveBtnCancel && setVisibleModalConfirm(false);
        }}
        className="buttonCancel"
        alt="icon-cancel-white"
      />
      <div className="modalContent">
        <div className="title">Swap Confirmation</div>
        <div className="tokenPay">
          <div className="name">You will pay</div>
          <div className="amount">
            <NumberFormat
              value={amountTokenSwap}
              thousandSeparator
              displayType="text"
            />{" "}
            {swapAogToGaog ? "AOG" : "gAOG"}
          </div>
        </div>
        <div className="tokenPay">
          <div className="name">You will receive</div>
          <div className="amount">
            <NumberFormat
              value={amountTokenSwap}
              thousandSeparator
              displayType="text"
            />{" "}
            {swapAogToGaog ? "gAOG" : "AOG"}
          </div>
        </div>
        <div className="button">
          {swapAogToGaog && isNeedApproveCurrency && (
            <AppButton
              text={"Approve AOG"}
              onClick={handleApproveToken}
              variant="default"
              disabled={!activeButtonApprove}
              className="buttonApprove"
            />
          )}

          <AppButton
            text={"Confirm"}
            onClick={handleConfirm}
            variant="default"
            disabled={
              (swapAogToGaog && activeButtonApprove && isNeedApproveCurrency) ||
              (swapGaogToAog && false)
            }
            className={`buttonConfirm ${
              !swapAogToGaog && "buttonConfirmGaogToAog"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalSwapConfirm;
