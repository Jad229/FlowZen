import { useEffect, useRef } from 'react';

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isConfirmDisabled = false,
  confirmVariant = 'primary',
  footer,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onConfirm && !isConfirmDisabled) {
      onConfirm();
    }
  };

  const showFooter = footer != null || onConfirm != null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="modal"
    >
      <form className="modal-content" onSubmit={handleSubmit}>
        <header className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="modal-body">{children}</div>

        {showFooter && (
          <footer className="modal-footer">
            {footer ?? (
              <>
                <button
                  type="button"
                  className="modal-btn modal-btn--secondary"
                  onClick={onClose}
                >
                  {cancelLabel}
                </button>
                <button
                  type="submit"
                  className={`modal-btn modal-btn--${confirmVariant}`}
                  disabled={isConfirmDisabled}
                >
                  {confirmLabel}
                </button>
              </>
            )}
          </footer>
        )}
      </form>
    </dialog>
  );
}
