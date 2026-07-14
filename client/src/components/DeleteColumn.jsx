import { useState } from "react";
import Modal from "./Modal";

export default function DeleteColumn({ columnTitle, onDeleteColumn }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    await onDeleteColumn();
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="delete-column"
        onClick={() => setIsOpen(true)}
      >
        Delete
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete column"
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleConfirm}
      >
        <p className="modal-message">
          Are you sure you want to delete{" "}
          <strong>{columnTitle}</strong> and all of its cards?
        </p>
      </Modal>
    </>
  );
}
