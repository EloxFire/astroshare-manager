import { Edit3, Trash2 } from "lucide-react";
import type { Resource } from "../types/Resource";
import type { DataTableRowAction } from "../types/table/DataTableRowAction";
import type { ToastOptions } from "../../components/toast/ToastProvider";

type CreateResourcesTableActionsParams = {
  fetchResources: () => Promise<void>
  showToast: (message: string, options?: ToastOptions) => void
}

export const createResourcesTableActions = ({
  fetchResources,
  showToast
}: CreateResourcesTableActionsParams): DataTableRowAction<Resource>[] => ([
  {
    icon: Trash2,
    variant: "danger",
    confirm: {
      message: "Supprimer cette ressource ?"
    },
    onClick: async (resource) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/resources/${resource._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })

        if (!response.ok) {
          throw new Error('Erreur réseau')
        }

        showToast("Ressource supprimée.", { type: "neutral" })
        await fetchResources()
      } catch (error) {
        console.error("Erreur lors de la suppression de la ressource :", error)
        showToast("Suppression impossible.", { type: "error" })
      }
    }
  },
  {
    icon: Edit3,
    onClick: (resource) => {
      console.log(`${resource.visible ? "Masquer" : "Afficher"} la ressource :`, resource.title, resource.slug);
    },
    variant: "ghost"
  }
])
