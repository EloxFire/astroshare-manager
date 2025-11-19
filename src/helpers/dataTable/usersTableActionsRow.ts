import { Trash2 } from "lucide-react";
import type { DataTableRowAction } from "../types/table/DataTableRowAction";
import type { ToastOptions } from "../../components/toast/ToastProvider";
import type { User } from "../types/User";

type CreateUsersTableActionsParams = {
  fetchUsers: () => Promise<void>
  showToast: (message: string, options?: ToastOptions) => void
}

export const createUsersTableActions = ({
  fetchUsers,
  showToast
}: CreateUsersTableActionsParams): DataTableRowAction<User>[] => ([
  {
    icon: Trash2,
    variant: "danger",
    confirm: {
      message: "Supprimer cet utilisateur ?"
    },
    onClick: async (user) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/users/${user.uid}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        })

        if (!response.ok) {
          throw new Error('Erreur réseau')
        }

        showToast("Utilisateur supprimé.", { type: "neutral" })
        await fetchUsers()
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error)
        showToast("Suppression impossible.", { type: "error" })
      }
    }
  }
])