import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'reviews.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return an empty array
      return NextResponse.json([]);
    }
    console.error('Error reading reviews:', error);
    return NextResponse.json({ error: 'Error reading reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newReview = await request.json();
    let reviews = [];
    
    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      reviews = JSON.parse(fileContents);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // File doesn't exist, we'll create it
    }
    
    reviews.unshift(newReview);
    await fs.writeFile(filePath, JSON.stringify(reviews, null, 2));
    
    return NextResponse.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json({ error: 'Error saving review' }, { status: 500 });
  }
}