export default function AddBoard({ onAddBoard }) {
  return (
    <button type="button" className="add-board" onClick={onAddBoard}>
      +
    </button>
  );
}
