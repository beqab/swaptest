import React from "react";
import classnames from "classnames";
import { ModalProps } from "../../utils/type";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSetLoadingMetamask,
  handleShowConnectModal,
} from "../../redux/actions/modalAction";

const ModalWrapper = ({
  setOpen,
  childrenProp,
  position = "center",
  type = "",
  visible = false,
  isShowButtonClose = true,
}: ModalProps) => {
  const dispatch = useDispatch();
  const isConnectingWallet = useSelector(
    (state: any) => state.modalReducer.isConnectingWallet
  );

  const handleClose = () => {
    // setOpen(false);
    dispatch(handleShowConnectModal(false));
    dispatch(handleSetLoadingMetamask(false));
  };

  return (
    <>
      {visible && <div className="modalTranparent"></div>}
      <div
        onClick={(e) => e.stopPropagation()}
        className={classnames("modalWrapper", {
          "d-none": !visible,
          [type]: type,
          [position]: position,
        })}
      >
        <div className="modalContainer">
          {isShowButtonClose && (
            <span onClick={handleClose} className="closeBtn">
              <img src="/icons/icon_close.svg" alt="" />
            </span>
          )}

          {childrenProp}
        </div>
      </div>
    </>
  );
};

export default ModalWrapper;
