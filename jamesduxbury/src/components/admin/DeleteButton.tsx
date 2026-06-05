'use client';

interface DeleteButtonProps {
  action: () => Promise<void>;
}

export function DeleteButton({ action }: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('Delete this item? This cannot be undone.')) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="font-mono text-xs uppercase tracking-[0.18em] text-danger/70 transition-colors hover:text-danger"
      >
        delete
      </button>
    </form>
  );
}
