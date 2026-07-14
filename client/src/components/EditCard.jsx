import { useState } from "react";
import Modal from "./Modal";

export default function EditCard({ card, onEditCard }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");

  const open = (event) => {
    event.stopPropagation();
    setTitle(card.title);
    setDescription(card.description ?? "");
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const handleConfirm = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || !trimmedDescription) return;

    await onEditCard({
      title: trimmedTitle,
      description: trimmedDescription,
    });
    close();
  };

  const titleId = `edit-card-title-${card.id}`;
  const descriptionId = `edit-card-description-${card.id}`;

  return (
    <>
      <button
        type="button"
        className="edit-card"
        onClick={open}
        aria-label="Edit card"
      >
        ✎
      </button>
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Edit card"
        confirmLabel="Save"
        onConfirm={handleConfirm}
        isConfirmDisabled={!title.trim() || !description.trim()}
      >
        <label className="modal-label" htmlFor={titleId}>
          Title
        </label>
        <input
          id={titleId}
          name={titleId}
          className="modal-input"
          type="text"
          placeholder="e.g. Add a new card"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          autoFocus
        />
        <label className="modal-label" htmlFor={descriptionId}>
          Description
        </label>
        <textarea
          id={descriptionId}
          name={descriptionId}
          className="modal-textarea"
          placeholder="e.g. Add a new card"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </Modal>
    </>
  );
}
