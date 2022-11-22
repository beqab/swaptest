import Link from "next/link";
import React from "react";

const RejectModal = ({ setActiveModalFail }: { setActiveModalFail?: any }) => {
  return (
    <div className="modalContain">
      <div className="titleBig">Unsuccessful Swap</div>
      <img
        src="/icons/icon-cancel-white.png"
        className="buttonCancel"
        onClick={() => {
          setActiveModalFail(false);
        }}
        alt='icon-cancel-white'
      />
      <div className="text-center">
        <img src="/icons/reject.svg" alt="" />
      </div>
      <div className="modalSuccessTitile modalReject">
        <div>
          Unfortunately, your swap was unsuccessful. <br /> Please try again
          later
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
