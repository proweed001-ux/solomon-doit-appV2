/// <reference types="vite/client" />

import 'pdfjs-dist';

declare module '*?url' {
  const url: string;
  export default url;
}

declare module 'pdfjs-dist' {
  interface PDFDocumentProxy {
    destroy(): Promise<void>;
  }
}
