import { NextResponse } from 'next/server';
import { apiConfig } from '@/lib/config';
import { API_ROUTE_MAPPINGS } from '@/lib/apiMap';
import { mockPosDailyTrend } from '@/data/pocData';

/**
 * Next.js Server-Side API Wrapper / Proxy Route
 * Local Endpoint: GET /api/get_order_today
 * Remote Endpoint: GET http://<POSTGREST_HOST>/rpc/get_order_today
 */
export async function GET() {
  try {
    const mapping = API_ROUTE_MAPPINGS.getOrderToday;
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
        throw new Error(`PostgREST error from ${targetUrl}: ${response.statusText}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    // Fallback response for DEV simulation mode
    const todayTrend = mockPosDailyTrend[mockPosDailyTrend.length - 1];
    return NextResponse.json({
      status: 'success',
      mapping: {
        localPath: mapping.localPath,
        remoteEndpoint: mapping.remoteEndpoint,
        targetUrl,
      },
      data: {
        date: todayTrend.date,
        totalRevenue: todayTrend.revenue,
        totalOrders: todayTrend.transactions,
        currency: 'USD',
        environment: apiConfig.appEnv,
      },
      source: 'Next.js API Wrapper (BFF Proxy)',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch orders from internal PostgREST proxy', message: error.message },
      { status: 500 }
    );
  }
}
