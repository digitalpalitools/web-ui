import { useState } from 'react'
import * as M from '@material-ui/core'
import * as MIcon from '@material-ui/icons'
import * as T from 'src/themes'
import { useTranslation } from 'react-i18next'
import PSC from '@pathnirvanafoundation/pali-script-converter'
import * as H from '../../hooks'

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
    selectLocaleButton: {
      marginRight: theme.spacing(0),
    },
    feedbackButton: {
      fontSize: 'smaller',
      color: 'white',
      backgroundColor: 'green',
      marginRight: theme.spacing(1),
    },
  }),
)

export interface AppHeaderProps {
  version: string | undefined
  theme: T.ThemeType
  toggleTheme: () => void
  changeScript: (s: string) => void
}

export const AppHeader = ({ version, theme, toggleTheme, changeScript }: AppHeaderProps) => {
  const classes = useStyles()

  const [script, setScript] = H.useLocalStorageState<string>(PSC.Script.RO, 'currentScript')

  const { t } = useTranslation()

  const handleFeedbackOnClick = () =>
    window.open(
      `https://docs.google.com/forms/d/e/1FAIpQLSe_sDP4Y9scxKqYsCr9dJz1GpYLePcBIluuqd0_pdu1tll2dw/viewform?entry.267696921=${encodeURIComponent(
        window.location.href,
      )}&entry.1433863141=${version}`,
      '_blank',
    )

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseLocaleMenu = () => {
    setAnchorEl(null)
  }

  const handleClickLocaleMenuItem = (s: string) => () => {
    handleCloseLocaleMenu()
    setScript(s)
    changeScript(s)
  }

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
          <>
            <M.Button className={classes.selectLocaleButton} onClick={handleClick}>
              {PSC.getLocaleNameForScript(script)} <MIcon.ArrowDropDown />
            </M.Button>
            <M.Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseLocaleMenu}
            >
              {[...PSC.PaliScriptInfo.keys()].map((s) => (
                <M.MenuItem key={s} onClick={handleClickLocaleMenuItem(s)}>
                  {PSC.getLocaleNameForScript(s)}
                </M.MenuItem>
              ))}
            </M.Menu>
          </>
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
          <M.Button className={classes.feedbackButton} onClick={handleFeedbackOnClick}>
            {t`appHeader.giveFeedback`}
          </M.Button>
        </M.Box>
      </M.Toolbar>
    </M.AppBar>
  )
}

export default AppHeader
