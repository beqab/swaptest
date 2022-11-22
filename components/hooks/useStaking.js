import {
  useUSDLp,
  useERC20Approval,
  useERC20Balance,
  getTimeLeft,
  useRefresh,
  toBigNumber,
  STATE,
  awaitTransaction,
  useLp,
} from "@react-dapp/utils";
import { Multicall } from "ethereum-multicall";
import { useEffect, useState } from "react";
import stakingAbi from "../../bbt/staking_abi.json";
import BigNumber from "bignumber.js";
import { useContract, useEthers } from "@react-dapp/utils";
import { ethers as eth } from "ethers";
import { useEagerConnect } from "@react-dapp/wallet";

const STAKING_ADDRESS = "0x65c2439e98030312c3c5fc78C1Bfc0D034749F97";
const TOKEN_ADDRESS = "0x40C8225329Bd3e28A043B029E0D07a5344d2C27C";
const LP_ADDRESS = "0x88c9bf5E334e2591C6A866D5E20683E31226Be3d";
export const TOKEN_DECIMALS = 18;
export const BLOCKS_PER_YEAR = new BigNumber(10512000);

export const useStakingAPY = () => {
  const [loading, setLoading] = useState(false);
  const [apy, setApy] = useState("0");

  const { lp } = useLp(LP_ADDRESS, "BUSD");
  const stakingContract = useContract(stakingAbi, STAKING_ADDRESS);

  useEffect(() => {
    const calculateApy = async () => {
      setLoading(true);

      const totalStaked = toBigNumber(
        (await stakingContract.poolInfo(0)).stakedAmount
      ).div(new BigNumber(10).exponentiatedBy(TOKEN_DECIMALS));
      const tokenPerBlock = toBigNumber(
        (await stakingContract.poolInfo(0)).tokenPerBlock
      ).div(new BigNumber(10).exponentiatedBy(TOKEN_DECIMALS));
      const price = lp?.price.baseTokenPrice.toFixed(4);
      const _apy =
        getPoolApy(
          price,
          price,
          totalStaked,
          tokenPerBlock
        )?.toLocaleString() ?? 0;
      setApy(_apy);

      setLoading(true);
    };

    if (stakingContract && lp) calculateApy();
  }, [stakingContract, lp]);

  return { loading, apy };
};

export const useStakeDetails = (reload) => {
  useEagerConnect();
  const { fastRefresh } = useRefresh();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    reward: undefined,
    displayReward: undefined,
    amount: undefined,
    displayAmount: undefined,
    depositTime: undefined,
    canHarvest: undefined,
    stakedTime: undefined,
  });
  const [totalStaked, setTotalStaked] = useState(undefined);
  const [totalReward, setTotalReward] = useState(undefined);
  const [tokenPerBlock, setTokenPerBlock] = useState(undefined);
  const [unstakeFee, setUnstakeFee] = useState(undefined);
  const [unstakeFeePercent, setUnstakeFeePercent] = useState(undefined);

  const { ethers, account, displayAccount } = useEthers();
  const stakingContract = useContract(stakingAbi, STAKING_ADDRESS);
  const { lp } = useLp(LP_ADDRESS, "BUSD");

  useEffect(() => {
    const loadStaked = async () => {
      if (stakingContract) {
        setTotalStaked(
          toBigNumber((await stakingContract.poolInfo(0)).stakedAmount).div(
            new BigNumber(10).exponentiatedBy(TOKEN_DECIMALS)
          )
        );
        setTokenPerBlock(
          toBigNumber((await stakingContract.poolInfo(0)).tokenPerBlock).div(
            new BigNumber(10).exponentiatedBy(TOKEN_DECIMALS)
          )
        );
      }
    };
    loadStaked();
  }, [stakingContract]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      const multicall = new Multicall({
        ethersProvider: ethers,
        tryAggregate: false,
      });
      const stakeInfoCall = [
        {
          reference: "stakeInfo",
          contractAddress: STAKING_ADDRESS,
          abi: stakingAbi,
          calls: [
            {
              reference: "pendingToken",
              methodName: "pendingToken",
              methodParameters: [0, account],
            },
            {
              reference: "userInfo",
              methodName: "userInfo",
              methodParameters: [0, account],
            },
            {
              reference: "canHarvest",
              methodName: "canHarvest",
              methodParameters: [0, account],
            },
            {
              reference: "poolInfo",
              methodName: "poolInfo",
              methodParameters: [0],
            },
          ],
        },
      ];

      const data = await multicall.call(stakeInfoCall);
      const result = data.results.stakeInfo?.callsReturnContext;

      const stakedTime = new BigNumber(
        result[1].returnValues[4].hex
      ).toNumber();
      const _details = {
        reward: toBigNumber(result[0].returnValues[0]),
        displayReward: toBigNumber(result[0].returnValues[0])
          .div(new BigNumber(10).exponentiatedBy(TOKEN_DECIMALS))
          .toFormat(10),
        amount: toBigNumber(result[1].returnValues[0]),
        displayAmount: toBigNumber(result[1].returnValues[0])
          .div(new BigNumber(10).exponentiatedBy(TOKEN_DECIMALS))
          .toFormat(10),
        depositTime: toBigNumber(result[1].returnValues[4]).toNumber(),
        canHarvest: result[2].returnValues[0],
        stakedTime: getTimeLeft(
          stakedTime === 0 ? 0 : Date.now() / 1000 - stakedTime
        ),
      };

      setUserDetails(_details);
      setLoading(false);
      setTotalStaked(
        toBigNumber(result[3].returnValues[2]).div(
          new BigNumber(10).exponentiatedBy(TOKEN_DECIMALS)
        )
      );
      setTokenPerBlock(
        toBigNumber(result[3].returnValues[4]).div(
          new BigNumber(10).exponentiatedBy(TOKEN_DECIMALS)
        )
      );

      const staking = new eth.Contract(STAKING_ADDRESS, stakingAbi, ethers);
      const withdrawFee = await staking.getWithdrawFee(0, stakedTime);
      setUnstakeFeePercent(withdrawFee / 10);
      setUnstakeFee(
        _details.amount
          .times(withdrawFee)
          .div(1000)
          .div(new BigNumber(10).exponentiatedBy(TOKEN_DECIMALS))
          .toNumber()
      );
    };
    if (ethers && account && reload) {
      fetch();
    }
  }, [ethers, account, reload, fastRefresh]);

  return {
    price: lp?.price.baseTokenPrice.toFixed(4),
    displayAccount,
    loading,
    userDetails,
    unstakeFee,
    unstakeFeePercent,
    totalStaked,
    totalReward,
    tokenPerBlock,
  };
};

