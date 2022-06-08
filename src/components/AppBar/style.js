export default theme => ({
  root: {
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    background:
      theme.palette.mode === 'dark'
        ? theme.palette.secondary.dark
        : theme.palette.primary.main,
  },
  rootAboveDrawer: {
    zIndex: theme.zIndex.modal + 1,
  },
  title: {
    flex: 1,
    fontWeight: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  menuButton: {
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block',
      marginLeft: -16,
      marginRight: 0,
    },
  },
  menuAction: {
    color: theme.palette.primary.contrastText,
  },
  menuAvatar: {
    color: theme.palette.primary.contrastText,
    marginLeft: 7,
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      width: 34,
      height: 34,
    },
  },
  menuItem: {
    display: 'block',
    outline: 'none',
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  layoutSwitcher: {
    flexDirection: 'row',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.dark,
    marginBottom: -8,
    marginTop: 8,
  },
})
