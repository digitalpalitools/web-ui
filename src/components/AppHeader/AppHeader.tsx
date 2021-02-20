import * as M from '@material-ui/core'
import * as MIcon from '@material-ui/icons'

const useStyles = M.makeStyles((theme: M.Theme) =>
  M.createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      backgroundColor: theme.palette.background.default,
    },
    toolBar: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
    goHomeButton: {
      marginRight: theme.spacing(1),
    },
  }),
)

export const AppHeader = () => {
  const classes = useStyles()

  return (
    <M.AppBar position="static" className={classes.appBar}>
      <M.Toolbar variant="dense" className={classes.toolBar}>
        <M.Tooltip title="Go home" aria-label="go home">
          <M.IconButton className={classes.goHomeButton} aria-label="go home" href="/apps">
            <MIcon.Home />
          </M.IconButton>
        </M.Tooltip>
      </M.Toolbar>
    </M.AppBar>
  )
}

export default AppHeader
