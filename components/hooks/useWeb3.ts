import Web3 from "web3";
import { useEffect, useState } from "react";

export const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    var instance;
    // eslint-disable-next-line no-use-before-define
    if ((window as any).ethereum) {
      try {
        // eslint-disable-next-line no-use-before-define
        instance = new Web3((window as any).ethereum);
        // debugger;
      } catch (err) {
        console.log(err);
      }
    } else if ((window as any).web3) {
      instance = new Web3((window as any).web3);
      //   debugger;
    }
    //  else {
    //   const provider = new Web3.providers.HttpProvider("http://127.0.0.1:3000");
    //   instance = new Web3(provider);
    // }
    setWeb3(instance);
  }, []);

  return web3;
};
