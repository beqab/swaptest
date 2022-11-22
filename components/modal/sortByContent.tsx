import React from "react";
import { TRANSACTION_SORT_TYPE } from "../../constants";

const sortByContent = ({ changeSort }) => {
  return (
    <div className="filterContent">
      <div className="d-flex align-items-center">
        <img src="/icons/sort_icon.svg" alt="" />
      </div>
      <div
        className="pointer mt-3 mb-2"
        onClick={() => changeSort(TRANSACTION_SORT_TYPE.DATE)}
      >
        Sort By Transaction Date
      </div>
      <div
        className="pointer"
        onClick={() => changeSort(TRANSACTION_SORT_TYPE.ID)}
      >
        Sort By Transaction ID
      </div>
    </div>
  );
};

export default sortByContent;
