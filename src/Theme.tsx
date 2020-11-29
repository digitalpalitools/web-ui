import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
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
        '#root': {
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        },
      },
    },
  },
})

export default theme
