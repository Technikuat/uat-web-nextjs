import ImageType from '../../common/types/ImageType'
import UATGalleryType from './UATGalleryType'

type GalleriesInfoType = {
  title: string
  subtitle: string
  description: string
  image: ImageType
  galleries_uats: UATGalleryType[]
}

export default GalleriesInfoType
