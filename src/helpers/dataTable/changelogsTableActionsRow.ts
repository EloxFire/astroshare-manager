import { Eye, Trash2 } from "lucide-react";
import type { DataTableRowAction } from "../types/table/DataTableRowAction";
import type { ToastOptions } from "../../components/toast/ToastProvider";
import type { Changelog } from "../types/Changelog";

type CreateChangelogsTableActionsParams = {
  fetchChangelogs: () => Promise<void>
  showToast: (message: string, options?: ToastOptions) => void
}

export const createChangelogsTableActions = ({
  fetchChangelogs,
  showToast
}: CreateChangelogsTableActionsParams): DataTableRowAction<Changelog>[] => ([
  {
    icon: Eye,
    variant: "default",
    onClick: async (changelog) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/changelog/app/visibility/${changelog._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ visible: !changelog.visible })
        })

        if (!response.ok) {
          throw new Error('Erreur réseau')
        }

        showToast(`Changelog ${changelog.version} édité avec succès.`, { type: "neutral" })
        await fetchChangelogs()
      } catch (error) {
        console.error("Erreur lors de l'édition du changelog :", error)
        showToast(`Édition du changelog ${changelog.version} échouée.`, { type: "error" })
      }
    },
  },
  {
    icon: Trash2,
    variant: "danger",
    confirm: {
      message: "Supprimer ce changelog ?"
    },
    onClick: async (changelog) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/changelog/app/${changelog._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })

        if (!response.ok) {
          throw new Error('Erreur réseau')
        }

        showToast("Changelog supprimé.", { type: "neutral" })
        await fetchChangelogs()
      } catch (error) {
        console.error("Erreur lors de la suppression du changelog :", error)
        showToast("Suppression impossible.", { type: "error" })
      }
    }
  }
])
