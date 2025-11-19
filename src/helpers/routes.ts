import type { LucideIcon } from "lucide-react";
import { Crosshair, Database, FileText, House, Newspaper, PenBoxIcon, Users } from "lucide-react";

type RouteConfig = {
  path: string;
  label: string;
  color: string;
  Icon: LucideIcon;
  parent?: string;
};

export const routes: Record<string, RouteConfig> = {
  home: {
    path: "/",
    label: "Tableau de bord",
    color: "#155dfc",
    Icon: House,
  },
  contents: {
    path: "/contents",
    label: "Contenus",
    color: "#00c950",
    Icon: FileText,
  },
  users: {
    path: "/users",
    label: "Utilisateurs",
    color: "#9810fa",
    Icon: Users,
  },
  changelogs: {
    path: "/changelogs",
    label: "Changelogs",
    color: "#ff6900",
    Icon: Database,
    parent: "contents"
  },
  newsBanners: {
    path: "/news-banners",
    label: "Bannières d'actualités",
    color: "#ff6900",
    Icon: Newspaper,
    parent: "contents"
  },
  resources: {
    path: "/resources",
    label: "Ressources",
    color: "#ff6900",
    Icon: PenBoxIcon,
    parent: "contents"
  },
  categories: {
    path: "/categories",
    label: "Catégories",
    color: "#ff6900",
    Icon: Crosshair,
    parent: "contents"
  }
};
