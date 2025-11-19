import type { Changelog } from "../types/Changelog";
import type { DataTableColumn } from "../types/table/DataTableColumn";
import dayjs from "dayjs";

export const ChangelogColumns: DataTableColumn<Changelog>[] = [
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
      accessor: (log) => log.date ? dayjs(log.date).format('DD/MM/YYYY') : undefined
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
]