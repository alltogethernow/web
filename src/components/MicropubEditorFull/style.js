export default theme => ({
  wrapper: {
    height: '100%',
    overflow: 'auto',
  },
  container: {
    padding: theme.spacing(3),
    maxWidth: 800,
    '& .ql-editor': {
      color:
        theme.palette.mode === 'dark'
          ? theme.palette.primary.contrastText
          : 'inherit',
    },
  },
})
