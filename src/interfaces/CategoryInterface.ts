export interface CategoryInterface {
  id: number;
  name: string;
  slug: string;
  description: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    posts?: number;
  };
}
