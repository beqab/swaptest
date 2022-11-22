import React from "react";
import { useSelector } from "react-redux";

import Modal from "./modalWrapper";

const LoadingModal = () => {
  const {
    isShowLoadingTransaction,
    isShowLoadingConnectWallet,
    isShowLoadingCancelTransaction,
  } = useSelector((state: any) => state.modalReducer);
  return (
    <div className="modalLoading">
      {isShowLoadingConnectWallet && (
        <>
          <div className="titleLoading">Processing Request</div>
          <div className="d-flex justify-content-center mt-4 pb-4 w-100 mt-3">
            <img src="/icons/icon-wallet-loading.svg" alt="" />
          </div>
          <div className="title">
            Your wallet is being connected to the system. <br /> Please wait for
            a white...
          </div>
        </>
      )}

      {isShowLoadingTransaction && (
        <>
          <div className="titleLoading">Processing Request</div>
          <div className="d-flex justify-content-center mt-4 pb-4 w-100 mt-3">
            <div className="snippet" data-title=".dot-elastic">
              <div className="stage">
                <div className="dot-elastic"></div>
              </div>
            </div>
          </div>
          <div className="title">
            Your request is being processed. Please do not close the browser
            until the processing is over otherwise, you may lose your assets
          </div>
        </>
      )}

      {isShowLoadingCancelTransaction && (
        <>
          <div className="titleLoading">Processing cancel transaction</div>
          <div className="d-flex justify-content-center mt-4 pb-4 w-100 mt-3">
            <div className="snippet" data-title=".dot-elastic">
              <div className="stage">
                <div className="dot-elastic"></div>
              </div>
            </div>
          </div>
          <div className="title">
            Your request is being processed. <br /> Please do not close the
            browser until the processing is over. Otherwise, the transaction
            might be failed.
          </div>
        </>
      )}
    </div>
  );
};

export default LoadingModal;
