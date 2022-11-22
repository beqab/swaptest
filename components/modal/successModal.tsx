import { EXTERNAL_URL } from "@constant/s";
import { BASE_SCAN_URLS, CHAIN_ID } from "connectors/constants";
import Link from "next/link";
import React from "react";

const SuccessModal = ({
  setActiveModalSuccess,
  linkViewBsc,
  swapAogToGaog,
  amount,
  setAmountTokenSwap,
}: {
  setActiveModalSuccess: any;
  linkViewBsc?: string;
  amount?: any;
  swapAogToGaog?: boolean;
  setAmountTokenSwap?: any;
}) => {
  return (
    <div className="modalContain">
      <div className="titleBig">Successful Swap</div>
      <img
        src="/icons/icon-cancel-white.png"
        className="buttonCancel"
        onClick={() => {
          setActiveModalSuccess(false), setAmountTokenSwap("");
        }}
        alt='icon-cancel-white'
      />
      <div className="text-center">
        <img src="/icons/success.svg" alt="" />
      </div>
      <div className="modalSuccessTitile">
        <div>
          {" "}
          Congratulations, you have successfully swapped{" "}
          <span className="textBold">{amount}</span>{" "}
          {swapAogToGaog ? (
            <>
              <span className="textBold">AOG </span> to{" "}
              <span className="textBold">gAOG</span>
            </>
          ) : (
            <>
              <span className="textBold">gAOG </span> to{" "}
              <span className="textBold">AOG</span>
            </>
          )}
          . <span className="textBold">{amount}</span>{" "}
          {swapAogToGaog ? (
            <>
              {" "}
              <span className="textBold">gAOG </span>has been transferred to
              your account
            </>
          ) : (
            <>
              <span className="textBold">AOG </span> has been transferred to
              your wallet
            </>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-center w-100 mt-3">
        {!swapAogToGaog ? (
          <Link
            href={`${
              BASE_SCAN_URLS[Number(process.env.NEXT_PUBLIC_CHAIN_ID)]
            }/tx/${linkViewBsc}`}
          >
            <a target="_blank">
              <button className="btn btn-danger aogBtn  aogBtn-success  btn-primary  mt-3 mb-3 px-4">
                View on BSCScan
              </button>
            </a>
          </Link>
        ) : (
          <></>
          // <Link href="/my-nft">
          //   <a target="">
          //     <button className="btn btn-danger aogBtn  aogBtn-success  btn-primary  mt-3 mb-3 px-4">
          //       View My Profile
          //     </button>
          //   </a>
          // </Link>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
