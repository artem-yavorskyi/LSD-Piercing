import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const Modal = ({
  isThankYouOpened,
  isModalOpened,
  onClose,
  title,
  children,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isModalOpened) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isModalOpened, onClose]);

  if (!isModalOpened) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-container"
        style={{ maxHeight: isThankYouOpened ? "0" : "90%" }}
        ref={modalRef}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
