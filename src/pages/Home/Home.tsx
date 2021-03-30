import { RouteComponentProps } from 'react-router-dom'
import * as M from '@material-ui/core'
import * as MLab from '@material-ui/lab'

const useStyles = M.makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  info: {
    marginBottom: theme.spacing(4),
  },
}))

const createCardData = (props: any): any[] => [
  {
    fn: () => window.open('https://digitalpalireader.online'),
    title: 'Digital Pāli Reader',
    details: 'A tool facilitating immersive study of the Pāli language, canon and related scriptures.',
  },
  {
    fn: () => props.history.push('/count'),
    title: 'Count',
    details: 'Count the length of Pāli words.',
  },
  {
    fn: () => props.history.push('/pali-sort'),
    title: 'Pāli Sort',
    details: 'Sort a list of Pāli words.',
  },
  {
    fn: () => props.history.push('/converter'),
    title: 'Converter',
    details: 'Convert Pāli between various scripts.',
  },
  {
    fn: () => props.history.push('/word-frequency'),
    title: 'Word Frequency',
    details: 'Examine hierarchial word frequency and compare inclusion and exclusion lists.',
  },
  {
    fn: () => props.history.push('/inflect'),
    title: 'Inflections',
    details: 'Show conjugations & declensions for Pāli words.',
  },
]

export const Home = (props: RouteComponentProps) => {
  const classes = useStyles()

  const cardData = createCardData(props)

  return (
    <M.Container className={classes.cardGrid} maxWidth="md">
      <MLab.Alert className={classes.info} severity="info">
        Digital Pāli Tools: A Step-by-Step Process Towards Natural Language Processing of Pāli. Check out the&nbsp;
        <a href="https://bitly.com/dptvision" target="_blank" rel="noreferrer">
          vision document
        </a>
        .
      </MLab.Alert>
      <M.Grid className={classes.grid} container spacing={4}>
        {cardData.map((c: any) => (
          <M.Grid item key={c.title} xs={12} sm={6} md={4}>
            <M.Card className={classes.card} onClick={c.fn}>
              <M.CardActionArea>
                <M.CardContent>
                  <M.Typography gutterBottom variant="h5" component="h2">
                    {c.title}
                  </M.Typography>
                  <M.Typography>{c.details}</M.Typography>
                </M.CardContent>
              </M.CardActionArea>
            </M.Card>
          </M.Grid>
        ))}
      </M.Grid>
    </M.Container>
  )
}

export default Home
