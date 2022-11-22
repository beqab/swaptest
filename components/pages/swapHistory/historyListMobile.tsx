import React, { useEffect, useState } from "react";
import classnames from "classnames";
import moment from "moment";

const HistoryListMobile = ({
  transactions,
  GetStatusBtn,
  params,
  loading,
  handleCancel,
  handleCancelAOGtoGAOG
}) => {
  const [fullTransaction, setFullTransaction] = useState(null);

  const toggleTransaction = (id) => {
    if (id == fullTransaction) {
      setFullTransaction(null);
    } else {
      setFullTransaction(id);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loading_icon">
          <img src="/icons/loading_icon.svg" alt="" />
        </div>
      ) : transactions && transactions.length > 0 ? (
        <>
          {transactions.map((el, i) => {
            return (
              <div key={i} className="historyTable_row flex-column">
                <div className="w-100  d-flex justify-content-between align-items-center">
                  <div>
                    {" "}
                    <span className="">{el.transaction_amount} </span>
                    {el.transaction_type === 2 ? `AOG > gAOG` : "gAOG > AOG"}
                  </div>
                  <svg
                    onClick={() => toggleTransaction(el.transaction_id)}
                    className={classnames("pointer", {
                      rotate: el.transaction_id === fullTransaction,
                    })}
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                  >
                    <g
                      id="Group_973"
                      data-name="Group 973"
                      transform="translate(-599 -302)"
                    >
                      <circle
                        id="Ellipse_788"
                        data-name="Ellipse 788"
                        cx="13"
                        cy="13"
                        r="13"
                        transform="translate(599 302)"
                        fill="#fff"
                        opacity="0.07"
                      />
                      <path
                        id="Icon_ionic-ios-arrow-down"
                        data-name="Icon ionic-ios-arrow-down"
                        d="M11.433,15.435,15.4,11.467a.746.746,0,0,1,1.058,0,.756.756,0,0,1,0,1.062l-4.493,4.5a.748.748,0,0,1-1.033.022L6.406,12.531A.749.749,0,1,1,7.464,11.47Z"
                        transform="translate(600.569 300.756)"
                        fill="#00bbd6"
                      />
                    </g>
                  </svg>
                </div>
                <div
                  className={classnames("dropdownContent w-100", {
                    "d-none": el.transaction_id !== fullTransaction,
                  })}
                >
                  <div className="w-100">
                    <label>No.</label>
                    <div className="">
                      {i + 1 + (params.page - 1) * params.limit}
                    </div>
                  </div>
                  <div className="w-100">
                    <label>Transaction ID</label>
                    <div className="">{el.transaction_id}</div>
                  </div>
                  <div className="w-100">
                    <label>Date/Time</label>
                    <div className="">
                      {moment(el.transaction_date).format("YYYY-MM-DD, h:mm A")}
                    </div>
                  </div>
                  <div className="transactionStatus statusMobile w-100">
                    <label>Status</label>
                    <div className="button-status">
                      <GetStatusBtn status={el.transaction_status} />

                      {el.transaction_status === 1 &&
                        el.transaction_type === 1 && (
                          <button
                            className="cancelBtn"
                            onClick={() => handleCancel(el)}
                          >
                            Cancel
                          </button>
                        )}
                      {el.transaction_status === 1 &&
                        el.transaction_type === 2 && (
                          <button
                            className='cancelBtn'
                            onClick={() => handleCancelAOGtoGAOG(el)}
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="noData">
          <img src="/img/nodata.png" alt="" />
        </div>
      )}
    </>
  );
};

export default HistoryListMobile;
