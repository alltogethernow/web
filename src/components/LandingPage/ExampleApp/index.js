import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  Typography,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import Timeline from '../../Layout/Timeline'
import Gallery from '../../Layout/Gallery'
import Classic from '../../Layout/Classic'
import Map from '../../Layout/Map'
import style from './style'
// import PropTypes from 'prop-types'

import exampleData from './example-data'

const ExampleApp = ({ classes }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedPreview, setSelectedPreview] = useState(
    Object.keys(exampleData)[0]
  )

  return (
    <div className={classes.wrapper}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={e => setMenuOpen(!menuOpen)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            {exampleData[selectedPreview].title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.inner}>
        <Drawer
          className={classes.drawer + (menuOpen ? ' is-open' : '')}
          variant="persistent"
          anchor="left"
          open={menuOpen}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <List>
            {Object.values(exampleData).map(example => (
              <ListItem
                button
                key={`preview-menu-${example.id}`}
                onClick={e => setSelectedPreview(example.id)}
                selected={selectedPreview === example.id}
              >
                <ListItemText primary={example.title} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <div className={classes.timeline}>
          {selectedPreview === 'timeline' && (
            <Timeline posts={exampleData[selectedPreview].items} channel={{}} />
          )}
          {selectedPreview === 'classic' && (
            <Classic posts={exampleData[selectedPreview].items} channel={{}} />
          )}
          {selectedPreview === 'gallery' && (
            <Gallery posts={exampleData[selectedPreview].items} channel={{}} />
          )}
          {selectedPreview === 'map' && (
            <div className={classes.exampleMap}>
              <Map posts={exampleData[selectedPreview].items} channel={{}} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withStyles(style)(ExampleApp)
