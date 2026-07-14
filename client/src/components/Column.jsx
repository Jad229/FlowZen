import Card from "./Card";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import AddCard from "./AddCard";
import DeleteColumn from "./DeleteColumn";
import Modal from "./Modal";
import { useState } from "react";

export default function Column({ id, title, cards, sendCommand }) {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const { ref } = useDroppable({
    id: String(id),
    type: "column",
    accept: "card",
    collisionPriority: CollisionPriority.Low,
  });

  async function handleAddCard() {
    const title = cardTitle.trim();
    const description = cardDescription.trim();
    if (!title || !description) return;

    await sendCommand("ADD_CARD", {
      columnId: id,
      title,
      description,
      position: cards.length,
    });

    setIsAddCardOpen(false);
    setCardTitle("");
    setCardDescription("");
  }

  async function handleDeleteCard(cardId) {
    await sendCommand("DELETE_CARD", { cardId });
  }

  async function handleDeleteColumn() {
    await sendCommand("DELETE_COLUMN", { columnId: id });
  }

  return (
    <div ref={ref} className="column">
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <span className="column-count">{cards.length}</span>
      </div>
      <div className="column-cards">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            columnId={id}
            index={index}
            onDeleteCard={() => handleDeleteCard(card.id)}
          />
        ))}
        <AddCard onAddCard={() => setIsAddCardOpen(true)} />
      </div>
      <DeleteColumn
        columnTitle={title}
        onDeleteColumn={handleDeleteColumn}
      />
      <Modal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        title="Add card"
        confirmLabel="Add card"
        onConfirm={handleAddCard}
        isConfirmDisabled={false}
      >
        <label className="modal-label" htmlFor="card-title">
          Title
        </label>
        <input
          id="card-title"
          name="card-title"
          className="modal-input"
          type="text"
          placeholder="e.g. Add a new card"
          value={cardTitle}
          onChange={(event) => setCardTitle(event.target.value)}
          autoFocus
        />
        <label className="modal-label" htmlFor="card-description">
          Description
        </label>
        <textarea
          id="card-description"
          name="card-description"
          className="modal-textarea"
          placeholder="e.g. Add a new card"
          value={cardDescription}
          onChange={(event) => setCardDescription(event.target.value)}
        />
      </Modal>
    </div>
  );
}
