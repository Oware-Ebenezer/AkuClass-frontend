import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

interface ModalProps { open: boolean; title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; }

export const Modal = ({ open, title, onClose, children, footer }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-full max-w-lg rounded-xl bg-white p-0 shadow-xl backdrop:bg-charcoal/40">
      <div className="flex items-center justify-between border-b border-warm-200 px-6 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="icon" aria-label="Close" className="shadow-none" onClick={onClose}><Icon name="close" /></Button>
      </div>
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="flex justify-end gap-2 border-t border-warm-200 px-6 py-4">{footer}</div>}
    </dialog>
  );
}
