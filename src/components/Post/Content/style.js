export default theme => ({
  content: {
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
    '& blockquote': {
      borderLeft: '4px solid ' + theme.palette.primary.main,
      paddingLeft: theme.spacing(2),
      marginLeft: theme.spacing(2),
      '& blockquote': {
        marginLeft: theme.spacing(1),
      },
    },
    // Emoji images'
    '& img[src^="https://s.w.org/images/core/emoji"]': {
      width: '1em',
    },
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
})
