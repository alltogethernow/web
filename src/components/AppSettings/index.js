import React from 'react'
import withStyles from '@mui/styles/withStyles';
import SettingsModal from '../SettingsModal'
import SyndicationSettings from './SyndicationSettings'
import styles from './style'

const Settings = ({ classes }) => {
  return (
    <SettingsModal title="Settings">
      <SyndicationSettings />
    </SettingsModal>
  )
}

export default withStyles(styles)(Settings)
