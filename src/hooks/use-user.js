import { useQuery, useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'
import { GET_USER, SET_USER_OPTION } from '../queries'

export default function () {
  const { enqueueSnackbar } = useSnackbar()
  const query = useQuery(GET_USER)
  const [setUserOption] = useMutation(SET_USER_OPTION)

  const user = query?.data?.user

  const setOption = async (key, value) => {
    const val = typeof value === 'object' ? JSON.stringify(value) : value
    const res = await setUserOption({
      variables: { key, value: val },
      optimisticResponse: {
        __typename: 'Mutation',
        setUserOption: true,
      },
      update: (cache, _) => {
        // Read the data from our cache for this query.
        const data = cache.readQuery({
          query: GET_USER,
        })
        const update = { ...data }
        // Reorder the channels
        update.user.settings[key] = value
        // Write our data back to the cache.
        cache.writeQuery({ query: GET_USER, data: update })
      },
    })

    if (res.error) {
      console.error('[Error setting user option]', res.error)
      enqueueSnackbar('Error setting option', { variant: 'error' })
    }

    return res
  }

  return { user, setOption, ...query }
}
