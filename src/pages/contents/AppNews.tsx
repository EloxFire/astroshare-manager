import { useEffect, useState } from "react"
import { Eye, Newspaper } from "lucide-react"
import { DashboardCard } from "../../components/cards/DashboardCard"
import { DataTable } from "../../components/table/DataTable"
import type { AppNews } from "../../helpers/types/AppNews"
import AddNewsBanner from "../../components/forms/AddNewsBanner"
import { appNewsColumns } from "../../helpers/dataTable/appNewsColumns"
import { createAppNewsTableActions } from "../../helpers/dataTable/appNewsTableActionsRow"
import { useToast } from "../../hooks/useToast"
import "../../styles/pages/contents/app-news.scss"

export const AppNewsPage = () => {

  const { showToast } = useToast();

  const [news, setNews] = useState<AppNews[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/news`);
      const data = await response.json();
      setNews(data.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
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
            columns={appNewsColumns}
            getRowId={(item, index) => `${item.title}-${index}`}
            rowActions={createAppNewsTableActions({ fetchNews, showToast })}
            isLoading={isLoading}
            loadingLabel="Chargement des actualités…"
            emptyLabel="Aucune actualité disponible pour le moment."
          />
        </div>
      </div>
      <div className="form-pane">
        <h1>Ajouter une actualité</h1>
        <AddNewsBanner onBannerAdded={fetchNews} />
      </div>
    </div>
  )
}
