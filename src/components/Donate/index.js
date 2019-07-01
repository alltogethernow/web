import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Link,
  TextField,
  MenuItem,
  Button,
} from '@material-ui/core'
import Meta from '../Meta'

const Donate = () => {
  const [currency, setCurrency] = useState('$')
  const [amount, setAmount] = useState(5)

  return (
    <Card style={{ margin: 16, maxWidth: 500 }}>
      <Meta title="Donate" />
      <CardHeader title="Donate" />
      <CardContent>
        <Typography paragraph>
          If you'd like to donate money towards the continued development of
          Together that would be extremely nice of you.
        </Typography>
        <Typography paragraph>
          I accept payments via{' '}
          <Link href="https://pay.grant.codes">my website</Link>.
        </Typography>

        <TextField
          select
          label="Currency"
          variant="outlined"
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          style={{ marginRight: 12 }}
        >
          <MenuItem value="€">€ EUR</MenuItem>
          <MenuItem value="$">$ USD</MenuItem>
          <MenuItem value="£">£ GBP</MenuItem>
        </TextField>
        <TextField
          variant="outlined"
          label="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="2"
        />
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          component={Link}
          size="large"
          href={`https://pay.grant.codes/${currency}${amount}/monthly?reason=Together`}
          style={{ color: 'inherit' }}
          target="_blank"
        >
          Start Payment
        </Button>
      </CardActions>
    </Card>
  )
}

export default Donate
