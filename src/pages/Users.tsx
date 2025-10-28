import { Edit, Trash2, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DataTable, type DataTableColumn, type DataTableRowAction } from '../components/table/DataTable'
import '../styles/pages/users.scss'
import { DashboardCard } from '../components/cards/DashboardCard'

type User = {
  id: string
  email: string
  role: string
  subscriptionType?: string
  createdAt: string
}

const mockUsers: User[] = [
  {
    id: 'USR-001',
    email: 'emma.dupont@astroshare.fr',
    role: 'Administratrice',
    subscriptionType: 'Premium',
    createdAt: '2023-11-18T09:32:00Z'
  },
  {
    id: 'USR-002',
    email: 'lucas.martin@astroshare.fr',
    role: 'Editeur',
    subscriptionType: 'Standard',
    createdAt: '2024-01-04T14:12:00Z'
  },
  {
    id: 'USR-003',
    email: 'nina.berger@astroshare.fr',
    role: 'Contributeur',
    createdAt: '2024-02-22T08:45:00Z'
  },
  {
    id: 'USR-004',
    email: 'maxime.bernard@astroshare.fr',
    role: 'Visiteur',
    subscriptionType: 'Découverte',
    createdAt: '2023-12-29T17:05:00Z'
  },
  {
    id: 'USR-005',
    email: 'lea.durand@astroshare.fr',
    role: 'Contributeur',
    subscriptionType: 'Premium',
    createdAt: '2024-03-18T10:28:00Z'
  }
]

export const fetchUsersMock = async (delay = 250): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUsers), delay)
  })
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date))
}

const userColumns: DataTableColumn<User>[] = [
  {
    header: 'ID',
    key: 'id',
    accessor: (user) => <span className='mono'>{user.id}</span>
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
    accessor: (user) => formatDate(user.createdAt)
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
      onClick: (user) => console.log(`[UsersPage] Modifier ${user.id}`)
    },
    {
      label: 'Supprimer',
      icon: Trash2,
      variant: 'danger',
      onClick: (user) => console.log(`[UsersPage] Supprimer ${user.id}`)
    }
  ], [])

  useEffect(() => {
    let isMounted = true

    fetchUsersMock().then((data) => {
      if (!isMounted) return

      setUsers(data)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
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
          getRowId={(user) => user.id}
          isLoading={isLoading}
          loadingLabel="Chargement des utilisateurs…"
          emptyLabel="Aucun utilisateur enregistré pour le moment."
          rowActions={userRowActions}
        />
      </div>
    </main>
  )
}
