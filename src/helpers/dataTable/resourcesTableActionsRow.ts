import { Edit3, Trash2 } from "lucide-react";
import type { Resource } from "../types/Resource";
import type { DataTableRowAction } from "../types/table/DataTableRowAction";

export const ResourcesTableActions: DataTableRowAction<Resource>[] = [
  {
    icon: Trash2,
    variant: "danger",
    onClick: (resource) => {
      console.log("Supprimer la ressource :", resource.title, resource.slug);
    }
  },
  {
    icon: Edit3,
    onClick: (resource) => {
      console.log(`${resource.visible ? "Masquer" : "Afficher"} la ressource :`, resource.title, resource.slug);
    },
    variant: "ghost"
  }
]