import { useEffect, useMemo, useState } from "react"
import { FileText } from "lucide-react"
import { DashboardCard } from "../../components/cards/DashboardCard"
import { DataTable, type DataTableColumn } from "../../components/table/DataTable"
import type { Changelog } from "../../helpers/types/Changelog"
import AddChangelog from "../../components/forms/AddChangelog"
import '../../styles/pages/contents/changelogs.scss'

export const Changelogs = () => {
  const [logs, setLogs] = useState<Changelog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const dateFormatter = useMemo(() => new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }), [])

  const columns = useMemo<DataTableColumn<Changelog>[]>(() => [
    {
      header: 'Version',
      key: 'version'
    },
    {
      header: 'Nom de version',
      accessor: (log) => log.version_name.slice(0, 20) + (log.version_name.length > 20 ? '...' : '') || '—'
    },
    {
      header: 'Date',
      accessor: (log) => log.date ? dateFormatter.format(new Date(log.date)) : undefined
    },
    {
      header: 'Breaking change',
      accessor: (log) => log.breaking ? 'Oui' : 'Non',
      align: 'center'
    },
    {
      header: 'Visibilité',
      accessor: (log) => log.visible ? 'Publique' : 'Masquée',
      align: 'center'
    },
    {
      header: 'Entrées',
      accessor: (log) => log.changes?.length ?? 0,
      align: 'right'
    }
  ], [dateFormatter])

  useEffect(() => {
    const fetchChangelogs = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/changelog/app`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error('Failed to fetch changelogs')
        const data = await response.json()
        setLogs(data.data)
      } catch (error) {
        console.error('Error fetching changelogs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChangelogs()
  }, [])

  return (
    <div className="main-pane changelogs-page">
      <div className="list-pane">
        <h1>Changelogs</h1>
        <div className='cards-container'>
          <DashboardCard icon={FileText} title="Total" value={logs.length} small />
        </div>
        <div className='table-container'>
          <DataTable
            data={logs}
            columns={columns}
            getRowId={(log, index) => `${log.version}-${index}`}
            isLoading={isLoading}
            loadingLabel="Chargement des changelogs…"
            emptyLabel="Aucun changelog disponible pour le moment."
          />
        </div>
      </div>
      <div className="form-pane">
        <h1>Ajouter un changelog</h1>
        <AddChangelog />
      </div>
    </div>
  )
}
