import React from "react";
import "./Modal.css";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, title, children, actions }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h3>{title}</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </header>
                <div className="modal-body">
                    {children}
                </div>
                {actions && (
                    <footer className="modal-footer">
                        {actions}
                    </footer>
                )}
            </div>
        </div>
    );
};

export default Modal;
