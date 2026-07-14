import { useSortable } from "@dnd-kit/react/sortable";
import DeleteCard from "./DeleteCard";

export default function Card({ card, columnId, index, onDeleteCard }) {
  const { ref, isDragging } = useSortable({
    id: card.id,
    index,
    group: String(columnId),
    type: "card",
    accept: "card",
  });

  return (
    <div
      className={`card${isDragging ? " card--dragging" : ""}`}
      ref={ref}
    >
      <p className="card-title">{card.title}</p>
      <DeleteCard cardTitle={card.title} onDeleteCard={onDeleteCard} />
    </div>
  );
}
