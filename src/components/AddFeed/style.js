const smallVertical = '@media (max-height: 600px)'

export default theme => ({
  container: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    right: 0,
    bottom: 0,
    padding: theme.spacing(2),
    paddingTop: 0,
    maxWidth: 'calc(100vw - 90px)',
    maxHeight: '100vh',
    zIndex: theme.zIndex.appBar,
    '&.is-open': {
      [smallVertical]: {
        zIndex: theme.zIndex.modal + 1,
      },
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: 360,
    flexGrow: 1,
    maxWidth: '100%',
    overflow: 'hidden',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  cardInner: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'auto',
    paddingTop: 0,
    paddingBottom: 0,
  },
  toolbarSpacer: {
    ...theme.mixins.toolbar,
    [smallVertical]: {
      display: 'none',
    },
  },
  fabButton: {
    flexShrink: 0,
  },
  searchForm: {
    flexShrink: 0,
    borderBottom: '1px solid ' + theme.palette.divider,
    padding: theme.spacing(2),
  },
  result: {
    '&.is-selected': {
      position: 'sticky',
      top: 0,
      width: '100%',
      zIndex: 1,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  resultText: {
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  preview: {
    zIndex: 0,
    padding: 0,
    flexDirection: 'column',
  },
  actions: {
    flexShrink: 0,
    boxSizing: 'border-box',
    borderTop: '1px solid ' + theme.palette.divider,
    justifyContent: 'flex-end',
  },
})
