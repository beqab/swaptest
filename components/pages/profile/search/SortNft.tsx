import { useState } from "react";

const SortNft = ({
  setActiveModalSort,
  onSetParams,
  params,
}: {
  setActiveModalSort: any;
  onSetParams: any;
  params: any;
}) => {
  const sortOptions = [
    {
      label: "Sort By Purchase Date",
      sortBy: -1,
      sortField: "ownerNft.updatedAt",
    },
    {
      label: "Sort By NFT name",
      sortBy: 1,
      sortField: "name",
    },
  ];

  const handleSort = (field, value) => {
    onSetParams({
      ...params,
      sortField: field,
      sortBy: value,
      searched: true,
    });
  };
  return (
    <div className="sortNft">
      <img
        src="/icons/icon_close.svg"
        alt=""
        onClick={() => setActiveModalSort(false)}
        className="iconClose"
      />
      <div className="sortNft-contain">
        <div className="d-flex align-items-center">
          <img src="/icons/sort_icon.svg" alt="" />
        </div>
        {sortOptions.map((el, idx) => (
          <div
            key={idx}
            className="pointer mt-3 mb-2"
            onClick={() => handleSort(el.sortField, el.sortBy)}
          >
            {el.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortNft;
