import { useEffect, useMemo, useState } from "react"
import { Eye, Newspaper } from "lucide-react"
import { DashboardCard } from "../../components/cards/DashboardCard"
import { DataTable, type DataTableColumn } from "../../components/table/DataTable"
import AddNewsBanner from "../../components/forms/AddNewsBanner"

import "../../styles/pages/contents/app-news.scss"
import type { AppNews } from "../../helpers/types/AppNews"

export const AppNewsPage = () => {
  const [news, setNews] = useState<AppNews[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const dateFormatter = useMemo(() => new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }), [])

  const columns = useMemo<DataTableColumn<AppNews>[]>(() => [
    {
      header: "Titre",
      accessor: (item) => item.title.slice(0, 15) + (item.title.length > 15 ? '...' : '') || '—',
    },
    {
      header: "Description",
      accessor: (item) => item.description.slice(0, 30) + (item.description.length > 30 ? '...' : '') || '—',
      width: "30%"
    },
    {
      header: "Type",
      key: "type",
      align: "center"
    },
    {
      header: "Lien",
      accessor: (item) => {
        const value = item.type === "external" ? item.externalLink.slice(0, 20) + (item.externalLink.length > 20 ? '...' : '') || '—' : item.internalRoute
        return value || undefined
      },
      width: "20%"
    },
    {
      header: "Visible",
      accessor: (item) => item.visible ? "Oui" : "Non",
      align: "center"
    },
    {
      header: "Ordre",
      accessor: (item) => item.order,
      align: "right"
    },
  ], [dateFormatter])

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)

    ;(async () => {
      try {
        const response = await fetch("https://dev-api.astroshare.fr/news")
        const json = await response.json()

        if (!isMounted) return
        setNews(json.data)
      } catch (error) {
        console.error("[AppNewsPage] Impossible de récupérer les actualités", error)
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
    <div className="main-pane app-news-page">
      <div className="list-pane">
        <h1>Actualités</h1>
        <div className='cards-container'>
          <DashboardCard icon={Newspaper} title="Total" value={news.length} small />
          <DashboardCard icon={Eye} title="Visibles" value={news.reduce((acc, item) => acc + (item.visible ? 1 : 0), 0)} small />
        </div>
        <div className='table-container'>
          <DataTable
            data={news}
            columns={columns}
            getRowId={(item, index) => `${item.title}-${index}`}
            isLoading={isLoading}
            loadingLabel="Chargement des actualités…"
            emptyLabel="Aucune actualité disponible pour le moment."
          />
        </div>
      </div>
      <div className="form-pane">
        <h1>Ajouter une actualité</h1>
        <AddNewsBanner />
      </div>
    </div>
  )
}
