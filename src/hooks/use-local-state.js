import { useCallback, useState, createContext, useContext } from 'react'
import { getTheme } from '../modules/windows-functions'

const getInitialAppState = () => ({
  channelsMenuOpen: false,
  focusedComponent: 'channels',
  shortcutHelpOpen: false,
  token: localStorage.getItem('token'),
  theme: localStorage.getItem('together-theme') || getTheme() || 'light',
})

const Context = createContext({
  state: getInitialAppState(),
  setState: () => {},
})

const Provider = ({ children }) => {
  const [appState, setAppState] = useState(getInitialAppState())

  const setState = useCallback((newState) => {
    // if (newState.theme) {
    //   localStorage.setItem('together-theme', newState.theme)
    // }
    // setState({ ...appState, ...newState })
  })
  const providerValue = {
    state: appState,
    setState: setAppState,
  }

  return <Context.Provider value={providerValue}>{children}</Context.Provider>
}

export default function () {
  const { state, setState } = useContext(Context)

  return [state, setState]
}

export { Provider }
