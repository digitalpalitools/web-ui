import { RouteComponentProps } from 'react-router-dom'
import * as M from '@material-ui/core'
import * as MLab from '@material-ui/lab'
import { useTranslation } from 'react-i18next'

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

const createCardData = (props: any, translateFunc: (str: string) => string): any[] => [
  {
    fn: () => window.open('https://digitalpalireader.online'),
    title: translateFunc('HomePage.DPRTitle'),
    details: translateFunc('HomePage.DPRDetails'),
  },
  {
    fn: () => props.history.push('/count'),
    title: translateFunc('HomePage.CountTitle'),
    details: translateFunc('HomePage.CountDetails'),
  },
  {
    fn: () => props.history.push('/pali-sort'),
    title: translateFunc('HomePage.PaliSortTitle'),
    details: translateFunc('HomePage.PaliSortDetails'),
  },
  {
    fn: () => props.history.push('/converter'),
    title: translateFunc('HomePage.ConverterTitle'),
    details: translateFunc('HomePage.ConverterDetails'),
  },
  {
    fn: () => props.history.push('/word-frequency'),
    title: translateFunc('HomePage.WordFreqTitle'),
    details: translateFunc('HomePage.WordFreqDetails'),
  },
  {
    fn: () => props.history.push('/inflect'),
    title: translateFunc('HomePage.InflectionsTitle'),
    details: translateFunc('HomePage.InflectionsDetails'),
  },
]

export const Home = (props: RouteComponentProps) => {
  const classes = useStyles()

  const { t } = useTranslation()
  const cardData = createCardData(props, t)

  return (
    <M.Container className={classes.cardGrid} maxWidth="md">
      <MLab.Alert className={classes.info} variant="outlined" severity="info">
        {t('HomePage.DPTinfo')}&nbsp;
        <M.Link href="https://bitly.com/dptvision" target="_blank" rel="noreferrer">
          {t('HomePage.VisionDocument')}
        </M.Link>
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
