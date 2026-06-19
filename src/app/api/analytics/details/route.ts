import { NextRequest, NextResponse } from 'next/server';
import { bigquery, DATASET_ID, ACTIVITIES_TABLE_ID } from '@/services/bigQueryClient';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json({ error: 'Category parameter is required' }, { status: 400 });
    }

    // Query to fetch specific activities for the category
    // Using parameterized queries to prevent SQL injection
    const query = `
      SELECT 
        description,
        carbon_kg,
        DATE(created_at) as date,
        type
      FROM \`${DATASET_ID}.${ACTIVITIES_TABLE_ID}\`
      WHERE category = @category
      ORDER BY created_at DESC
      LIMIT 50
    `;

    try {
      const [rows] = await bigquery.query({ 
        query,
        params: { category }
      });
      return NextResponse.json({ success: true, data: rows });
    } catch (bqError: any) {
      logger.warn('Failed to query BigQuery for details (check credentials/dataset)', { error: bqError.message });
      
      // Return mocked data if BQ is not set up
      const mockDataMap: Record<string, any[]> = {
        transportation: [
          { description: 'Taking the train to work', carbon_kg: -4.5, date: '2023-10-15', type: 'save' },
          { description: 'Carpooling with colleagues', carbon_kg: -3.2, date: '2023-10-14', type: 'save' },
          { description: 'Driving to grocery store', carbon_kg: 2.1, date: '2023-10-13', type: 'emit' },
          { description: 'Biking to the gym', carbon_kg: -1.5, date: '2023-10-12', type: 'save' },
        ],
        energy: [
          { description: 'Installed LED bulbs', carbon_kg: -5.0, date: '2023-10-15', type: 'save' },
          { description: 'Air conditioning running all day', carbon_kg: 8.5, date: '2023-10-14', type: 'emit' },
          { description: 'Solar panel generation', carbon_kg: -12.4, date: '2023-10-13', type: 'save' },
        ],
        food: [
          { description: 'Plant-based lunch', carbon_kg: -2.1, date: '2023-10-15', type: 'save' },
          { description: 'Beef dinner', carbon_kg: 6.8, date: '2023-10-14', type: 'emit' },
          { description: 'Locally sourced groceries', carbon_kg: -1.5, date: '2023-10-13', type: 'save' },
        ],
        waste: [
          { description: 'Recycled cardboard boxes', carbon_kg: -1.2, date: '2023-10-15', type: 'save' },
          { description: 'Composted kitchen waste', carbon_kg: -2.5, date: '2023-10-14', type: 'save' },
          { description: 'Used single-use plastics', carbon_kg: 1.8, date: '2023-10-12', type: 'emit' },
        ],
      };

      const mockData = mockDataMap[category.toLowerCase()] || [
        { description: 'Generic activity log', carbon_kg: -1.0, date: '2023-10-15', type: 'save' }
      ];

      return NextResponse.json({ success: true, data: mockData, mocked: true });
    }
  } catch (error: any) {
    logger.error('Analytics details error', { error: error.message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
