/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * Sample API Route for Next.js App Router
 *
 * This file demonstrates basic API endpoint patterns for the launchpad starter.
 *
 * To use this route, access it at `/api` endpoint
 *
 * Learn more: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// GET /api - Basic health check endpoint
export function GET() {
  return NextResponse.json(
    {
      message: 'Launchpad API is running',
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}

// POST /api - Example POST endpoint with request handling
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation example
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Simulate processing
    const response = {
      message: `Hello, ${body.name}!`,
      received: body,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 },
    );
  }
}
