declare module 'react/jsx-runtime';

declare module 'framer-motion' {
  export const motion: any;
}

declare module 'react-chartjs-2' {
  export const Line: any;
  export const Bar: any;
}

declare module 'jspdf' {
  export class jsPDF {
    constructor();
    text(text: string, x: number, y: number, options?: any): jsPDF;
    setFont(fontName: string, fontStyle: string): jsPDF;
    setFontSize(size: number): jsPDF;
    autoPrint(): void;
    save(filename: string): void;
    output(type: string): string;
  }
}