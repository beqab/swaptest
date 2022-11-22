import React from "react";
import classnames from "classnames";
import HistoryMobile from "../components/pages/swapHistory/historyListMobile";
import SortByContent from "../components/modal/sortByContent";
import FilterContent from "../components/modal/filterContent";
import { UseCheckAuth } from "../components/hooks/useCheckAuth";
import moment from "moment";
import { Pagination } from "antd";
import MetamaskService from "services/MetamaskService";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { handleSetLoadingCancelTransaction } from "redux/actions/modalAction";
import showMessage from "@components//message";
import {
  MESSAGE,
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_UPDATE,
} from "@constant/s";
import transactionServices from "services/transaction";

const GetStatusBtn = ({ status }) => {
  return (
    <div
      className={classnames({
        InProgress: status === 1,
        Completed: status === 2,
        Failed: status === 3,
        Canceled: status === 4,
      })}
    >
      {status === 1
        ? " In Progress"
        : status === 2
        ? "Completed"
        : status === 3
        ? "Failed"
        : "Cancelled"}
    </div>
  );
};

const SwapHistory = ({
  changeFilter,
  changeSort,
  changePage,
  params,
  sortModal,
  setSortModal,
  filterModal,
  setFilterModal,
  transactions,
  metaData,
  loading,
  setDayFrom,
  dayFrom,
  dayTo,
  setDayTo,
  setChangeTab,
  isTransactionSuccess,
  getTransactionHistory,
}) => {
  UseCheckAuth();
  const { library, account: address, active } = useWeb3React();
  const dispatch = useDispatch();
  const wallet = new MetamaskService();

  const handleCancelAOGtoGAOG = async (transaction) => {
    window.scrollTo(0, 0);
    dispatch(handleSetLoadingCancelTransaction(true));

    try {
      const swapData = await wallet.swapDatas({
        library,
        account: address,
        internalTx: transaction.transaction_id,
      });
      if (swapData.swapTime.toString() === "0") {
        const response = await transactionServices.updateTransaction({
          internal_transaction_id: transaction.transaction_id,
          transaction_hash: "N/A",
          transaction_status: TRANSACTION_STATUS.CANCEL,
        });
        if (response?.error) {
          showMessage(MESSAGE.ERROR, response?.message);
        } else {
          await getTransactionHistory();
        }
      } else {
        showMessage(
          MESSAGE.ERROR,
          "The transaction in process. Please wait a few minutes before you try again"
        );
      }
    } catch (error) {
      showMessage(MESSAGE.ERROR, error?.message);
      console.log(error);
    }
    dispatch(handleSetLoadingCancelTransaction(false));
  };

  const handleCancel = async (transaction) => {
    window.scrollTo(0, 0);
    dispatch(handleSetLoadingCancelTransaction(true));

    await wallet.cancelTx({
      library,
      account: address,
      internalTx: transaction.transaction_id,
      amount: transaction.transaction_amount,
      signature: transaction.transaction_signature,
      receiver: address,
      isTransactionSuccess: isTransactionSuccess(
        transaction.transaction_id,
        "CANCEL"
      ),
      onSuccess: async () => {
        await getTransactionHistory();
        dispatch(handleSetLoadingCancelTransaction(false));
      },
      onError: (error) => {
        showMessage(MESSAGE.ERROR, error?.reason);
        dispatch(handleSetLoadingCancelTransaction(false));
      },
      onCancelMetamask: () => {
        dispatch(handleSetLoadingCancelTransaction(false));
      },
    });
  };
  return (
    <>
      <h2 className="text-center mt-5 pt-5 historyTitle">
        <img
          src="/img/icon-back.png"
          className="iconBack"
          onClick={() => setChangeTab(false)}
          alt="icon-back"
        ></img>{" "}
        Swap History
      </h2>

      <div className="historyTable mt-4">
        <div className="modalSort" hidden={!sortModal}>
          <div className="modalSortContain">
            <img
              src="/icons/icon_close.svg"
              alt=""
              onClick={() => setSortModal(false)}
            />
            <SortByContent changeSort={changeSort} />
          </div>
        </div>

        <div className="modalFilter modalSort" hidden={!filterModal}>
          <div className="modalSortContain modalFilterContain">
            <img
              src="/icons/icon_close.svg"
              alt=""
              onClick={() => setFilterModal(false)}
            />
            <FilterContent
              dayFrom={dayFrom}
              dayTo={dayTo}
              setDayFrom={setDayFrom}
              setDayTo={setDayTo}
              changeFilter={changeFilter}
            />
          </div>
        </div>

        <div className="d-flex h-flex-sort justify-content-between justify-content-md-end align-items-center ">
          <label className="d-block d-md-none">
            <b>Operations</b>
          </label>
          <div className="d-flex">
            <div className="relative relativeSort">
              <button
                onClick={() => {
                  setSortModal(true);
                  setFilterModal(false);
                }}
                className="filterBtn"
              >
                <img src="/icons/sort.svg" alt="" />
                Sort By
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setFilterModal(true), setSortModal(false);
                }}
                className="filterBtn"
              >
                <img src="/icons/filter.svg" alt="" />
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="historyTable_header d-none d-md-flex ">
          <div className="no">No.</div>
          <div className="operation">Amount</div>
          <div className="trId">Transaction Id</div>
          <div className="trTime">Date/Time</div>
          <div className="transactionStatus text-center">Status</div>
          <div className="text-center"></div>
        </div>
        <div className="historyTable_body d-none d-md-block">
          {loading ? (
            <div className="loading_icon">
              <img src="/icons/loading_icon.svg" alt="" />
            </div>
          ) : transactions && transactions.length > 0 ? (
            transactions.map((el, i) => {
              return (
                <div key={i} className="historyTable_row">
                  <div className="no">
                    {i + 1 + (params.page - 1) * params.limit}
                  </div>
                  <div className="operation">
                    <span className="">{el.transaction_amount} </span>
                    {el.transaction_type === 2 ? `AOG > gAOG` : "gAOG > AOG"}
                  </div>
                  <div className="trId">{el.transaction_id}</div>
                  <div className="trTime">
                    {moment(el.transaction_date).format("YYYY-MM-DD, h:mm A")}
                  </div>
                  <div className='transactionStatus'>
                    <GetStatusBtn status={el.transaction_status} />
                    <div>
                      {el.transaction_status === 1 &&
                        el.transaction_type === 1 && (
                          <button
                            className='cancelBtn'
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
              );
            })
          ) : (
            <div className="noData">
              <img src="/img/nodata.png" alt="" />
            </div>
          )}
        </div>

        <div className="historyTable_body_mobile d-block d-md-none">
          <HistoryMobile
            params={params}
            transactions={transactions}
            GetStatusBtn={GetStatusBtn}
            loading={loading}
            handleCancel={handleCancel}
            handleCancelAOGtoGAOG={handleCancelAOGtoGAOG}
          />
        </div>
        <div className="pagination-container">
          {transactions && transactions.length > 0 && (
            <Pagination
              defaultCurrent={1}
              total={metaData?.total}
              pageSizeOptions={[10, 20, 50]}
              showSizeChanger={true}
              onChange={changePage}
              defaultPageSize={10}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SwapHistory;
