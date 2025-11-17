export type Resource = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  downloadLink: string;
  content: string;
  fileType: string;
  level: number;
  visible: boolean;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  illustrationUrl?: string;
  subcategory?: string;
}