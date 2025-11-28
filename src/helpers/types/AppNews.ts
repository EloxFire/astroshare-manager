export type AppNews = {
  _id: string;
  title: string;
  description: string;
  icon: string;
  colors: string;
  type: string
  startDate: Date | null;
  endDate: Date | null;
  externalLink: string;
  internalRoute: string;
  visible: boolean;
  order: number;
  createdAt: string;
}