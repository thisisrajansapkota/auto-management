declare module 'toastify-js' {
  interface ToastifyOptions {
    text: string;
    duration?: number;
    close?: boolean;
    gravity?: 'top' | 'bottom';
    position?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    className?: string;
    stopOnFocus?: boolean;
    onClick?: () => void;
  }

  export default function Toastify(options: ToastifyOptions): {
    showToast: () => void;
  };
}
