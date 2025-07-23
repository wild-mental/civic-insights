export type ArticleCategory = 'Civic Engagement' | 'Megatrends' | 'Basic Income';

export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: ArticleCategory;
  type: 'free' | 'paid';
  publishDate: string;
  image: string;
  author: string;
};
