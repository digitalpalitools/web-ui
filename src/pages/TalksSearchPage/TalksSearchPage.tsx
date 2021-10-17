/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import * as M from '@material-ui/core'
import * as MIcon from '@material-ui/icons'
import * as H from '../../hooks'
import * as T from '../../themes'

const useStyles = M.makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1.5),
  },
  searchBar: {
    display: 'flex',
    marginBottom: '1rem',
  },
  searchString: {
    marginRight: '0.5rem',
    flex: '1',
  },
  searchCorpus: {
    marginLeft: 'auto',
    flex: '0.5',
  },
  searchResultHeader: {
    display: 'flex',
  },
  searchResultHeaderTitle: {
    flex: '1',
  },
  searchResultHeaderActions: {
    marginLeft: 'auto',
  },
}))

const SearchResultHighlightRoot = styled.div`
  span.search-result-highlight {
    background-color: ${(props) => props.theme.palette.secondary.light};
  }
`

const createSearchHighlightMarkup = (searchHighlight: string) => {
  return {
    __html: searchHighlight,
  }
}

enum SearchCorpus {
  TsbDt = 'TsbDt',
  TsbSdt = 'TsbSdt',
  YdbMain = 'YdbMain',
}

const SearchCorpusStringToEnumMap = new Map([
  ['TsbDt', SearchCorpus.TsbDt],
  ['TsbSdt', SearchCorpus.TsbSdt],
  ['YdbMain', SearchCorpus.YdbMain],
])

const SearchCorpusDisplayNames = new Map([
  [SearchCorpus.TsbDt, 'Ṭhānissaro Bhikkhu - Dhamma Talks'],
  [SearchCorpus.TsbSdt, 'Ṭhānissaro Bhikkhu - Short Dhamma Talks'],
  [SearchCorpus.YdbMain, 'Yuttadhammo Bhikkhu Talks'],
])

const AuthorChannelFromCorpus = new Map([
  [SearchCorpus.TsbDt, { author: 'tsb', channel: 'dt' }],
  [SearchCorpus.TsbSdt, { author: 'tsb', channel: 'sdt' }],
  [SearchCorpus.YdbMain, { author: 'ydb', channel: 'main' }],
])

export interface TalksSearchPageParams {
  searchString?: string
  searchCorpus?: SearchCorpus
}

interface SearchOptions {
  searchString: string
  searchCorpus: SearchCorpus
}

interface SearchResult {
  id: string
  score: number
  author: string
  channel: string
  highlights: string[]
  content: string
  name: string
}

