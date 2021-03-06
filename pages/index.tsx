import Head from 'next/head'
import { useRouter } from 'next/router';
import ReactResizeDetector from 'react-resize-detector';
import styles from './Home.module.scss';

import { Strings, getString } from '../locales';

import Container, { ContainerVariant } from '../components/common/Container';
import ImageType from '../components/common/types/ImageType';
import { YouTubeVideoWithTextType } from '../components/slices/types/YouTubeVideoType';
import NewsType from '../components/news/types/NewsType';
import TextWithImageType from '../components/slices/types/TextWithImageType';
import FieldOfStudyType from '../components/fields/types/FieldOfStudyType';

import HeaderSlice from '../components/slices/HeaderSlice';
import YoutubePlayerWithTextSlice from '../components/slices/YoutubePlayerWithTextSlice';
import TextWithImageSlice from '../components/slices/TextWithImageSlice';
import NewsSlice from '../components/slices/NewsSlice';
import FieldOfStudyCarusel from '../components/fields/FieldOfStudyCarusel';
import FestivalType from '../components/festivals/types/FestivalType';
import FestivalsSlice from '../components/slices/FestivalsSlice';
import GalleriesInfoType from '../components/slices/types/GalleriesInfoType';
import UATGalleriesSlice from '../components/slices/UATGalleriesSlice';
import { GalleryEventType } from '../components/galleries/types/GalleryEventType';
import axios from 'axios';
import { REVALIDATE_TIME } from '../consts/app.consts';
import SocialLinkType from '../types/data/SocialLinkType';

type HomePageProps = {
  cover_image: ImageType,
  logo: ImageType,
  festivals: Array<FestivalType>,
  fields_of_studies: Array<FieldOfStudyType>,
  galleries: GalleriesInfoType,
  galleryEvents: Array<GalleryEventType>,
  news: Array<NewsType>,
  importantNews: Array<NewsType>,
  subtitle: string,
  text_with_image: Array<TextWithImageType>,
  title: string,
  video_with_text: YouTubeVideoWithTextType,
  social: {
    facebook: SocialLinkType,
    instagram: SocialLinkType,
    youtube: SocialLinkType,
  }
};

export default function Home({
    cover_image,
    logo,
    festivals,
    fields_of_studies,
    galleries,
    galleryEvents,
    news,
    importantNews,
    subtitle,
    text_with_image,
    title,
    video_with_text,
    social,
}: HomePageProps) {
  const router = useRouter();
  const renderTextWithImageSlices = () => {
    if (text_with_image && text_with_image.length > 1) {
      return (
        <ReactResizeDetector>
          {({ width }) => text_with_image
          .slice(1, text_with_image.length)
          .map((item: TextWithImageType, index: number) => (
            <TextWithImageSlice
              key={`text-with-image-${item.id}`}
              data={item}
              // extraTextTopSpace={index === 0 && width && width > 1300 ? 0 : (index === 0 ? 140 : 0)}
              // extraTextBottomSpace={index === text_with_image.length - 2 && width && width >1100 ? 200: 0}
            />
        ))}
        </ReactResizeDetector>
      )
    }
    return <></>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{getString(router.locale, Strings.HOME_PAGE_TITLE)}</title>
      </Head>
      <Container variant={ContainerVariant.Black} isHigh>
        {(title && subtitle) ? (
          <HeaderSlice
            title={title}
            subtitle={subtitle}
            image={cover_image}
            logo={logo}
            news={importantNews}
            facebook={social.facebook}
            instagram={social.instagram}
            youtube={social.youtube}
          />
        ) : <></>}
        <div className={styles.video}>
          {video_with_text ? <YoutubePlayerWithTextSlice data={video_with_text}/> : <></>}
        </div>
        {(text_with_image && text_with_image.length > 0) ? (
          <div className={styles.first_text}>
            <ReactResizeDetector>
              {({ width }) => (
                <TextWithImageSlice
                  data={text_with_image[0]}
                  // extraBottomSpace={!width || (width > 800) ? 260 : 0}
                  variant={ContainerVariant.Black}
                />
              )}
            </ReactResizeDetector>
          </div>
          ) : <></>}
        <div className={styles.fields}>
          {fields_of_studies ? <FieldOfStudyCarusel fields={fields_of_studies} /> : <></>}
        </div>
      </Container>
      <Container variant={ContainerVariant.White}>
        {renderTextWithImageSlices()}
      </Container>
      <Container variant={ContainerVariant.Black}>
        <FestivalsSlice festivals={festivals} variant={ContainerVariant.Black}/>
      </Container>
      <Container variant={ContainerVariant.Black}>
        {galleries ? <TextWithImageSlice
          data={{
            title: galleries.title,
            subtitle: galleries.subtitle,
            content: galleries.description,
            image: galleries.image,
            left_side_image: true,
          }}
          variant={ContainerVariant.Black}
        /> : <></>}
      </Container>
      <Container variant={ContainerVariant.White}>
        {galleries ? <UATGalleriesSlice
          galleries={galleries.galleries_uats}
          events={galleryEvents}
        /> : <></>}
      </Container>
      <Container variant={ContainerVariant.Orange}>
        {news ? <NewsSlice news={news}/> : <></>}
      </Container>
    </div>
  )
}

type StaticPropsType = {
  locale: string,
};


export async function getStaticProps({ locale }: StaticPropsType) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const url = `${baseURL}:${port}/home-page?_locale=${locale}`;

  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      props: {},
      revalidate: REVALIDATE_TIME,
    };
  }
  const homeData = res.data;

  return {
    props: {
      ...homeData,
    },
    revalidate: REVALIDATE_TIME,
  }
}
