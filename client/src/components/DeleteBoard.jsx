import { useState } from "react";
import Modal from "./Modal";

export default function DeleteBoard({ boardName, onDeleteBoard }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    await onDeleteBoard();
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="delete-board"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
        aria-label="Delete board"
      >
        ✕
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete board"
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleConfirm}
      >
        <p className="modal-message">
          Are you sure you want to delete{" "}
          <strong>{boardName}</strong>? This cannot be undone.
        </p>
      </Modal>
    </>
  );
}
