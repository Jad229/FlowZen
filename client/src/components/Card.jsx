import { useSortable } from "@dnd-kit/react/sortable";
import DeleteCard from "./DeleteCard";
import EditCard from "./EditCard";

export default function Card({ card, columnId, index, onDeleteCard, onEditCard }) {
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
      <div className="card-actions">
        <EditCard card={card} onEditCard={onEditCard} />
        <DeleteCard cardTitle={card.title} onDeleteCard={onDeleteCard} />
      </div>
    </div>
  );
}
