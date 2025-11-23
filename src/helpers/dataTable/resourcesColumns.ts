import dayjs from "dayjs";
import type { Resource } from "../types/Resource";
import type { DataTableColumn } from "../types/table/DataTableColumn";
import { truncateText } from "../utils/truncateText";

export const ResourcesColumns: DataTableColumn<Resource>[] = [
  {
    header: "ID",
    accessor: (resource) => truncateText(resource._id, 5),
  },
  {
    header: "Titre",
    accessor: (resource) => truncateText(resource.title, 20),
  },
  {
    header: "Description",
    accessor: (resource) => truncateText(resource.description, 25),
  },
  // {
  //   header: "Catégorie",
  //   accessor: (resource) => resource.category ?? undefined,
  // },
  // {
  //   header: "Sous-catégorie",
  //   accessor: (resource) => resource.subcategory ?? undefined,
  // },
  // {
  //   header: "Tags",
  //   accessor: (resource) => resource.tags?.length ? truncateText(resource.tags.join(", "), 20) : undefined,
  // },
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