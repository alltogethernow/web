export default theme => ({
  item: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  read: {
    opacity: 0.5,
  },
  highlighted: {
    opacity: 1,
    color: theme.palette.primary.contrastText,
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
  },
  text: {
    paddingRight: 0,
    color: 'inherit',
  },
})
