import dayjs from "dayjs"
import type { DataTableColumn } from "../types/table/DataTableColumn"
import type { User } from "../types/User"

export const usersColumns: DataTableColumn<User>[] = [
  {
    header: 'ID',
    key: 'uid',
    accessor: (user) => `${user.uid.slice(0, 8)}…`,
    copy: true
  },
  {
    header: 'Email',
    key: 'email'
  },
  {
    header: 'Rôle',
    key: 'role'
  },
  {
    header: "Type d'abonnement",
    key: 'subscriptionType',
    accessor: (user) => (
      user.subscriptionType
        ? `${user.subscriptionType}`
        : '—'
    )
  },
  {
    header: 'Date de création',
    key: 'createdAt',
    accessor: (user) => {
      // Convert FirebaseTimestamp to JavaScript Date
      if (user.createdAt && typeof user.createdAt.seconds === 'number') {
        const date = new Date(user.createdAt.seconds * 1000 + Math.floor(user.createdAt.nanoseconds / 1e6))
        return dayjs(date).format('DD/MM/YYYY HH:mm')
      } else {
        console.warn(`[UsersPage] Invalid createdAt timestamp for user ${user.uid}`)
        return 'Date invalide'
      }
    }
  }
]