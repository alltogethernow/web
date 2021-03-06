import React from 'react'
import BaseAction from './Base'
import ViewIcon from '@material-ui/icons/Link'

const ActionView = ({ url, menuItem }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    <BaseAction title="View Original" onClick={() => {}} icon={<ViewIcon />} />
  </a>
)

export default ActionView
