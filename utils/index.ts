import BigNumber from "bignumber.js";

export const multipleTwoBigNumber = (first: any, second: any = 18) => {
  if (!first || !second) {
    return 0;
  }
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });
  return new BigNumber(first)
    .dividedBy(new BigNumber(Math.pow(10, second)))
    .toFormat();
};

export const convertBigNumber = (value: any, coinDecimal = 18) => {
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });
  return new BigNumber(value).multipliedBy(
    new BigNumber(Math.pow(10, coinDecimal))
  );
};

export const shortenAddress = (address: string, number = -4) => {
  if (address) {
    const first = address.slice(0, 6);
    const last = address.slice(number);
    return `${first}...${last}`;
  }
  return;
};
