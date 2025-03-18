import { FaTwitter, FaEnvelope, FaGoogle, FaPencilAlt } from 'react-icons/fa';
import styles from '../page.module.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';

type HomePageProps = {
  onEnterGallery: () => void;
};

type HomeImage = {
  src: string;
  width: number;
  height: number;
};

export default function HomePage({ onEnterGallery }: HomePageProps) {
  const [homeImage, setHomeImage] = useState<HomeImage | null>(null);

  useEffect(() => {
    fetch('/api/images?gallery=home')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
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
            alt=""
            width={homeImage.width}
            height={homeImage.height}
            className={styles.homeImage}
            priority
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPjA+OjU1RUVHSkdKTUtLR0pHRkpLRktLR0r/2wBDAR"
          />
        </div>
      )}
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