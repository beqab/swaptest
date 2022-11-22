import React, { useState } from "react";
import { useSelector } from "react-redux";
import transactionServices from "services/transaction";

const useProfileHook = () => {
  const user = useSelector((state: any) => ({ ...state.authReducer.user }));

  const initParams = {
    isMyNft: true,
    address: user.game_wallet_address,
    keyword: "",
    mythologies: [],
    levels: [],
    classes: [],
    sortField: "ownerNft.updatedAt",
    sortBy: -1,
    page: 1,
    perPage: 12,
    searched: false,
  };

  const [params, setParams] = useState(initParams) as any;
  const [loading, setLoading] = useState(false);
  const [listNfts, setListNfts] = useState([]);
  const [total, setTotal] = useState(0);

  const handleFetListNFT = async (game_wallet_address) => {
    setLoading(true);
    try {
      const { response } = await transactionServices.getListNft({
        ...params,
        address: game_wallet_address,
      });
      setLoading(false);
      setListNfts(response?.data[0]?.data);
      const metadata = response?.data[0]?.metadata?.[0];
      setTotal(metadata?.total ?? 0);
    } catch (error) {
    } finally {
      setTimeout(() => setLoading(false), 250);
    }
  };

  return {
    handleFetListNFT,
    loading,
    params,
    setParams,
    initParams,
    listNfts,
    total,
  };
};

export default useProfileHook;
