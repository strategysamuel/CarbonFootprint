import { BigQuery } from '@google-cloud/bigquery';

// Initialize the BigQuery client.
// In production on Cloud Run, it will automatically use the default service account.
// Locally, you need GOOGLE_APPLICATION_CREDENTIALS set or use `gcloud auth application-default login`.

export const bigquery = new BigQuery();

export const DATASET_ID = 'carbon_analytics';
export const ACTIVITIES_TABLE_ID = 'activities_log';
