import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const reviews = await kv.get('reviews') || [];
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return NextResponse.json({ error: 'Error reading reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newReview = await request.json();
    let reviews = await kv.get('reviews') || [];
    
    reviews.unshift(newReview);
    await kv.set('reviews', JSON.stringify(reviews));
    
    return NextResponse.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json({ error: 'Error saving review' }, { status: 500 });
  }
}
