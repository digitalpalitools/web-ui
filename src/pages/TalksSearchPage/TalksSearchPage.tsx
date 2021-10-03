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
    flex: '1',
    marginRight: '0.5rem',
  },
  searchCorpus: {
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
  Talks = 'talks',
}

const SearchCorpusDisplayNames = new Map([[SearchCorpus.Talks, 'Ṭhānissaro Bhikkhu Talks']])

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
    searchString: params.searchString || 'the four noble truths',
    searchCorpus: SearchCorpus.Talks,
  } as SearchOptions
  const [theme] = H.useLocalStorageState<string>('dark', 'currentTheme')
  const [searchString, setSearchString] = useState(initialValue.searchString)
  const [searchCorpus, setSearchCorpus] = useState(SearchCorpus.Talks)
  const [searchOptions, setSearchOptions] = useState<SearchOptions>(initialValue)
  const [searchRunning, setSearchRunning] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  useEffect(() => {
    const fetchSearchResults = async () => {
      const res = await fetch(
        `https://tsbtalks.search.windows.net/indexes/azureblob-index/docs?api-version=2020-06-30&search=${searchOptions.searchString}&searchMode=any&searchFields=content&highlight=content&highlightPreTag=<span class='search-result-highlight'>&highlightPostTag=</span>`,
        {
          headers: {
            'api-key': 'D0CA5AF719558AA344C3111934DA874D',
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
              highlights: sr['@search.highlights'].content.map((h: any) => h),
              content: sr.content,
              name: sr.metadata_storage_name,
            } as SearchResult),
        ),
      )

      setSearchRunning(false)
    }

    if (searchOptions.searchString) {
      setSearchRunning(true)
      fetchSearchResults()
    }
  }, [searchOptions])

  const handleChangeSearchString = (e: any) => {
    setSearchString(e.target.value)
  }

  const handleSearchCorpusChange = (e: any) => {
    setSearchCorpus(e.target.value)
  }

  const handlesSarchStringKeyDown = (e: any) => {
    if (e.keyCode !== 13 || searchString.length === 0) {
      return
    }

    props.history.push(`/talks-search/${searchCorpus}/${searchString}`)
    setSearchResults([])
    setSearchOptions({ searchString, searchCorpus })
  }

  return (
    <div className={classes.root}>
      <div className={classes.searchBar}>
        <M.TextField
          className={classes.searchString}
          label="Search for..."
          variant="outlined"
          onChange={handleChangeSearchString}
          onKeyDown={handlesSarchStringKeyDown}
          value={searchString}
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
        {searchString.length === 0
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
                    <M.Typography>
                      {sr.score} | {sr.name}
                    </M.Typography>
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
