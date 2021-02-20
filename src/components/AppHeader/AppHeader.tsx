import * as M from '@material-ui/core'
import * as MIcon from '@material-ui/icons'
import * as T from 'src/themes'

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
      display: 'flex',
      justifyContent: 'space-between',
    },
    goHomeButton: {
      marginRight: theme.spacing(1),
    },
    changeThemeButton: {
      border: 0,
    },
  }),
)

export interface AppHeaderProps {
  theme: T.ThemeType
  toggleTheme: () => void
}

export const AppHeader = ({ theme, toggleTheme }: AppHeaderProps) => {
  const classes = useStyles()

  return (
    <M.AppBar position="static" className={classes.appBar}>
      <M.Toolbar variant="dense" className={classes.toolBar}>
        <M.Box>
          <M.Tooltip title="Go home">
            <M.IconButton className={classes.goHomeButton} href="/apps">
              <MIcon.Home />
            </M.IconButton>
          </M.Tooltip>
        </M.Box>
        <M.Box>
          {theme === 'light' && (
            <M.Tooltip title="Toggle light/dark theme">
              <M.IconButton onClick={toggleTheme}>
                <MIcon.Brightness4 />
              </M.IconButton>
            </M.Tooltip>
          )}
          {theme === 'dark' && (
            <M.Tooltip title="Toggle light/dark theme">
              <M.IconButton onClick={toggleTheme}>
                <MIcon.Brightness7 />
              </M.IconButton>
            </M.Tooltip>
          )}
        </M.Box>
      </M.Toolbar>
    </M.AppBar>
  )
}

export default AppHeader
