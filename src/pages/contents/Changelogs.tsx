import { useEffect, useMemo, useState } from "react"
import { FileText } from "lucide-react"
import { DashboardCard } from "../../components/cards/DashboardCard"
import { DataTable, type DataTableColumn } from "../../components/table/DataTable"
import AddChangelog from "../../components/forms/AddChangelog"

import '../../styles/pages/contents/changelogs.scss'
import type { Changelog } from "../../helpers/types/Changelog"

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
    let isMounted = true;

    (async () => {
      try {
        const data = await fetch('https://dev-api.astroshare.fr/changelog/app')
        const json = await data.json()

        if (!isMounted) return
        setLogs(json.data)
      } catch (error) {
        console.error('[ChangelogsPage] Impossible de récupérer les changelogs', error)
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    })()

    return () => {
      isMounted = false
    }
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
