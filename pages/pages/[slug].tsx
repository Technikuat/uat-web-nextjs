import Image from 'next/image';
import Head from 'next/head'

import moment from 'moment';
import 'moment/locale/sk';
import axios from 'axios';
import styles from './pages.module.scss';

import Container, { ContainerVariant } from '../../components/common/Container';
import RichTextSlice from '../../components/slices/RichTextSlice';
import GallerySlice from '../../components/slices/GallerySlice';

import { REVALIDATE_TIME } from '../../consts/app.consts';
import YoutubePlayerSlice from '../../components/slices/YoutubePlayerSlice';
import ButtonLink, { ButtonLinkImageType } from '../../components/navigation/ButtonLink';
import PageType from '../../components/pages/types/PageType';
import { transformLink } from '../../utils/transformLink';
import TeachersCarusel from '../../components/teachers/TeachersCarusel';
import { useApp } from '../../components/context/AppContext';
import { useEffect } from 'react';
import { setLocalizationData } from '../../utils/localizationsUtils';

type PageProps = {
  slug?: string,
  page: PageType | null,
};

export default function Page({ page, ...rest }: PageProps) {
  const { setLocalePaths } = useApp();

  useEffect(() => {
    if (page && page.localizations.length > 0) {
      setLocalizationData(setLocalePaths, page.localizations, '/pages');
    } else {
      setLocalizationData(setLocalePaths, null); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const renderPageSection = (section: any) => {
    switch (section.__component) {
      case 'shared.rich-text-with-title':
        return (
          <div key={`section-rich-text-${section.id}`} className={styles.rich_text}>
            <RichTextSlice data={section}/>
          </div>
        );
      case 'shared.you-tube-player-slice':
        return (
          <div className={styles.player} key={`section-youtube-${section.id}`}>
            <YoutubePlayerSlice data={section}/>
          </div>
        );
      case 'shared.gallery':
        return (
          <div className={styles.gallery} key={`section-gallery-${section.id}`}>
            <GallerySlice data={section} />
          </div>
        );
      case 'navigation.section':
        return (
          <div className={styles.navigation}>
            {section.items.map((item: any) => (
              <div key={`link-=${item.id}`}>
                <ButtonLink
                  imageType={item.__component.includes('download') ? ButtonLinkImageType.Download : ButtonLinkImageType.Arrow}
                  title={item.title}
                  path={item.url || item.path}
                />
              </div>
            ))}
          </div>
        )
      case 'shared.teachers-slice':
        return (
          <div className={styles.teachers}>
            <TeachersCarusel
              teachers={section.teachers}
              isTitle={false}
            />
          </div>
        )
    }
  }
  
  if (!page) {
    return <></>
  }
  return (
    <Container variant={ContainerVariant.White}>
      <Head>
        <title>{page.title}</title>
      </Head>
      {page.cover_image ? (
        <div className={styles.cover_image}>
          <Image
            src={transformLink(page.cover_image.url)}
            alt={page.cover_image.alternativeText}
            layout={'fill'}
            objectFit={'cover'}
            objectPosition={'50% 30%'}
          />
        </div>
      ) : <></>}
      <div className={styles.details_container}>
        {page.title && (
          <div className={styles.title}>
            <h1 className={styles.header}>{page.title}</h1>
          </div>
        )}
        {page.sections
          .reduce((acc, item) => {
            if (item.__component.includes('navigation')) {
              if (acc.length > 0 && acc[acc.length - 1].__component.includes('navigation')) {
                acc[acc.length - 1] = {
                  ...acc[acc.length - 1],
                  items: [...acc[acc.length - 1].items, item]
                }
                return acc
              }
              return [
                ...acc,
                {
                  __component: 'navigation.section',
                  items: [item],
                }
              ];
            }
            return [...acc, item];
          }, [])
          .map((item: any) => renderPageSection(item))
        }
      </div>
    </Container>
  )
};

type StaticPathsPropsType = {
  locales: Array<string>,
};

export async function getStaticPaths({ locales }: StaticPathsPropsType) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const url = `${baseURL}:${port}/pages?${locales.map((locale: string, idx: number) => {
    return `_locale=${locale}${idx < locales.length - 1 ? '&' : ''}`;
  }).join('')}`;
  
  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
  const pages = res.data;
  return {
    paths: pages.map((item: PageType) => (
      { params: { slug: item.slug, page: item } }
    )),
    fallback: 'blocking',
  };
};

type StaticPropsType = {
  locale: string,
  params: any,
};

export async function getStaticProps({ locale, params }: StaticPropsType) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const port = process.env.NEXT_PUBLIC_API_PORT;
  const url = `${baseURL}:${port}/pages?_locale=${locale}&slug=${params.slug}`;
  let res 
  try {
    res = await axios(url);
  } catch (e) {
    return {
      props: {},
      revalidate: REVALIDATE_TIME,
    };
  }
  const pages = res.data;
  return {
    props: {
      page: pages && pages.length > 0 ? pages[0] : null,
    },
    revalidate: REVALIDATE_TIME,
  }
};