import { Eye, Trash2 } from "lucide-react";
import type { DataTableRowAction } from "../types/table/DataTableRowAction";
import type { ToastOptions } from "../../components/toast/ToastProvider";
import type { Category } from "../types/Category";

type CreateCategoriesTableActionsParams = {
  fetchCategories: () => Promise<void>
  showToast: (message: string, options?: ToastOptions) => void
}

export const createCategoriesTableActions = ({
  fetchCategories,
  showToast
}: CreateCategoriesTableActionsParams): DataTableRowAction<Category>[] => ([
  {
    icon: Eye,
    variant: "ghost",
    onClick: async (category) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/visibility/${category._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ visible: !category.visible })
        })

        if (!response.ok) {
          throw new Error('Erreur réseau')
        }

        showToast(`Catégorie ${category.title} éditée avec succès.`, { type: "neutral" })
        await fetchCategories()
      } catch (error) {
        console.error("Erreur lors de l'édition de la bannière :", error)
        showToast(`Édition de la bannière ${category.title} échouée.`, { type: "error" })
      }
    }
  },
  {
    icon: Trash2,
    variant: "danger",
    confirm: {
      message: "Supprimer cette catégorie ?"
    },
    onClick: async (category) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${category._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })

        if (!response.ok) {
          throw new Error('Erreur réseau')
        }

        showToast("Catégorie supprimée.", { type: "neutral" })
        await fetchCategories()
      } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie :", error)
        showToast("Suppression impossible.", { type: "error" })
      }
    }
  }
])
