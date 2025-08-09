
export interface Point {
  x: number;
  y: number;
}

export interface HistoryItem {
  id: string;
  type: string;
  name: string;
  pointIds?: string[];
  color?: string;
  data?: {
    coords?: Point;
    polynomial?: string;
  };
}
