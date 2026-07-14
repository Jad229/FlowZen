import { useDraggable } from "@dnd-kit/react";
import DeleteCard from "./DeleteCard";

export default function Card({ card, onDeleteCard }) {
  const { ref } = useDraggable({
    id: card.id,
  });

  return (
    <div className="card" ref={ref}>
      <p className="card-title">{card.title}</p>
      <DeleteCard cardTitle={card.title} onDeleteCard={onDeleteCard} />
    </div>
  );
}
