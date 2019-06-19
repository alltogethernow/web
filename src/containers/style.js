const scrollbarWidth = 6

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

    '*::-webkit-scrollbar': {
      width: scrollbarWidth,
    },

    '*::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.text.hint,
      borderRadius: scrollbarWidth / 2,
    },
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
