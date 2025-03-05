
import { useState, useEffect, useCallback } from "react";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToastContextType = {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, "id">) => void;
  dismiss: (id: string) => void;
};

const TOAST_TIMEOUT = 5000;

export const useToast = (): ToastContextType => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (props: Omit<ToastProps, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastProps = { id, ...props };
      setToasts((toasts) => [...toasts, newToast]);

      setTimeout(() => {
        dismiss(id);
      }, TOAST_TIMEOUT);

      return id;
    },
    [dismiss]
  );

  return { toasts, toast, dismiss };
};

export const toast = (props: Omit<ToastProps, "id">) => {
  const { toast } = useToast();
  return toast(props);
};
