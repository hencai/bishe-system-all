export interface CategoryCount {
  name: string;
  count: number;
}

export interface DetectionStats {
  totalCategories: number;
  totalObjects: number;
  categories: CategoryCount[];
  rawDetections: Array<{
    class_name: string;
    bbox: number[];
    score: number;
  }>;
}
