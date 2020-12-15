import * as React from 'react'
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
  cardContent: {
    flexGrow: 1,
  },
}))

const cards = [1]

export const Home = (props: RouteComponentProps) => {
  const classes = useStyles()

  const navigateToWordFrequency = () => props.history.push('/word-frequency')

  return (
    <M.Container className={classes.cardGrid} maxWidth="md">
      <M.Grid className={classes.grid} container spacing={4}>
        {cards.map((card) => (
          <M.Grid item key={card} xs={12} sm={6} md={4}>
            <M.Card className={classes.card} onClick={navigateToWordFrequency}>
              <M.CardActionArea>
                <M.CardContent className={classes.cardContent}>
                  <M.Typography gutterBottom variant="h5" component="h2">
                    Word frequency
                  </M.Typography>
                  <M.Typography>
                    Examine hierarchial word frequency and compare inclusion and exclusion lists.
                  </M.Typography>
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
