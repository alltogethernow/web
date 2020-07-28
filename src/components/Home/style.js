export default (theme) => ({
  container: {
    display: 'block',
    justifyContent: 'center',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(2),

    '& > *': {
      maxWidth: 600,
      width: '100%',
    },
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  channels: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    '& > *': {
      width: '50%',
    },

    '& .MuiBadge-badge': {
      transform: 'scale(1) translate(0%, -50%)',
    },
  },
})
