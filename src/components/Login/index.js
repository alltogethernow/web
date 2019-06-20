import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import {
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  InputAdornment,
  IconButton,
} from '@material-ui/core'
import LoginIcon from '@material-ui/icons/Send'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'
import useLocalState from '../../hooks/use-local-state'

const GET_AUTH_URL = gql`
  mutation GetAuthUrl($url: String!) {
    getAuthUrl(url: $url)
  }
`

const Login = ({ onClose }) => {
  const [localState] = useLocalState()
  const [me, setMe] = useState('')
  const [loading, setLoading] = useState(false)

  const getAuthUrl = useMutation(GET_AUTH_URL, {
    variables: { url: me },
  })

  // Gets the auth url and redirects on submit
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await getAuthUrl()
      const { getAuthUrl: url } = data
      if (error || !url) {
        alert('Uh oh, there was an error getting your authorization url')
        console.log('[Error getting auth url]', error)
      }
      window.location.href = url
    } catch (err) {
      console.log('[Error getting auth url]', err)
    }
    setLoading(false)
    return false
  }

  if (localState && localState.token) {
    return <Redirect to="/" />
  }

  return (
    <Dialog open={true} onClose={onClose}>
      {loading ? <LinearProgress /> : null}
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Hey! Welcome to Together. Get started by logging in with your website.
        </DialogContentText>

        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            id="me"
            label="Your Website URL"
            type="url"
            name="me"
            style={{ margin: '1em 0' }}
            value={me}
            onChange={e => setMe(e.target.value)}
            variant="outlined"
            disabled={loading}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="end" aria-label="Login">
                    <LoginIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}

Login.defaultProps = {
  onClose: () => {},
}

Login.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default Login
