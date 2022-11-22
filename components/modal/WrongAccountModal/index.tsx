import { Button, Modal, Typography } from 'antd';
import { setupNetwork } from 'connectors';
// import { setupNetwork } from 'utils/connector';
// import { setupNetwork } from 'utils/wallet';

const { Title, Text } = Typography;

interface WrongNetworkModalProps {
  visibleModal: boolean;
  closeVisibleModal?: () => void;
}

const WrongAccountModal: React.FC<WrongNetworkModalProps> = ({ visibleModal }) => {

  return (
    <Modal
      visible={visibleModal}
      width={600}
      wrapClassName="wrong_account_modal"
      maskClosable={false}
      footer={null}
    >
      <div className="wrap">
        <Title className="title">Wrong Account Link</Title>
        <Text className="desc"></Text>
      </div>
    </Modal>
  );
};

export default WrongAccountModal;
