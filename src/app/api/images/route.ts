import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gallery = searchParams.get('gallery') || 'outfit1';
  
  const imagesDirectory = path.join(process.cwd(), 'public/gallery-images', gallery);
  const ROW_WIDTH = 2000;
  
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
        const fileExt = path.extname(file).toLowerCase();
        const isVideo = /\.(mp4|webm|mov)$/i.test(file);
        
        let dimensions = { width: 1920, height: 1080 };
        if (!isVideo) {
          const fileBuffer = fs.readFileSync(filePath);
          dimensions = sizeOf(fileBuffer) || dimensions;
        }
        
        const targetHeight = 400;
        const scaledWidth = Math.round((targetHeight / (dimensions.height || 1080)) * (dimensions.width || 1920));
        
        return {
          id: index + 1,
          src: `/gallery-images/${gallery}/${file}`,
          alt: file.split('.')[0].replace(/-/g, ' '),
          width: dimensions.width || 1920,
          height: dimensions.height || 1080,
          scaledWidth: scaledWidth,
          type: isVideo ? 'video' : 'image'
        };
      });

    // Sort by width but don't randomize
    const sortedByWidth = [...images].sort((a, b) => b.scaledWidth - a.scaledWidth);
    return NextResponse.json(sortedByWidth);
    
  } catch (error) {
    console.error('Error reading gallery images:', error);
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
  }
} 