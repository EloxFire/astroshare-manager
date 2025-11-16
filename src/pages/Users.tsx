import { Edit, Trash2, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DataTable, type DataTableColumn, type DataTableRowAction } from '../components/table/DataTable'
import { DashboardCard } from '../components/cards/DashboardCard'
import type { User } from '../helpers/types/User'
import dayjs from 'dayjs'
import '../styles/pages/users.scss'

const userColumns: DataTableColumn<User>[] = [
  {
    header: 'ID',
    key: 'uid',
    accessor: (user) => <span className='mono'>{user.uid.slice(0, 8)}…</span>
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
        ? <span className='subscription-chip'>{user.subscriptionType}</span>
        : <span className='muted'>—</span>
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
        return <span className='muted'>Date invalide</span>
      }
    }
  }
]

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const userRowActions: DataTableRowAction<User>[] = useMemo(() => [
    {
      label: 'Modifier',
      icon: Edit,
      variant: 'ghost',
      onClick: (user) => console.log(`[UsersPage] Modifier ${user.uid}`)
    },
    {
      label: 'Supprimer',
      icon: Trash2,
      variant: 'danger',
      onClick: (user) => console.log(`[UsersPage] Supprimer ${user.uid}`)
    }
  ], [])

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/users`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      const data: User[] = await response.json()
      setUsers(data)
      setIsLoading(false)
    }

    fetchUsers()
  }, [])

  return (
    <main className="main-pane users-page">
      <div>
        <h1>Gestion des utilisateurs</h1>
        <p>Bienvenue dans l'interface de gestion des utilisateurs d'Astroshare</p>
      </div>
      <div className='cards-container'>
        <DashboardCard icon={Users} title="Total" value={users.length} small />
        <DashboardCard icon={Users} title="Abonnés" value={users.filter(user => user.subscriptionType).length} small />
      </div>
      <div className='table-container'>
        <DataTable
          data={users}
          columns={userColumns}
          getRowId={(user) => user.uid}
          isLoading={isLoading}
          loadingLabel="Chargement des utilisateurs…"
          emptyLabel="Aucun utilisateur enregistré pour le moment."
          // rowActions={userRowActions}
        />
      </div>
    </main>
  )
}
