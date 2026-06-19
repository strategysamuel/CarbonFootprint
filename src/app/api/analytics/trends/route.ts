import { NextResponse } from 'next/server';
import { bigquery, DATASET_ID, ACTIVITIES_TABLE_ID } from '@/services/bigQueryClient';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    // Note: To avoid SQL injection, do not concatenate user input here.
    const query = `
      SELECT 
        category,
        SUM(carbon_kg) as total_carbon,
        COUNT(*) as activity_count
      FROM \`${DATASET_ID}.${ACTIVITIES_TABLE_ID}\`
      GROUP BY category
      ORDER BY total_carbon DESC
    `;

    try {
      const [rows] = await bigquery.query({ query });
      return NextResponse.json({ success: true, data: rows });
    } catch (bqError: any) {
      logger.warn('Failed to query BigQuery (check credentials/dataset)', { error: bqError.message });
      // Return mocked data if BQ is not set up
      const mockData = [
        { category: 'transportation', total_carbon: -150.5, activity_count: 42 },
        { category: 'energy', total_carbon: -80.2, activity_count: 15 },
        { category: 'food', total_carbon: -45.0, activity_count: 28 },
        { category: 'waste', total_carbon: -20.0, activity_count: 10 },
      ];
      return NextResponse.json({ success: true, data: mockData, mocked: true });
    }
  } catch (error: any) {
    logger.error('Analytics trends error', { error: error.message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
