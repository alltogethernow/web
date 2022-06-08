import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { useMutation, useApolloClient } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { Redirect } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from '@mui/material'

const LOGIN = gql`
  mutation login($code: String!, $state: String!) {
    login(code: $code, state: $state) {
      token
    }
  }
`

const Auth = (props) => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [login] = useMutation(LOGIN)
  const { enqueueSnackbar } = useSnackbar()
  const client = useApolloClient()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const state = urlParams.get('state')
      const { data, errors } = await login({ variables: { code, state } })
      if (errors) {
        console.error('[Error logging in]', errors)
        enqueueSnackbar('Error logging in', { variant: 'error' })
        setStatus(false)
      }
      if (data && data.login && data.login.token) {
        const jwt = data.login.token
        enqueueSnackbar(`Welcome to Together`)
        client.resetStore()
        localStorage.setItem('token', jwt)
        window.location.href = '/'
        // setStatus(true)
      }
    } catch (err) {
      console.error('[Error logging in]', err)
      enqueueSnackbar('Error logging in', { variant: 'error' })
      setStatus(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    handleLogin()
  }, [])

  if (status === true) {
    return <Redirect to="/" />
  }

  if (status === false) {
    return <Redirect to="/login" />
  }

  return (
    <Dialog open={true} onClose={() => {}}>
      {loading ? <LinearProgress /> : null}
      <DialogTitle>Finalizing</DialogTitle>
      <DialogContent>
        <DialogContentText>Finalizing login...</DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default Auth
