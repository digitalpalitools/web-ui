import { createMuiTheme } from '@material-ui/core/styles'

export type ThemeType = 'light' | 'dark'

const createTheme = (type: ThemeType) =>
  createMuiTheme({
    palette: {
      type,
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          html: {
            margin: '0',
            padding: '0',
          },
          body: {
            margin: '0',
            padding: '0',
          },
          'html > body *': {
            // border: 'solid 1px red',
          },
          '#root': {
            height: '100vh',
          },
        },
      },
    },
  })

export const lightTheme = createTheme('light')

export const darkTheme = createTheme('dark')
