import Card from "./Card";
import { useDroppable } from "@dnd-kit/react";
export default function Column({ id, title, cards }) {
  const { ref } = useDroppable({
    id,
  });
  return (
    <div ref={ref} className="column">
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <span className="column-count">{cards.length}</span>
      </div>
      <div className="column-cards">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
