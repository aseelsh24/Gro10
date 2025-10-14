declare module 'react-hot-toast' {
  type Toast = {
    id: string;
    visible: boolean;
    type: 'success' | 'error' | 'loading' | 'blank';
    message: string;
  };

  interface ToastOptions {
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  };

  interface ToastHandler {
    (message: string, options?: ToastOptions): string;
    success(message: string, options?: ToastOptions): string;
    error(message: string, options?: ToastOptions): string;
    loading(message: string, options?: ToastOptions): string;
    dismiss(toastId?: string): void;
    remove(toastId?: string): void;
  }

  const toast: ToastHandler;
  export default toast;
}