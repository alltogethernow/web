import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

const ShortcutTable = ({ title, keys }) => (
  <div>
    <Typography
      variant="subtitle1"
      style={{ borderBottom: '1px solid', paddingLeft: 24 }}
    >
      {title}
    </Typography>
    <Table style={{ marginBottom: 40 }}>
      <TableBody>
        {keys.map(key => (
          <TableRow key={`key-row-${title}-${key.name}`}>
            <TableCell style={{ width: '15em' }}>{key.name}</TableCell>
            <TableCell>
              {key.shortcuts.map(key => (
                <Chip
                  key={`key-row-${title}-${key.name}-key-${key}`}
                  label={key}
                  style={{ marginRight: 10 }}
                />
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)

export default ShortcutTable
