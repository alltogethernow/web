import PhotoIcon from '@mui/icons-material/PhotoCamera'
import CheckinIcon from '@mui/icons-material/LocationOn'
import AllIcon from '@mui/icons-material/Chat'
import ClassicIcon from '@mui/icons-material/ChromeReaderMode'

const layouts = [
  {
    id: 'timeline',
    name: 'Timeline',
    icon: AllIcon,
    filter: (post) => true,
  },
  {
    id: 'classic',
    name: 'Classic',
    icon: ClassicIcon,
    filter: (post) => true,
  },
  {
    id: 'gallery',
    name: 'Gallery',
    icon: PhotoIcon,
    filter: (post) => post.photo,
  },
  {
    id: 'map',
    name: 'Map',
    icon: CheckinIcon,
    filter: (post) =>
      (post.location && post.location.latitude && post.location.longitude) ||
      (post.checkin && post.checkin.latitude && post.checkin.longitude),
  },
]

export default layouts
