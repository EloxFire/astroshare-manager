import type { Category } from "../types/Category"
import type { DataTableColumn } from "../types/table/DataTableColumn"

export const categoriesColumns: DataTableColumn<Category>[] = [
  {
    header: "Titre",
    accessor: (item) => item.title.slice(0, 15) + (item.title.length > 15 ? '...' : '') || '—',
  },
  {
    header: "Description",
    accessor: (item) => item.description.slice(0, 30) + (item.description.length > 30 ? '...' : '') || '—',
  },
  {
    header: "Visible",
    accessor: (item) => item.visible ? "Oui" : "Non",
    align: "center"
  }
]