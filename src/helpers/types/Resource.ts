export type Resource = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
  fileType: string;
  level: number;
  visible: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  pdfUrl?: string;
  memoUrl?: string;
  illustrationUrl?: string;
  subcategory?: string;
}