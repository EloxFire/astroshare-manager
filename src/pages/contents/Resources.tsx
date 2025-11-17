import { useEffect, useState } from "react";
import { DataTable } from "../../components/table/DataTable";
import { DashboardCard } from "../../components/cards/DashboardCard";
import { BookMarked, Eye } from "lucide-react";
import type { Resource } from "../../helpers/types/Resource";
import AddResource from "../../components/forms/AddResource";
import { ResourcesColumns } from "../../helpers/dataTable/resourcesColumns";
import "../../styles/pages/contents/app-resources.scss"
import { ResourcesTableActions } from "../../helpers/dataTable/resourcesTableActionsRow";

export const ResourcesPage = () => {

  const [currentMode, setCurrentMode] = useState<"view" | "add">("view");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/resources`);
      if (!response.ok) {
        throw new Error(`Erreur lors du chargement des ressources : ${response.statusText}`);
      }
      const data: Resource[] = await response.json();
      setResources(data);
    } catch (error) {
      console.error("Erreur lors du chargement des ressources :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [])

  return (
    <div className="main-pane app-resources-page">
      <h1>{currentMode === "view" ? "Ressources téléchargeables" : "Ajouter une ressource"}</h1>
      <div>
        {
          currentMode === "view" ? (
            <button className="mode-button" onClick={() => setCurrentMode("add")}>Ajouter une ressource</button>
          ) : (
            <button className="mode-button" onClick={() => setCurrentMode("view")}>Retour à la liste des ressources</button>
          )
        }
      </div>
        {
          currentMode === "view" ? (
            <>
              <div className='cards-container'>
                <DashboardCard icon={BookMarked} title="Total" value={resources.length} small />
                <DashboardCard icon={Eye} title="Visible" value={resources.filter(resource => resource.visible).length} small />
              </div>
              <div className="table-container">
                <DataTable<Resource>
                  data={resources}
                  columns={ResourcesColumns}
                  getRowId={(resource, index) => `${resource.slug}-${index}`}
                  isLoading={isLoading}
                  loadingLabel="Chargement des ressources…"
                  emptyLabel="Aucune ressource n'est disponible pour le moment."
                  rowActions={ResourcesTableActions}
                />
              </div>
            </>
          ) : (
            <AddResource onResourceAdded={fetchResources} />
          )
        }
    </div>
  )
}