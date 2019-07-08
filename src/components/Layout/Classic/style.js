export default theme => ({
  wrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    outline: 'none',
    zIndex: 1,
  },
  previewColumn: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    overscrollBehaviorY: 'contain',
    borderRight: '1px solid ' + theme.palette.divider,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      width: 250,
    },
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
    [theme.breakpoints.up('lg')]: {
      width: 400,
    },
  },
  postColumn: {
    flexGrow: 1,
    // overflow: 'auto',
    position: 'absolute',
    width: '100%',
    height: '100%',
    // iOS hack thing
    overflowY: 'scroll',
    overscrollBehaviorY: 'contain',
    '-webkit-overflow-scrolling': 'touch',
    [theme.breakpoints.up('sm')]: {
      position: 'relative',
    },
  },
  postShortcuts: {
    height: '100%',
  },
  loadMore: {
    width: '100%',
  },
  post: {
    margin: 0,
    minHeight: 'calc(100% - 48px)',
    maxWidth: 700,
    boxShadow: 'none',
    paddingBottom: 48, // This is kind of a hack because safari position fixed is broken
  },
  postNav: {
    top: 'auto',
    width: '100%',
    left: 0,
    bottom: 0,
    maxWidth: 700,
    boxShadow: 'none',
  },
  closePost: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
})
