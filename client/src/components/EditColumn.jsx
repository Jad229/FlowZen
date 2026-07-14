import { useState } from "react";
import Modal from "./Modal";

export default function EditColumn({ columnId, columnTitle, onEditColumn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(columnTitle);

  const open = () => {
    setTitle(columnTitle);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const handleConfirm = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    await onEditColumn(trimmed);
    close();
  };

  const titleId = `edit-column-title-${columnId}`;

  return (
    <>
      <button type="button" className="edit-column" onClick={open}>
        Edit
      </button>
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Edit column"
        confirmLabel="Save"
        onConfirm={handleConfirm}
        isConfirmDisabled={!title.trim()}
      >
        <label className="modal-label" htmlFor={titleId}>
          Title
        </label>
        <input
          id={titleId}
          className="modal-input"
          type="text"
          placeholder="e.g. In Progress"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          autoFocus
        />
      </Modal>
    </>
  );
}
