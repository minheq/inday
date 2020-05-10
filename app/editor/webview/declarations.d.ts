import Delta from 'quill-delta';

declare global {
  interface Window {
    initialContent: Delta;
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}

declare module 'quill' {
  interface Quill {
    history: {
      undo: () => void;
      redo: () => void;
      cutoff: () => void;
    };
  }
}
