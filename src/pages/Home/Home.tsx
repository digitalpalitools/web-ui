import { RouteComponentProps } from 'react-router-dom'
import * as M from '@material-ui/core'

const useStyles = M.makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
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
  cardContent: {},
}))

const createCardData = (props: any): any[] => [
  {
    fn: () => props.history.push('/word-frequency'),
    title: 'Word frequency',
    details: 'Examine hierarchial word frequency and compare inclusion and exclusion lists.',
  },
  {
    fn: () => props.history.push('/pali-sort'),
    title: 'Pāli Sort',
    details: 'Sort a list of pāli words.',
  },
  {
    fn: () => props.history.push('/count'),
    title: 'Count',
    details: 'Count the length of pāli words.',
  },
  {
    fn: () => props.history.push('/converter'),
    title: 'Converter',
    details: 'Convert pāli between various scripts.',
  },
]

export const Home = (props: RouteComponentProps) => {
  const classes = useStyles()

  const cardData = createCardData(props)

  return (
    <M.Container className={classes.cardGrid} maxWidth="md">
      <M.Grid className={classes.grid} container spacing={4}>
        {cardData.map((c: any) => (
          <M.Grid item key={c.title} xs={12} sm={6} md={4}>
            <M.Card className={classes.card} onClick={c.fn}>
              <M.CardActionArea>
                <M.CardContent className={classes.cardContent}>
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
