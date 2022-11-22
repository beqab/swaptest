import get from "lodash/get";

const connector = {
  randomRPC: (listRPC: any) => {
    const lengthList = listRPC?.length;
    const randomNumber = Math.floor(Math.random() * 10) % lengthList;
    return get(listRPC, randomNumber);
  },
};

export default connector;
