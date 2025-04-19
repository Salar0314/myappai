declare module 'react-hot-toast' {
  interface Toast {
    (message: string, options?: any): string;
    success(message: string, options?: any): string;
    error(message: string, options?: any): string;
    loading(message: string, options?: any): string;
    dismiss(toastId?: string): void;
    promise<T>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      },
      options?: any
    ): Promise<T>;
  }

  export const toast: Toast;
  export const Toaster: React.FC<any>;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
} 