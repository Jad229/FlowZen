import { useState } from "react";
import Modal from "./Modal";

export default function DeleteCard({ cardTitle, onDeleteCard }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    await onDeleteCard();
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="delete-card"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
        aria-label="Delete card"
      >
        ✕
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete card"
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleConfirm}
      >
        <p className="modal-message">
          Are you sure you want to delete{" "}
          <strong>{cardTitle}</strong>? This cannot be undone.
        </p>
      </Modal>
    </>
  );
}
