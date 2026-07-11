import { useDraggable } from '@dnd-kit/react';

export default function Card({ title }) {

  const { ref } = useDraggable({
    id: 'draggable-card',
  });

  return (
    <div className="card" ref={ref}>
      <p className="card-title">{title}</p>
    </div>
  );
}



