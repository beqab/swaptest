import { Button, Modal, Typography } from "antd";
import { setupNetwork } from "connectors";
import { useDispatch } from "react-redux";
import { handleSetModalWrongNetwork } from "../../../redux/actions/modalAction";
const { Title, Text } = Typography;

const WrongNetworkModal = () => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(handleSetModalWrongNetwork(false));
  };
  return (
    <div className="wrap modalWrongNetwork ">
      <Title className="title">Wrong Netwok</Title>
      <div className="iconLoading">
        <img src="/icons/icon-loading.svg" alt="" />
      </div>
      <Text className="desc">
        Please change network on your wallet to{" "}
        <span>Binance Smart Chain - Mainnet</span> to continue
      </Text>
      <Button
        className="btnSwitchNetwork"
        onClick={async () => {
          await setupNetwork();
        }}
      >
        <img src="/icons/icon-switch.svg" alt="" />
        Switch Network
      </Button>
    </div>
  );
};

export default WrongNetworkModal;
