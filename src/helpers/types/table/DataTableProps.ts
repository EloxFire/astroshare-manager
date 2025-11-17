import type { DataRow } from "./DataRow"
import type { DataTableColumn } from "./DataTableColumn"
import type { DataTableRowAction } from "./DataTableRowAction"

export type DataTableProps<T extends DataRow> = {
  data: T[]
  columns: Array<DataTableColumn<T>>
  getRowId: (row: T, index: number) => string
  isLoading?: boolean
  loadingLabel?: string
  emptyLabel?: string
  className?: string
  rowActions?: Array<DataTableRowAction<T>>
  actionsHeader?: string
}