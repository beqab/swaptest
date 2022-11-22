import React, { useEffect, useState } from "react";
import Loader from "../components/pageLoader";
import { UseCheckAuth } from "../components/hooks/useCheckAuth";
import Swap from "./swap";

const ConnectWallet = () => {
  const [loading, setLoading] = useState(true);
  UseCheckAuth();
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Swap />
    </div>
  );
};

export default ConnectWallet;
