"use client";

import Image from "next/image";
import styles from './page.module.css';
import { useState, useEffect, useRef } from 'react';
import GalleryTabs from './components/GalleryTabs';
import HomePage from './components/HomePage';

interface MediaType {
  id: number;
  src: string;
  width: number;
  height: number;
  scaledWidth: number;
  isVideo: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function findBestFit(
  remainingWidth: number,
  availableImages: MediaType[],
  minWidth: number
) {
  // First, look for images that fill 90% or more of the space
  const perfectFits = availableImages.filter(img => 
    img.scaledWidth <= remainingWidth && 
    img.scaledWidth >= remainingWidth * 0.9
  );

  if (perfectFits.length > 0) {
    return perfectFits[Math.floor(Math.random() * perfectFits.length)];
  }

  // If no perfect fits, look for images that would fit reasonably well
  const goodFits = availableImages.filter(img => 
    img.scaledWidth <= remainingWidth && 
    img.scaledWidth >= Math.min(remainingWidth * 0.7, minWidth)
  );

  if (goodFits.length > 0) {
    return goodFits[Math.floor(Math.random() * goodFits.length)];
  }

  // If no good fits, find the largest image that would fit
  const possibleFits = availableImages.filter(img => img.scaledWidth <= remainingWidth);
  return possibleFits.length > 0 ? possibleFits[0] : null;
}

function organizeImages(images: MediaType[]): MediaType[] {
  const ROW_WIDTH = 2000;
  const minWidth = Math.min(...images.map(img => img.scaledWidth));

  let availableImages = [...images];
  const finalOrder = [];

  while (availableImages.length > 0) {
    const currentRow = [];
    let rowWidth = 0;
    let rowComplete = false;

    // Start with the first available image
    const firstImage = availableImages[0];
    currentRow.push(firstImage);
    rowWidth += firstImage.scaledWidth;
    availableImages = availableImages.filter(img => img.id !== firstImage.id);

    while (!rowComplete && availableImages.length > 0) {
      const remainingWidth = ROW_WIDTH - rowWidth - (currentRow.length * 32);
      const bestFit = findBestFit(remainingWidth, availableImages, minWidth);

      if (bestFit) {
        currentRow.push(bestFit);
        rowWidth += bestFit.scaledWidth;
        availableImages = availableImages.filter(img => img.id !== bestFit.id);
      } else {
        rowComplete = true;
      }

      if (rowWidth >= ROW_WIDTH * 0.9) {
        rowComplete = true;
      }
    }

    finalOrder.push(...currentRow);
  }

  return finalOrder;
}

function MediaItem({ src, width, height, isVideo }: MediaType) {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: width / height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isVideo) {
    return (
      <div 
        ref={containerRef}
        style={containerStyle}
        className={`${styles.mediaWrapper} ${!isLoaded ? styles.loading : ''}`}
      >
        <video
          src={shouldLoad ? src : undefined}
          controls={false}
          loop
          muted
          playsInline
          className={`${styles.media} ${styles.video} ${isLoaded ? styles.loaded : ''}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onLoadedData={() => setIsLoaded(true)}
        />
        {!isLoaded && <div className={styles.placeholder} />}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={containerStyle}
      className={`${styles.mediaWrapper} ${!isLoaded ? styles.loading : ''}`}
    >
      {shouldLoad && (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`${styles.media} ${isLoaded ? styles.loaded : ''}`}
          priority={false}
          loading="lazy"
          quality={75}
          onLoad={() => setIsLoaded(true)}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPjA+OjU1RUVHSkdKTUtLR0pHRkpLRktLR0r/2wBDAR"
        />
      )}
      {!isLoaded && <div className={styles.placeholder} />}
    </div>
  );
}

export default function Home() {
  const [images, setImages] = useState<MediaType[]>([]);
  const [selectedTab, setSelectedTab] = useState('outfit1');
  const [showHome, setShowHome] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const [imageCache, setImageCache] = useState<Record<string, MediaType[]>>({});
  const [isModalLoading, setIsModalLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFirstLoad = useRef<boolean>(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        // Check if we have cached images for this tab
        if (imageCache[selectedTab]) {
          setImages(imageCache[selectedTab]);
          return;
        }

        const res = await fetch(`/api/images?gallery=${selectedTab}`);
        const data = await res.json() as MediaType[];
        
        let organizedData: MediaType[];
        if (isFirstLoad.current) {
          const shuffledData = shuffleArray(data);
          organizedData = organizeImages(shuffledData);
          isFirstLoad.current = false;
        } else {
          organizedData = organizeImages(data);
        }

        // Cache the organized images for this tab
        setImageCache(prev => ({
          ...prev,
          [selectedTab]: organizedData
        }));
        setImages(organizedData);
      } catch (error) {
        console.error('Error loading media:', error);
      }
    };

    if (!showHome) {
      loadGallery();
    }
  }, [selectedTab, showHome, imageCache]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Reset cache when returning to home to ensure fresh content on next visit
  const handleHomeClick = () => {
    setShowHome(true);
    setImageCache({});
    isFirstLoad.current = true;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCloseModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedMedia(null);
    setIsModalLoading(true); // Reset loading state when closing
  };

  const handleMediaClick = (item: MediaType) => {
    setSelectedMedia(item);
    setIsModalLoading(true); // Set loading state when opening new media
  };

  const renderModalContent = (item: MediaType) => {
    const filename = item.src.split('/').pop()?.split('.')[0].replace(/-/g, ' ');

    if (item.isVideo) {
      return (
        <>
          <div className={styles.modalVideoContainer}>
            {isModalLoading && <div className={styles.modalSpinner} />}
            <video
              ref={videoRef}
              className={`${styles.modalImage} ${styles.modalVideo}`}
              src={item.src}
              controls={false}
              autoPlay
              loop
              muted
              style={{ maxHeight: '90vh', maxWidth: '90vw', opacity: isModalLoading ? 0 : 1 }}
              onLoadedData={() => setIsModalLoading(false)}
            />
          </div>
          {!isModalLoading && (
            <a 
              href={`https://x.com/${filename}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.modalFileName}
              onClick={e => e.stopPropagation()}
            >
              {filename}
            </a>
          )}
        </>
      );
    }

    return (
      <>
        {isModalLoading && <div className={styles.modalSpinner} />}
        <Image
          src={item.src}
          alt=""
          width={item.width}
          height={item.height}
          className={styles.modalImage}
          style={{ opacity: isModalLoading ? 0 : 1 }}
          priority
          onLoad={() => setIsModalLoading(false)}
        />
        {!isModalLoading && (
          <a 
            href={`https://x.com/${filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.modalFileName}
            onClick={e => e.stopPropagation()}
          >
            {filename}
          </a>
        )}
      </>
    );
  };

  if (showHome) {
    return <HomePage onEnterGallery={() => setShowHome(false)} />;
  }

  return (
    <div className={styles.container}>
      <GalleryTabs
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        onHomeClick={handleHomeClick}
      />
      <div className={styles.grid}>
        {images.map((item) => (
          <div
            key={item.id}
            className={styles.gridItem}
            style={{ width: `${item.scaledWidth}px` }}
            onClick={() => handleMediaClick(item)}
          >
            <MediaItem {...item} />
          </div>
        ))}
      </div>
      {selectedMedia && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseModal}
        >
          <div 
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            {renderModalContent(selectedMedia)}
          </div>
        </div>
      )}
    </div>
  );
}
