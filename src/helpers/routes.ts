import type { LucideIcon } from "lucide-react";
import { Database, FileText, House, Users } from "lucide-react";

type RouteConfig = {
  path: string;
  label: string;
  color: string;
  Icon: LucideIcon;
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
  },
};
