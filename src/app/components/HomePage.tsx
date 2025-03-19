import { FaTwitter, FaEnvelope, FaGoogle, FaPencilAlt } from 'react-icons/fa';
import styles from '../page.module.css';
import Image from 'next/image';
import { homeImage } from '../config/homeImage';

type HomePageProps = {
  onEnterGallery: () => void;
};

export default function HomePage({ onEnterGallery }: HomePageProps) {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeImageContainer}>
        <a 
          href="https://twitter.com/morellostorment" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.homeImageLink}
        >
          <Image
            src={homeImage.src}
            alt=""
            width={homeImage.width}
            height={homeImage.height}
            className={styles.homeImage}
            priority
            quality={100}
            loading="eager"
            fetchPriority="high"
          />
        </a>
      </div>
      <div className={styles.socialIcons}>
        <a href="https://twitter.com/morellostorment" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
          <FaTwitter size={24} />
        </a>
        <a href="https://drive.google.com/drive/u/2/folders/1F6mtB-3vQf4QDydUK13sItKcB4Dzu5dd" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
          <FaGoogle size={24} />
        </a>
        <a href="https://skeb.jp/@morellostorment" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
          <FaPencilAlt size={24} />
        </a>
        <a href="mailto:morellostorment@gmail.com" className={styles.iconLink}>
          <FaEnvelope size={24} />
        </a>
      </div>
      <button className={styles.referencesButton} onClick={onEnterGallery}>
        REFERENCES
      </button>
    </div>
  );
} 