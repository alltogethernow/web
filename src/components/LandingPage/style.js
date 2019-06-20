export default theme => {
  return {
    container: {
      width: '100%',
      maxWidth: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: theme.spacing(2),
    },
    header: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'stretch',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      overflow: 'hidden',
      textAlign: 'center',
      minHeight: '50vh',
      background: theme.palette.primary.main,
      color: theme.palette.getContrastText(theme.palette.primary.main),
      boxShadow: theme.shadows[3],
    },
    logo: {
      display: 'block',
      width: 100,
      height: 100,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: theme.spacing(2),
    },
    title: {
      lineHeight: 1.2,
      marginBottom: theme.spacing(2),
      color: 'inherit',
    },
    tagline: {
      color: 'inherit',
    },
    login: {
      position: 'fixed',
      top: theme.spacing(2),
      right: theme.spacing(4),
      background: theme.palette.primary.light,
    },
    feature: {
      textAlign: 'center',
      fontSize: 20,
      padding: theme.spacing(2),
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(5),
      [theme.breakpoints.up('sm')]: {
        width: '50%',
      },
    },
    featureIcon: {
      fontSize: 80,
      color: theme.palette.primary.light,
      [theme.breakpoints.up('md')]: {
        fontSize: 100,
      },
    },
  }
}
