
export interface BlogAuthor {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  title?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readingTime: number;
  featuredImage: string;
  author: BlogAuthor;
  category: BlogCategory;
  tags: string[];
}
