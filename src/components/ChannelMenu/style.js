import { darken } from '@material-ui/core/styles/colorManipulator'

export default theme => {
  const dark = theme.palette.type === 'dark'
  const highlight = theme.palette.primary.main
  const background = darken(theme.palette.background.default, dark ? 0.5 : 0.1)

  return {
    drawer: {
      width: theme.together.drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: theme.together.drawerWidth,
    },
    shortcuts: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      outline: 'none',
      '&:focus, &.is-focused': {
        boxShadow: `0 0 4px inset ${highlight}`,
      },
    },
    toolbarSpacer: theme.mixins.toolbar,
    currentItem: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
    addButton: {
      display: 'block',
      textAlign: 'center',
      color: theme.palette.primary.main,
    },
    addForm: {
      borderTop: '1px solid ' + theme.palette.divider,
      padding: theme.spacing(1),
      paddingBottom: 0,
    },
    channelTextRoot: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  }
}
