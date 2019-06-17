const buttonSize = 56

export default theme => ({
  container: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    right: 0,
    bottom: 0,
    padding: theme.spacing(2),
    maxWidth: 'calc(100vw - 90px)',
    maxHeight: '100vh',
    zIndex: theme.zIndex.appBar,
  },
  card: {
    width: 360,
    maxWidth: '100%',
    maxHeight: `calc(100vh - ${theme.spacing(6) + buttonSize}px)`,
    overflow: 'auto',
    marginBottom: theme.spacing(2),
  },
  fabButton: {
    width: 56,
    height: 56,
  },
  preview: {
    padding: 0,
    flexDirection: 'column',
  },
  actions: {
    boxSizing: 'border-box',
    background: theme.palette.background.paper,
    // borderTop: '1px solid ' + theme.palette.text.disabled,
    borderTop: '1px solid ' + theme.palette.divider,
    position: 'sticky',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 9999, // To appear on top of maps
  },
})
