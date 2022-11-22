import React from "react";
import { useRouter } from "next/router";
import classnames from "classnames";

const SwapMenu = ({
  setChangeTab,
  changeTab,
  setSortModal,
  setFilterModal,
}) => {
  const router = useRouter();

  return (
    <div className="swapTabMenu d-none d-md-flex">
      <div
        onClick={() => {
          setChangeTab(false);
        }}
        className={classnames({
          active: !changeTab,
        })}
      >
        Swap
      </div>
      <div
        onClick={() => {
          setChangeTab(true);
          setFilterModal(false);
          setSortModal(false);
        }}
        className={classnames({
          active: changeTab,
        })}
      >
        Swap History
      </div>
    </div>
  );
};

export default SwapMenu;
