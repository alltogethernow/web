import React from 'react'
import { Link } from 'react-router-dom'
import {
  List,
  Typography,
  Card,
  LinearProgress,
  CardContent,
  CardHeader,
  ButtonGroup,
  Button,
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import {
  Settings as SettingsIcon,
  Edit as NoteIcon,
  FolderShared as PostsIcon,
} from '@material-ui/icons'
import ChannelMenuItem from '../ChannelMenu/ChannelMenuItem'
import useChannels from '../../hooks/use-channels'
import useUser from '../../hooks/use-user'
import style from './style'

const Home = ({ classes }) => {
  const { channels, loading } = useChannels()
  const { user } = useUser()
  const mainChannels = channels.filter((c) => c.uid !== 'notifications') || []

  return (
    <div className={classes.container}>
      {!!loading && <LinearProgress />}

      <Typography component="h1" variant="h3" className={classes.title}>
        Welcome to Together
      </Typography>

      {mainChannels.length > 0 && (
        <Card>
          <CardHeader title="Channels"></CardHeader>
          <List className={classes.channels}>
            {mainChannels.map((channel) => (
              <ChannelMenuItem channel={channel} button />
            ))}
          </List>
        </Card>
      )}

      <Card style={{ marginTop: 20 }}>
        <CardHeader title="Quick Links"></CardHeader>
        <CardContent>
          <ButtonGroup size="large" color="primary" variant="contained">
            {user && user.hasMicropub && (
              <Button component={Link} to="/editor" startIcon={<NoteIcon />}>
                New Post
              </Button>
            )}
            <Button
              component={Link}
              to="/settings"
              startIcon={<SettingsIcon />}
            >
              Settings
            </Button>
            {user && user.hasMicropub && (
              <Button component={Link} to="/me" startIcon={<PostsIcon />}>
                My Posts
              </Button>
            )}
          </ButtonGroup>
        </CardContent>
      </Card>
    </div>
  )
}

export default withStyles(style)(Home)
