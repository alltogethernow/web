import { useMutation } from '@apollo/client'
import { MICROPUB_UPDATE } from '../queries'

export default function () {
  const [update] = useMutation(MICROPUB_UPDATE)

  return async (url, updateData) => {
    console.log(url, updateData)
    const {
      data: { micropubUpdate: postUrl },
    } = await update({
      variables: {
        url: url,
        json: JSON.stringify(updateData),
      },
    })
    return postUrl
  }
}
