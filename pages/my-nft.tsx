import SideMenu from "@components//asideMenu";
import Header from "@components//header";
import MobilePageMenu from "@components//mobilePageMenu";
import useProfileHook from "@components//pages/profile/hook/useProfileHook";
import MyNft from "@components//pages/profile/my-nft";
import SearchNft from "@components//pages/profile/search";
import { useWeb3React } from "@web3-react/core";
import { Pagination, PaginationProps } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleShowConnectModal } from "redux/actions/modalAction";

const SuccessModal = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const user = useSelector((state: any) => ({ ...state.authReducer.user }));

  const {
    handleFetListNFT,
    listNfts,
    total,
    loading,
    params,
    setParams,
    initParams,
  } = useProfileHook();

  useEffect(() => {
    handleFetListNFT(user.game_wallet_address);
  }, [params, user.game_wallet_address]);

  const changePage: PaginationProps["onChange"] = (page, pageSize) => {
    setParams({
      ...params,
      page,
    });
  };

  const handleConnectWallet = () => {
    dispatch(handleShowConnectModal(true));
  };

  return (
    <>
      <div className="d-block d-md-none">
        <Header />
      </div>
      <div className="withAsideMenu pageBg pageBgPoseidon aogPage d-block d-md-flex">
        <MobilePageMenu />
        <SideMenu />
        <section className="d-flex ">
          <div className="pageProfile">
            <div className="profileTitle">My NFTs</div>
            <SearchNft
              onSetParams={setParams}
              initParams={initParams}
              params={params}
            />
            {account &&
            account.toLowerCase() ===
              user?.game_wallet_address?.toLowerCase() ? (
              <>
                <MyNft
                  listNfts={listNfts}
                  loading={loading}
                  total={total}
                  params={params}
                />
                <div className="pagination-container">
                  {total > 0 && (
                    <Pagination
                      defaultCurrent={1}
                      total={total}
                      onChange={changePage}
                      defaultPageSize={12}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="pageProfile-connect">
                <img src="/icons/icon-wallet-solid.svg" alt="" />
                <div className="titleConnect">
                  Please connect your wallet to Continue
                </div>
                <button
                  className="btn aogBtn btn-primary w-100 mt-3 mb-3 btnConnectWallet"
                  onClick={handleConnectWallet}
                >
                  Connect wallet
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default SuccessModal;
