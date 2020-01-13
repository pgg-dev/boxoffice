import React from "react";
import "../styles/Modal.scss";

function Modal({ isOpen, children, onClick }) {
  return (
    <div className="modal-wrapper" style={{ display: isOpen }}>
      <div className="modal">
        <p>{children}</p>
        <div class="btn-wrapper">
          <button onClick={e => onClick(false)}>취소</button>
          <button onClick={e => onClick(true)}>확인</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
