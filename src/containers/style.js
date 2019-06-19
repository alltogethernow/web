const scrollbarWidth = 6
let modifyScrollbars = false

if (navigator && navigator.appVersion) {
  const searches = ['Win', 'UNIX', 'Linux']
  const res = searches.find(search => navigator.appVersion.includes(search))
  if (res) {
    modifyScrollbars = true
  }
}

const scrollbarStyles = theme =>
  modifyScrollbars
    ? {
        '*::-webkit-scrollbar': {
          width: scrollbarWidth,
        },

        '*::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.text.hint,
          borderRadius: scrollbarWidth / 2,
        },
      }
    : {}

export default theme => ({
  appWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  '@global': {
    'a[href^=http]': {
      color:
        theme.palette.type === 'dark'
          ? theme.palette.primary.light
          : theme.palette.primary.main,
    },
    ...scrollbarStyles(theme),
  },
  root: {
    background: theme.palette.background.default,
    flexGrow: 1,
    flexShrink: 1,
    flexWrap: 'nowrap',
    position: 'relative',
    transition: 'transform .3s',
    overflow: 'hidden',
    width: '100%',
  },
  main: {
    background: theme.palette.background.default,
    overflow: 'hidden',
    flexGrow: 1,
    flexShrink: 1,
  },
})
