import type { AppNews } from "../types/AppNews"
import type { DataTableColumn } from "../types/table/DataTableColumn"

export const appNewsColumns: DataTableColumn<AppNews>[] = [
  {
    header: "Titre",
    accessor: (item) => item.title.slice(0, 15) + (item.title.length > 15 ? '...' : '') || '—',
  },
  {
    header: "Description",
    accessor: (item) => item.description.slice(0, 30) + (item.description.length > 30 ? '...' : '') || '—',
  },
  {
    header: "Type",
    key: "type",
    align: "center"
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
  }
]