import { useEffect, useState } from "react"
import { FileText } from "lucide-react"
import { DashboardCard } from "../../components/cards/DashboardCard"
import { DataTable } from "../../components/table/DataTable"
import type { Changelog } from "../../helpers/types/Changelog"
import AddChangelog from "../../components/forms/AddChangelog"
import { ChangelogColumns } from "../../helpers/dataTable/changelogsColumns"
import { createChangelogsTableActions } from "../../helpers/dataTable/changelogsTableActionsRow"
import { useToast } from "../../hooks/useToast"
import '../../styles/pages/contents/changelogs.scss'

export const Changelogs = () => {

  const { showToast } = useToast();

  const [logs, setLogs] = useState<Changelog[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      const data: Changelog[] = await response.json()
      setLogs(data)
    } catch (error) {
      console.error('Error fetching changelogs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
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
            columns={ChangelogColumns}
            rowActions={createChangelogsTableActions({ fetchChangelogs, showToast })}
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
