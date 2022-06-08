import React from 'react'
import useReactRouter from 'use-react-router'
import EditIcon from '@mui/icons-material/Edit'
import BaseAction from './Base'
import { kebabCase } from 'lodash'

const toMf2 = jf2 => {
  let mf2 = {}
  for (const key in jf2) {
    if (jf2.hasOwnProperty(key)) {
      if (!key.startsWith('_')) {
        if (key === 'content') {
          mf2.content =
            jf2.content.html || jf2.content.text
              ? [{ html: jf2.content.html, value: jf2.content.text }]
              : [jf2.content]
        } else {
          let value = jf2[key]
          if (value !== null) {
            if (!Array.isArray(value)) {
              value = [value]
            }
            mf2[kebabCase(key)] = value
          }
        }
      }
    }
  }
  return mf2
}

const ActionUpdate = ({ post, menuItem, onClose }) => {
  const { history } = useReactRouter()

  const openEditor = e => {
    history.push('/editor', { update: true, properties: toMf2(post) })
    if (onClose) {
      onClose()
    }
  }

  return (
    <BaseAction
      title={'Update'}
      onClick={openEditor}
      icon={<EditIcon />}
      menuItem={menuItem}
    />
  )
}

export default ActionUpdate
