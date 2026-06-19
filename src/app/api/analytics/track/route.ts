import { NextResponse } from 'next/server';
import { bigquery, DATASET_ID, ACTIVITIES_TABLE_ID } from '@/services/bigQueryClient';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, activityType, category, carbonKg, timestamp } = data;

    if (!userId || !activityType || carbonKg === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const row = {
      user_id: userId,
      activity_type: activityType,
      category: category,
      carbon_kg: carbonKg,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    };

    // Note: We use try/catch to not crash the app if the dataset doesn't exist yet 
    // or if the user hasn't set up BigQuery locally.
    try {
      await bigquery.dataset(DATASET_ID).table(ACTIVITIES_TABLE_ID).insert([row]);
      logger.info('Activity tracked in BigQuery', { userId, activityType });
    } catch (bqError: any) {
      logger.warn('Failed to insert into BigQuery (check credentials/dataset)', { error: bqError.message });
      // We still return 200 so we don't break the client app
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Analytics track error', { error: error.message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
