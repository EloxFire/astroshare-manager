import { Eye, Trash2 } from "lucide-react";
import type { DataTableRowAction } from "../types/table/DataTableRowAction";
import type { ToastOptions } from "../../components/toast/ToastProvider";
import type { AppNews } from "../types/AppNews";

type CreateAppNewsTableActionsParams = {
  fetchNews: () => Promise<void>
  showToast: (message: string, options?: ToastOptions) => void
}

export const createAppNewsTableActions = ({
  fetchNews,
  showToast
}: CreateAppNewsTableActionsParams): DataTableRowAction<AppNews>[] => ([
  {
    icon: Eye,
    variant: "default",
    onClick: async (news) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/news/visibility/${news._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ visible: !news.visible })
        })

        if (!response.ok) {
          throw new Error('Erreur réseau')
        }

        showToast(`Bannière ${news.title} éditée avec succès.`, { type: "neutral" })
        await fetchNews()
      } catch (error) {
        console.error("Erreur lors de l'édition de la bannière :", error)
        showToast(`Édition de la bannière ${news.title} échouée.`, { type: "error" })
      }
    }
  },
  {
    icon: Trash2,
    variant: "danger",
    confirm: {
      message: "Supprimer cette bannière ?"
    },
    onClick: async (news) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/news/${news._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })

        if (!response.ok) {
          throw new Error('Erreur réseau')
        }

        showToast("Bannière supprimée.", { type: "neutral" })
        await fetchNews()
      } catch (error) {
        console.error("Erreur lors de la suppression de la bannière :", error)
        showToast("Suppression impossible.", { type: "error" })
      }
    }
  }
])
