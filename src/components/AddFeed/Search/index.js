import React, { useState } from 'react'
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types'
import { TextField, IconButton, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import styles from '../style'

const Search = ({ handleSearch, classes }) => {
  const [search, setSearch] = useState('')

  const doSearch = e => {
    e.preventDefault()
    if (search) {
      handleSearch(search)
    }
  }

  return (
    <form onSubmit={doSearch} className={classes.searchForm}>
      <TextField
        fullWidth
        autoFocus={true}
        type="search"
        label="Who / What do you want to add?"
        variant="outlined"
        value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={doSearch}
                edge="end"
                aria-label="Search"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  )
}

Search.propTypes = {
  handleSearch: PropTypes.func.isRequired,
}

export default withStyles(styles)(Search)
