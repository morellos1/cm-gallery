import { FaTwitter, FaEnvelope, FaGoogle, FaPencilAlt } from 'react-icons/fa';
import styles from '../page.module.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';

type HomePageProps = {
  onReferencesClick: () => void;
};

type HomeImage = {
  src: string;
  width: number;
  height: number;
};

export default function HomePage({ onReferencesClick }: HomePageProps) {
  const [homeImage, setHomeImage] = useState<HomeImage | null>(null);

  useEffect(() => {
    fetch('/api/images?gallery=home')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setHomeImage(data[0]);
        }
      })
      .catch(error => console.error('Error loading home image:', error));
  }, []);

  return (
    <div className={styles.homeContainer}>
      {homeImage && (
        <div className={styles.homeImageContainer}>
          <Image
            src={homeImage.src}
            alt="Home"
            width={homeImage.width}
            height={homeImage.height}
            className={styles.homeImage}
            priority
          />
        </div>
      )}
      
      <div className={styles.socialIcons}>
        <a href="https://x.com/morellostorment" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
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

      <button onClick={onReferencesClick} className={styles.referencesButton}>
        REFERENCES
      </button>
    </div>
  );
} 