import { Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../components/table/DataTable'
import { DashboardCard } from '../components/cards/DashboardCard'
import type { User } from '../helpers/types/User'
import '../styles/pages/users.scss'
import { usersColumns } from '../helpers/dataTable/usersColumns'
import { createUsersTableActions } from '../helpers/dataTable/usersTableActionsRow'

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
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
          columns={usersColumns}
          rowActions={createUsersTableActions({ fetchUsers, showToast: (message, options) => {} })}
          getRowId={(user) => user.uid}
          isLoading={isLoading}
          loadingLabel="Chargement des utilisateurs…"
          emptyLabel="Aucun utilisateur enregistré pour le moment."
        />
      </div>
    </main>
  )
}
