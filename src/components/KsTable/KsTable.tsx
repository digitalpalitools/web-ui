import * as M from '@material-ui/core'

export type KsTableSortOrder = 'asc' | 'desc' | undefined

// TODO: row cannot be any, it must have at least id field
export interface KsTableRow {
  id: number
}

export interface KsTableColumnDefinition {
  id: number
  field: string
  displayName: string
  sortable: boolean
  width?: string
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
}

export interface KsTableProps {
  sortBy: string
  sortOrder?: KsTableSortOrder
  requestSort?: (col: string) => void
  columnDefinitions: KsTableColumnDefinition[]
  rows: KsTableRow[]
}

const useStyles = M.makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflowY: 'auto',
  },
  table: {
    tableLayout: 'fixed',
  },
  tableRow: {
    '& td, & th': {
      padding: '0.3rem',
      lineHeight: '1.1rem',
      fontFamily: 'monospace',
      fontSize: 'large',
      overflowWrap: 'break-word',
    },
    '& td:not(:last-child), & th:not(:last-child)': {
      borderRight: 'solid 1px',
      borderRightColor: theme.palette.secondary.light,
    },
  },
}))

export const KsTable = (props: KsTableProps) => {
  const { sortBy, sortOrder, requestSort, rows, columnDefinitions } = props

  const handleClick = (colName: string) => () => requestSort && requestSort(colName)

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <M.Table className={classes.table}>
        <colgroup>
          {columnDefinitions.map((colDef) => (
            <col key={colDef.id} style={{ width: colDef.width }} />
          ))}
        </colgroup>
        <M.TableHead>
          <M.TableRow className={classes.tableRow}>
            {columnDefinitions.map((colDef) => (
              <M.TableCell key={colDef.id} align={colDef.align}>
                {colDef.sortable ? (
                  <M.TableSortLabel
                    active={sortBy === colDef.field}
                    direction={sortOrder}
                    onClick={handleClick(colDef.field)}
                  >
                    {colDef.displayName}
                  </M.TableSortLabel>
                ) : (
                  colDef.displayName
                )}
              </M.TableCell>
            ))}
          </M.TableRow>
        </M.TableHead>
        <M.TableBody>
          {rows.map((item: any) => (
            <M.TableRow key={item.id} className={classes.tableRow}>
              {columnDefinitions.map((colDef) => (
                <M.TableCell key={colDef.id}>{item[colDef.field]}</M.TableCell>
              ))}
            </M.TableRow>
          ))}
        </M.TableBody>
        <M.TableFooter />
      </M.Table>
    </div>
  )
}
