import React, { Component } from 'react'
import withStyles from '@mui/styles/withStyles';
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import styles from './style'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, newIssueUrl: null }
  }

  componentDidCatch(error, info) {
    console.log('[React error]', { error, info })

    const newIssueUrl = new URL(
      'https://github.com/alltogethernow/web/issues/new'
    )

    newIssueUrl.searchParams.set('template', 'bug_report.md')
    newIssueUrl.searchParams.set('title', 'React Error: ' + error.message)
    newIssueUrl.searchParams.set('labels', 'U0001F41B bug')

    const stackTrace = info && info.componentStack ? info.componentStack : ''
    newIssueUrl.searchParams.set(
      'body',
      `
**Describe the bug**
I encountered a bug on the url ${
        typeof window !== 'undefined'
          ? window.location.href
          : '{copy and paste the url here}'
      }

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Browser(please complete the following information):**
  - OS: [e.g. iOS]
  - Browser [e.g. chrome, safari]
  - Version [e.g. 22]

**More Info**
Add any other context about the problem here.

**Stack Trace**
${stackTrace}
    `
    )
    this.setState({ hasError: true, newIssueUrl: newIssueUrl.href })
  }

  render() {
    const { classes, children } = this.props
    const { hasError, newIssueUrl } = this.state
    return (
      <>
        {children}
        {hasError && (
          <Card className={classes.card}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Uh Oh{' '}
                <span role="img" aria-label="">
                  🙈
                </span>
              </Typography>
              <Typography component="p">
                Something went wrong. If you look in the console you should see
                the error details
              </Typography>
            </CardContent>
            <CardActions>
              <a
                href="https://github.com/alltogethernow/web/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="small" color="primary" variant="contained">
                  Existing issues
                </Button>
              </a>
              {newIssueUrl && (
                <a href={newIssueUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="small" color="primary" variant="contained">
                    Send a bug report
                  </Button>
                </a>
              )}
              <Button
                size="small"
                onClick={() => this.setState({ hasError: false })}
              >
                Close
              </Button>
            </CardActions>
          </Card>
        )}
      </>
    )
  }
}

export default withStyles(styles)(ErrorBoundary)
