import { CategoryInterface } from './CategoryInterface';
import { UserInterface } from './UserInterface';

export interface PostInterface {
  id: number;
  authorId: number;
  categoryId: number;
  title: string;
  slug: string;
  full_slug: string;
  description: string;
  content: string;
  keywords: string;
  views: number;
  likes: number;
  readingTime: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  category: CategoryInterface;
  author: UserInterface;
}
