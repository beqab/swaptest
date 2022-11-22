import React, { useEffect, useState } from "react";
import transactionServices from "services/transaction";
import { Pagination, PaginationProps } from "antd";
import {
  TRANSACTION_FILTER_TYPE,
  TRANSACTION_ORDER,
  TRANSACTION_SORT_TYPE,
} from "@constant/s";
import moment from "moment";

const defaultParams = {
  page: 1,
  limit: 10,
  filter_type: TRANSACTION_FILTER_TYPE.NA,
  sort_type: TRANSACTION_SORT_TYPE.DATE,
  order: TRANSACTION_ORDER.DESC,
  from_date: undefined,
  to_date: moment().unix(),
  transaction_status: 0,
};

const UseSwapHistoryHook = () => {
  const [params, setParams] = useState(defaultParams);
  const [metaData, setMetaData] = useState({
    total: 1,
  });
  const [sortModal, setSortModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dayFrom, setDayFrom] = useState();
  const [dayTo, setDayTo] = useState();

  useEffect(() => {
    getTransactionHistory();
  }, [params]);
  const getTransactionHistory = async () => {
    setLoading(true);
    try {
      const response = await transactionServices.getTransactionHistory(params);
      setLoading(false);
      setTransactions(response?.responseData?.transaction_history);
      setMetaData(response?.responseData?.meta_data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const changePage: PaginationProps["onChange"] = (page, pageSize) => {
    setParams({
      ...params,
      page,
      limit: pageSize,
    });
  };

  const changeFilter = (param) => {
    if (param.type === "date") {
      // filter by date
      if (param.flag === "from") {
        if (params.transaction_status !== 0) {
          setParams({
            ...params,
            filter_type: TRANSACTION_FILTER_TYPE.MULTI_TYPE,
            from_date: moment(param.value).startOf("day").unix(),
          });
        } else {
          setParams({
            ...params,
            filter_type: param.value === 0 ? 0 : TRANSACTION_FILTER_TYPE.DATE,
            from_date: moment(param.value).startOf("day").unix(),
          });
        }
      } else {
        if (params.transaction_status !== 0) {
          setParams({
            ...params,
            filter_type: TRANSACTION_FILTER_TYPE.MULTI_TYPE,
            to_date: moment(param.value).endOf("day").unix(),
          });
        } else {
          setParams({
            ...params,
            filter_type: param.value === 0 ? 0 : TRANSACTION_FILTER_TYPE.DATE,
            to_date: moment(param.value).endOf("day").unix(),
          });
        }
      }
    } else {
      // filter by status
      if (params.from_date !== undefined && param.value !== 0) {
        setParams({
          ...params,
          filter_type: TRANSACTION_FILTER_TYPE.MULTI_TYPE,
          transaction_status: param.value,
        });
      } else {
        setParams({
          ...params,
          filter_type:
            param.value === 0 && params.from_date !== undefined
              ? TRANSACTION_FILTER_TYPE.DATE
              : param.value !== 0
              ? TRANSACTION_FILTER_TYPE.STATUS
              : 0,
          transaction_status: param.value,
        });
      }
    }
  };

  const changeSort = (param) => {
    if (param) {
      let order = TRANSACTION_ORDER.DESC;
      if (params.sort_type === param) {
        if (params.order === TRANSACTION_ORDER.ASC) {
          order = TRANSACTION_ORDER.DESC;
        } else {
          order = TRANSACTION_ORDER.ASC;
        }
      }
      setParams({
        ...params,
        sort_type: param,
        order,
      });
    }
  };

  return {
    changeFilter,
    changeSort,
    changePage,
    params,
    setParams,
    sortModal,
    setSortModal,
    filterModal,
    setFilterModal,
    transactions,
    setTransactions,
    metaData,
    loading,
    setDayFrom,
    dayFrom,
    dayTo,
    setDayTo,
    getTransactionHistory,
  };
};

export default UseSwapHistoryHook;
