import { NextResponse } from 'next/server';
import { apiConfig } from '@/lib/config';
import { API_ROUTE_MAPPINGS } from '@/lib/apiMap';
import { mockEtlJobs } from '@/data/pocData';

/**
 * Next.js Server-Side API Wrapper / Proxy Route
 * Local Endpoint: GET /api/etl/jobs
 * Remote Endpoint: GET http://<POSTGREST_HOST>/etl_jobs?select=*
 */
export async function GET() {
  try {
    const mapping = API_ROUTE_MAPPINGS.etlJobs;
    const targetUrl = mapping.targetUrl();

    if (process.env.ENABLE_LIVE_POSTGREST === 'true') {
      const response = await fetch(targetUrl, {
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Secret': apiConfig.postgrest.internalSecret,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`PostgREST proxy error from ${targetUrl}: ${response.statusText}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(mockEtlJobs);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch ETL jobs via API Wrapper', message: error.message },
      { status: 500 }
    );
  }
}
