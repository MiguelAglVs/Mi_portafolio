// src/components/ui/use-toast.tsx
import { useState } from "react";

type ToastData = {
  title: string;
  description?: string;
};

export function useToast() {
  const [toastData, setToastData] = useState<ToastData | null>(null);

  const showToast = (title: string, description?: string) => {
    setToastData({ title, description });

    setTimeout(() => {
      setToastData(null);
    }, 5000);
  };

  return {
    toast: showToast,
    toastData,
  };
}
