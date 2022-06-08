import { useQuery } from '@apollo/client'
import { GET_CHANNELS } from '../queries'

const useChannels = () => {
  const res = useQuery(GET_CHANNELS, {
    pollInterval: 60 * 1000,
  })
  const channels = res?.data?.channels ?? []
  return { channels, ...res }
}

export default useChannels
