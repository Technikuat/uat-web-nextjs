import Image from 'next/image';
import parse from 'html-react-parser'

import styles from './Footer.module.scss';

import Container, { ContainerVariant } from '../Container';
import SocialLinks from '../../navigation/SocialLinks/SocialLinks';
import FooterType, { FooterSectionType } from '../../../types/data/FooterType';

import LogoIcon from '../../../public/icons/common/logo.svg';
import LogoDarkIcon from '../../../public/icons/common/logo_dark.svg';
import LinkType from '../../navigation/types/LinkType';
import GenericLink from '../../navigation/GenericLink';
import RichTextType from '../../../types/data/RichTextType';
import { useRouter } from 'next/router';
import classNames from 'classnames';

type Props = {
  data: FooterType | null,
}
const Footer = ({ data }: Props) => {
  const { pathname } = useRouter();
  const site = pathname.split('/')[1];
  const isOposit = (site === 'events' || site === 'about-school');

  return (
    <Container variant={ContainerVariant.Black}>
    <div className={classNames({
      [styles.container]: true,
      [styles.container_yellow]: isOposit,
    })}>
      <div className={classNames({
        [styles.wave]: true,
        [styles.wave_yellow]: isOposit
      })}/>
      <div className={styles.top_container}>
        <div className={styles.sections}>
          {data && data.footer_sections.map((item: FooterSectionType) => (
            <div className={styles.item} key={`footer_section_${item.id}`}>
              <div className={styles.title}>{item.title}</div>
              {item.links.map((link: LinkType) => (
                <GenericLink data={link} key={`link_${link.id}`}>
                  <div className={styles.link}>{link.title}</div>
                </GenericLink>
              ))}
            </div>
          ))}
        </div>
        <div className={classNames({
          [styles.contact]: true,
          [styles.contact_yellow]: isOposit,
        })}>
          {data && data.contact.map((item: RichTextType) => (
            <div key={`contact_${item.id}`}>
              {item.title && <div className={styles.title}>{item.title}</div>}
              <div className={styles.content}>{parse(item.content)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottom_container}>
        <div className={styles.school}>
          <div className={styles.logo}>
            <Image src={isOposit ? LogoDarkIcon :LogoIcon} alt="logo" />
          </div>
          {data && (
            <>
              <span className={styles.name}>{data.school_name}</span>
              <span className={styles.address}>{data.school_address}</span>
            </>
          )}
        </div>
        <div className={styles.social}>
          {data &&  (
            <SocialLinks
              facebook={data.facebook}
              instagram={data.instagram}
              youtube={data.youtube}
              isDark={isOposit}
            />
          )}
        </div>
      </div>
    </div>
    </Container>
  );
};

export default Footer;