export const TalksSearchPage = (props: RouteComponentProps<TalksSearchPageParams>) => {
  const classes = useStyles()
  const {
    match: { params },
  } = props
  const initialValue = {
    searchString: params.searchString || 'four noble truths',
    searchCorpus: SearchCorpusStringToEnumMap.get(params.searchCorpus || SearchCorpus.TsbDt),
  } as SearchOptions
  const [theme] = H.useLocalStorageState<string>('dark', 'currentTheme')
  const [searchOptions, setSearchOptions] = useState<SearchOptions>(initialValue)
  const [searchRunning, setSearchRunning] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchCorpus, setSearchCorpus] = useState<SearchCorpus>(initialValue.searchCorpus)
  const [searchString, setSearchString] = useState<string>(initialValue.searchString)
  const [searchError, setSearchError] = useState<string>('')

  useEffect(() => {
    console.log('Triggering new search...')
    const { author, channel } = AuthorChannelFromCorpus.get(searchOptions.searchCorpus) || {
      author: 'tsb',
      channel: 'dt',
    }
    const fetchSearchResults = async () => {
      try {
        const res = await fetch(
          `https://audio-talks-search.search.windows.net/indexes/audio-talks-search-index/docs?api-version=2020-06-30-Preview&search=${searchOptions.searchString}&$filter=(author eq '${author}' and channel eq '${channel}')&searchFields=subtitles&highlight=subtitles&highlightPreTag=<span class='search-result-highlight'>&highlightPostTag=</span>`,
          {
            headers: {
              'api-key': '62AF11064983663506CBBE4E052947F0',
              Accept: 'application/json; odata.metadata=none',
            },
          },
        )

        const json = await res.json()
        setSearchResults(
          json.value.map(
            (sr: any) =>
              ({
                id: sr.metadata_storage_path,
                score: sr['@search.score'],
                highlights: sr['@search.highlights'].subtitles.map((h: any) => h),
                content: sr.subtitles,
                name: sr.title,
                author: sr.author,
                channel: sr.channel,
              } as SearchResult),
          ),
        )
      } catch (e) {
        setSearchError(e.toString())
      }

      setSearchRunning(false)
    }

    if (searchOptions.searchString) {
      setSearchRunning(true)
      fetchSearchResults()
    }
  }, [searchOptions])

  const triggerNewSearch = (corpus: SearchCorpus, str: string) => {
    props.history.push(`/talks-search/${corpus}/${str}`)
    setSearchError('')
    setSearchResults([])
    setSearchOptions({ searchString: str, searchCorpus: corpus })
  }

  const handleSearchStringChange = (e: any) => {
    setSearchString(e.target.value)
  }

  const handleSearchCorpusChange = (e: any) => {
    const corpus = SearchCorpusStringToEnumMap.get(e.target.value) || SearchCorpus.TsbDt
    setSearchCorpus(corpus)
    triggerNewSearch(corpus, searchString)
  }

  const handlesSearchStringKeyDown = (e: any) => {
    if (e.keyCode !== 13 || e.target.value.length === 0) {
      return
    }

    triggerNewSearch(searchCorpus, e.target.value)
  }

  return (
    <div className={classes.root}>
      <div className={classes.searchBar}>
        <M.TextField
          className={classes.searchString}
          label="Search for..."
          variant="outlined"
          value={searchString}
          onChange={handleSearchStringChange}
          onKeyDown={handlesSearchStringKeyDown}
        />
        <M.TextField
          className={classes.searchCorpus}
          select
          label="Corpus"
          value={searchCorpus}
          onChange={handleSearchCorpusChange}
          variant="outlined"
          SelectProps={{
            native: true,
          }}
        >
          {[...SearchCorpusDisplayNames.keys()].map((k) => (
            <option key={SearchCorpusDisplayNames.get(k)} value={k}>
              {SearchCorpusDisplayNames.get(k)}
            </option>
          ))}
        </M.TextField>
      </div>
      <div>
        {searchError.length !== 0
          ? `Error in getting search results: ${searchError}`
          : searchOptions.searchString.length === 0
          ? 'Type a something to search in the box above and press enter key...'
          : searchRunning
          ? 'Searching...'
          : searchResults.length === 0
          ? 'No search results. Change search term and try again...'
          : searchResults
              .sort((sr1, sr2) => sr2.score - sr1.score)
              .map((sr: SearchResult) => (
                <M.Accordion key={sr.id} defaultExpanded>
                  <M.AccordionSummary expandIcon={<MIcon.ExpandMore />}>
                    <div className={classes.searchResultHeader}>
                      <M.Tooltip title={`Author: ${sr.author}, Channel: ${sr.channel}, Score: ${sr.score}`} arrow>
                        <div className={classes.searchResultHeaderTitle}>
                          <M.Typography>{sr.name}</M.Typography>
                        </div>
                      </M.Tooltip>
                      <div className={classes.searchResultHeaderActions}>
                        <MIcon.TextRotateUpRounded />
                        <MIcon.PlayArrow />
                      </div>
                    </div>
                  </M.AccordionSummary>
                  <M.AccordionDetails>
                    <SearchResultHighlightRoot
                      theme={theme === 'light' ? T.lightTheme : T.darkTheme}
                      dangerouslySetInnerHTML={createSearchHighlightMarkup(sr.highlights.join())}
                    />
                  </M.AccordionDetails>
                </M.Accordion>
              ))}
      </div>
    </div>
  )
}

export default TalksSearchPage
