/**
 * Modal - a generic reusable overlay used for the "Why is this made?" and
 * "Who made this?" info panels in App.jsx.
 *
 * Renders a semi-transparent backdrop with a centered content box.
 */

function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] w-[90%] max-w-[680px] overflow-y-auto rounded-lg bg-background p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0">{title}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer border-none bg-transparent text-xl text-muted-foreground"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