export const useStake = () => {
  const [stakeError, setStakeError] = useState(undefined);
  const [stakePending, setStakePending] = useState(false);
  const contract = useContract(stakingAbi, STAKING_ADDRESS);
  const { approve, approveState, approvedBalance, isApproved } =
    useERC20Approval(TOKEN_ADDRESS, STAKING_ADDRESS);

  const stake = async (amount) => {
    try {
      setStakeError(undefined);
      setStakePending(true);
      await awaitTransaction(contract.deposit(0, amount));
      setStakePending(false);
    } catch (e) {
      setStakeError(e);
      console.log(e);
      setStakePending(false);
    }
  };

  return {
    stakePending,
    stake,
    approve: () => approve(),
    isApproved,
    approvedPending: approveState === STATE.BUSY,
    stakeError,
  };
};

export const useHarvest = () => {
  const [harvestError, setHarvestError] = useState(undefined);
  const [harvestPending, setHarvestPending] = useState(false);
  const contract = useContract(stakingAbi, STAKING_ADDRESS);

  const harvest = async () => {
    try {
      setHarvestError(undefined);
      setHarvestPending(true);
      await awaitTransaction(contract.deposit(0, 0));
      setHarvestPending(false);
    } catch (e) {
      setHarvestError(e);
      console.log(e);
      setHarvestPending(false);
    }
  };

  return { harvest, harvestPending, harvestError };
};

export const useCompound = () => {
  const [compoundError, setCompoundError] = useState(undefined);
  const [compoundPending, setCompoundPending] = useState(false);
  const contract = useContract(stakingAbi, STAKING_ADDRESS);

  const compound = async (amount) => {
    try {
      setCompoundError(undefined);
      setCompoundPending(true);
      await awaitTransaction(contract.deposit(0, amount.toString()));
      setCompoundPending(false);
    } catch (e) {
      setCompoundError(e);
      console.log(e);
      setCompoundPending(false);
    }
  };

  return { compound, compoundPending, compoundError };
};

export const useUnstake = () => {
  const [unstakeError, setUnstakeError] = useState(undefined);
  const [unstakePending, setUnstakePending] = useState(false);
  const contract = useContract(stakingAbi, STAKING_ADDRESS);

  const unstake = async (amount) => {
    if (contract) {
      try {
        setUnstakePending(true);
        setUnstakeError(undefined);
        await awaitTransaction(contract.withdraw(0, amount));
        setUnstakePending(false);
      } catch (e) {
        setUnstakeError(e);
        setUnstakePending(false);
      }
    }
  };

  return { unstake, unstakePending, unstakeError };
};

export const useTokenBalance = () => {
  const { balance, displayBalance } = useERC20Balance(
    TOKEN_ADDRESS,
    TOKEN_DECIMALS
  );
  return { balance, displayBalance };
};

export const getPoolApy = (
  stakingTokenPrice,
  rewardTokenPrice,
  totalStaked,
  tokenPerBlock
) => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice)
    .times(tokenPerBlock)
    .times(BLOCKS_PER_YEAR);
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(
    totalStaked
  );
  const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100);
  return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber();
};
