import { useDraggable } from "@dnd-kit/react";

export default function Card({ card }) {
  const { ref } = useDraggable({
    id: card.id,
  });

  return (
    <div className="card" ref={ref}>
      <p className="card-title">{card.title}</p>
    </div>
  );
}
