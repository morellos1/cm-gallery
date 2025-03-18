"use client";

import Image from "next/image";
import styles from './page.module.css';
import { useState, useEffect, useRef } from 'react';
import GalleryTabs from './components/GalleryTabs';
import HomePage from './components/HomePage';

type MediaType = {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  scaledWidth: number;
  type: 'image' | 'video';
};

type GalleryOrders = {
  [key: string]: MediaType[];
};

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

export default function Home() {
  const [media, setMedia] = useState<MediaType[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const [currentTab, setCurrentTab] = useState('outfit1');
  const [galleryOrders, setGalleryOrders] = useState<GalleryOrders>({});
  const [showGallery, setShowGallery] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFirstLoad = useRef<boolean>(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await fetch(`/api/images?gallery=${currentTab}`);
        const data = await res.json() as MediaType[];
        
        if (isFirstLoad.current || !galleryOrders[currentTab]) {
          const shuffledData = shuffleArray(data);
          const organizedData = organizeImages(shuffledData);
          setGalleryOrders(prev => ({
            ...prev,
            [currentTab]: organizedData
          }));
          setMedia(organizedData);
        } else {
          setMedia(galleryOrders[currentTab]);
        }
      } catch (error) {
        console.error('Error loading media:', error);
      }
    };

    if (showGallery) {
      loadGallery();
      
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      }
    }
  }, [currentTab, galleryOrders, showGallery]);

  const handleMediaClick = (item: MediaType) => {
    setSelectedMedia(item);
  };

  const handleCloseModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedMedia(null);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleReferencesClick = () => {
    setShowGallery(true);
    setCurrentTab('outfit1');
  };

  const handleHomeClick = () => {
    setShowGallery(false);
  };

  if (!showGallery) {
    return <HomePage onReferencesClick={handleReferencesClick} />;
  }

  const renderMediaItem = (item: MediaType) => {
    if (item.type === 'video') {
      return (
        <video
          className={styles.image}
          style={{ width: 'auto', height: '400px', objectFit: 'contain' }}
          src={item.src}
          muted
          loop
          autoPlay
          playsInline
        />
      );
    }

    return (
      <Image
        src={item.src}
        alt={item.alt}
        height={400}
        width={item.scaledWidth}
        className={styles.image}
        priority={item.id === 1}
        style={{ width: 'auto' }}
      />
    );
  };

  const renderModalContent = (item: MediaType) => {
    if (item.type === 'video') {
      return (
        <video
          ref={videoRef}
          className={styles.modalImage}
          src={item.src}
          controls
          autoPlay
          loop
          style={{ maxHeight: '90vh', maxWidth: '90vw' }}
        />
      );
    }

    return (
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        className={styles.modalImage}
        priority
      />
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className={styles.container}>
        <header className="py-4 w-full">
          <GalleryTabs 
            currentTab={currentTab} 
            onTabChange={handleTabChange}
            onHomeClick={handleHomeClick}
          />
        </header>
        
        <main className="w-full">
          <div className={styles.grid}>
            {media.map((item) => (
              <div 
                key={item.id} 
                className={styles.imageContainer}
                onClick={() => handleMediaClick(item)}
              >
                {renderMediaItem(item)}
                <div className={styles.overlay} />
              </div>
            ))}
          </div>
        </main>
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
            <div className={styles.modalFileName}>
              {selectedMedia.src.split('/').pop()?.split('.')[0].replace(/-/g, ' ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
