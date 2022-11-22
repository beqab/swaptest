import React from "react";

import Modal from "./modalWrapper";

const ConfirmModal = ({ open, setOpen, text, confirmBtnText, onConfirm }) => {
  return (
    // <Modal  position="center">
    <div>
      <div className="mt-4">{text}</div>
      <div className="d-flex justify-content-between w-100 mt-3">
        <button
          onClick={onConfirm}
          className="btn aogBtn btn-primary  mt-3 mb-3 px-4"
        >
          {confirmBtnText}
        </button>
        <button
          className="btn aogBtn aogBtn-light btn-primary  mt-3 mb-3 px-4"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
    // </Modal>
  );
};

export default ConfirmModal;
