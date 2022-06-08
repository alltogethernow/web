import React from 'react'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'
import useLocalState from '../../hooks/use-local-state'
import theme from './style'

const Theme = ({ children }) => {
  const [localState] = useLocalState()
  const muiTheme = theme(localState.theme)

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
export default Theme
