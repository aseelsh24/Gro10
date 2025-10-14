declare module 'chart.js' {
  import { ChartType, ChartData, ChartOptions } from 'chart.js';
  
  export const Chart: any;
  
  export interface ChartConfiguration {
    type: ChartType;
    data: ChartData;
    options?: ChartOptions;
  }

  export class CategoryScale {
    static id: string;
  }

  export class LinearScale {
    static id: string;
  }

  export class BarController {
    static id: string;
  }

  export class BarElement {
    static id: string;
  }

  export class ArcElement {
    static id: string;
  }

  export class LineElement {
    static id: string;
  }

  export class PointElement {
    static id: string;
  }

  export class LineController {
    static id: string;
  }

  export class PieController {
    static id: string;
  }

  export class Legend {
    static id: string;
  }

  export class Title {
    static id: string;
  }

  export class Tooltip {
    static id: string;
  }

  export function register(...items: any[]): void;
}