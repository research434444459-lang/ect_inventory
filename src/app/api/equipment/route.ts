import { NextRequest, NextResponse } from 'next/server';
import { getEquipmentAvailability } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const keyword = searchParams.get('keyword');
    
    const equipment = await getEquipmentAvailability(date || undefined);
    
    // Apply keyword filter if provided
    const filteredEquipment = keyword 
      ? equipment.filter(item => 
          item.name.toLowerCase().includes(keyword.toLowerCase())
        )
      : equipment;
    
    return NextResponse.json(filteredEquipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equipment data' },
      { status: 500 }
    );
  }
}