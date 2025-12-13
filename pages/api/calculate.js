import { NextResponse } from 'next/server';
import { calculateInvoiceTotals } from '../../utils/invoiceUtils';

export async function POST(request) {
  try {
    const { items } = await request.json();
    
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one item is required' },
        { status: 400 }
      );
    }
    
    const totals = calculateInvoiceTotals(items);
    
    return NextResponse.json({
      success: true,
      ...totals
    });
  } catch (error) {
    console.error('Error calculating invoice totals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate invoice totals' },
      { status: 500 }
    );
  }
}
