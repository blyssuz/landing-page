'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from './_lib/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  /** Whether clicking the backdrop closes the modal. Default: true */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes the modal. Default: true */
  closeOnEscape?: boolean;
}

const Modal = React.forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      open,
      onClose,
      children,
      className,
      closeOnBackdrop = true,
      closeOnEscape = true,
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDialogElement>(null);
    const scrollYRef = useRef(0);

    // Resolve ref: use forwarded ref if provided, otherwise internal
    const dialogRef = (forwardedRef as React.RefObject<HTMLDialogElement | null>) || internalRef;

    const lockScroll = useCallback(() => {
      scrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
    }, []);

    const unlockScroll = useCallback(() => {
      const savedScrollY = scrollYRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, savedScrollY);
    }, []);

    // Sync open prop with dialog showModal/close
    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open && !dialog.open) {
        lockScroll();
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
        unlockScroll();
      }
    }, [open, dialogRef, lockScroll, unlockScroll]);

    // Cleanup on unmount: restore body scroll if dialog is still open
    useEffect(() => {
      return () => {
        if (document.body.style.position === 'fixed') {
          const savedScrollY = parseInt(document.body.style.top || '0', 10) * -1;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          window.scrollTo(0, savedScrollY);
        }
      };
    }, []);

    // Handle native cancel event (Escape key)
    const handleCancel = useCallback(
      (e: React.SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
        if (closeOnEscape) {
          onClose();
        }
      },
      [closeOnEscape, onClose],
    );

    // Handle backdrop click: click on <dialog> itself (not children)
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDialogElement>) => {
        if (closeOnBackdrop && e.target === dialogRef.current) {
          onClose();
        }
      },
      [closeOnBackdrop, onClose, dialogRef],
    );

    return (
      <dialog
        ref={dialogRef}
        onCancel={handleCancel}
        onClick={handleClick}
        className={cn(
          'rounded-2xl p-0 m-auto max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto bg-white shadow-warm-lg backdrop:bg-black/50 backdrop:backdrop-blur-[2px]',
          className,
        )}
      >
        {children}
      </dialog>
    );
  },
);

Modal.displayName = 'Modal';

export { Modal };
