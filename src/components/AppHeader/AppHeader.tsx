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
    feedbackButton: {
      fontSize: 'smaller',
      color: 'white',
      backgroundColor: 'green',
    },
  }),
)

export interface AppHeaderProps {
  version: string | undefined
  theme: T.ThemeType
  toggleTheme: () => void
}

export const AppHeader = ({ version, theme, toggleTheme }: AppHeaderProps) => {
  const classes = useStyles()

  const handleFeedbackOnClick = () =>
    window.open(
      `https://docs.google.com/forms/d/e/1FAIpQLSe_sDP4Y9scxKqYsCr9dJz1GpYLePcBIluuqd0_pdu1tll2dw/viewform?entry.267696921=${encodeURIComponent(
        window.location.href,
      )}&entry.1433863141=${version}`,
      '_blank',
    )

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
          <M.Button className={classes.feedbackButton} onClick={handleFeedbackOnClick}>
            Give feedback
          </M.Button>
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
