import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import sizeOf from 'image-size';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gallery = searchParams.get('gallery') || 'outfit1';
  
  const imagesDirectory = path.join(process.cwd(), 'public/gallery-images', gallery);
  
  try {
    if (!fs.existsSync(imagesDirectory)) {
      fs.mkdirSync(imagesDirectory, { recursive: true });
      return NextResponse.json([]); 
    }
    
    const imageFiles = fs.readdirSync(imagesDirectory);
    
    const images = imageFiles
      .filter(file => /\.(jpg|jpeg|png|gif|mp4|webm|mov)$/i.test(file))
      .map((file, index) => {
        const filePath = path.join(imagesDirectory, file);
        const isVideo = /\.(mp4|webm|mov)$/i.test(file);
        
        let dimensions = { width: 1920, height: 1080 };
        try {
          if (!isVideo) {
            const fileBuffer = fs.readFileSync(filePath);
            dimensions = sizeOf(fileBuffer);
          }
        } catch (error) {
          console.error(`Error getting dimensions for ${file}:`, error);
        }

        const aspectRatio = dimensions.width / dimensions.height;
        const targetHeight = 400;
        const scaledWidth = Math.round(targetHeight * aspectRatio);

        return {
          id: index,
          src: `/gallery-images/${gallery}/${file}`,
          alt: file.split('.')[0].replace(/-/g, ' '),
          width: dimensions.width,
          height: dimensions.height,
          scaledWidth,
          isVideo
        };
      });

    // Sort by width but don't randomize
    const sortedByWidth = [...images].sort((a, b) => b.scaledWidth - a.scaledWidth);
    return NextResponse.json(sortedByWidth);
  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json({ error: 'Error processing images' }, { status: 500 });
  }
} 