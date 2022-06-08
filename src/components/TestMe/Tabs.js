import React, { useState, useEffect } from 'react'
import useReactRouter from 'use-react-router'
import { Link } from 'react-router-dom'
import useMicropubQuery from '../../hooks/use-micropub-query'
import { LinearProgress, AppBar, Tabs, Tab } from '@mui/material'

const TabLink = ({ label, postType = '' }) => {
  return <Tab label={label} to={'/me/' + postType} component={Link} />
}

const PostTypeTabs = () => {
  const [value, setValue] = useState(0)
  const {
    match: {
      params: { postType },
    },
  } = useReactRouter()
  const { data: config, loading } = useMicropubQuery('config')
  const postTypes = config && config['post-types'] ? config['post-types'] : []

  // Set the tab index when url changes or post types loaded
  useEffect(() => {
    postTypes.forEach((type, i) => {
      if (type.type === postType) {
        setValue(i + 1)
      }
    })
  }, [postType, postTypes])

  return (
    <AppBar
      position="static"
      color="default"
      style={{ zIndex: 1, position: 'relative' }}
    >
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <TabLink label="All" />
        {postTypes.map((type, i) => (
          <TabLink
            key={`post-type-tab-${i}`}
            label={type.name}
            postType={type.type}
          />
        ))}
      </Tabs>
      {!!loading && <LinearProgress />}
    </AppBar>
  )
}

export default PostTypeTabs
