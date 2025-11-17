import { useEffect, useState } from "react";
import { DataTable, type DataTableColumn } from "../../components/table/DataTable";
import { DashboardCard } from "../../components/cards/DashboardCard";
import { BookMarked, Eye } from "lucide-react";
import type { Resource } from "../../helpers/types/Resource";
import dayjs from "dayjs";
import AddResource from "../../components/forms/AddResource";
import "../../styles/pages/contents/app-resources.scss"

const truncateText = (value: string, maxLength: number) => {
  if (!value) return undefined;
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
};

const ResourcesColumns: DataTableColumn<Resource>[] = [
  {
    header: "Titre",
    accessor: (resource) => truncateText(resource.title, 20),
  },
  {
    header: "Description",
    accessor: (resource) => truncateText(resource.description, 30),
  },
  {
    header: "Catégorie",
    key: "category",
  },
  {
    header: "Sous-catégorie",
    accessor: (resource) => resource.subcategory ?? undefined,
  },
  {
    header: "Tags",
    accessor: (resource) => resource.tags?.length ? truncateText(resource.tags.join(", "), 20) : undefined,
  },
  {
    header: "Type",
    key: "fileType",
    align: "center"
  },
  {
    header: "Niveau",
    accessor: (resource) => typeof resource.level === "number" ? resource.level : undefined,
    align: "center"
  },
  {
    header: "Visible",
    accessor: (resource) => resource.visible ? "Oui" : "Non",
    align: "center"
  },
  {
    header: "Téléchargements",
    accessor: (resource) => typeof resource.downloads === "number" ? resource.downloads.toLocaleString("fr-FR") : undefined,
    align: "center"
  },
  {
    header: "Mise à jour",
    accessor: (resource) => resource.updatedAt ? dayjs(resource.updatedAt).format("DD/MM/YYYY") : undefined,
    align: "right",
  }
]

export const ResourcesPage = () => {

  const [currentMode, setCurrentMode] = useState<"view" | "add">("view");
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
                <DataTable
                  data={resources}
                  columns={ResourcesColumns}
                  getRowId={(resource, index) => `${resource.slug}-${index}`}
                  isLoading={isLoading}
                  loadingLabel="Chargement des ressources…"
                  emptyLabel="Aucune ressource n'est disponible pour le moment."
                />
              </div>
            </>
          ) : (
            <AddResource />
          )
        }
    </div>
  )
}
