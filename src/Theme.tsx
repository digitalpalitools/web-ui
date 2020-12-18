import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
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

export default theme
