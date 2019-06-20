import React from 'react'
import { Helmet } from 'react-helmet'
// import useLocalState from '../hooks/use-local-state'

const Meta = ({ title = '' }) => {
  // const [localState] = useLocalState()

  return <Helmet title={title} />
}

export default Meta
