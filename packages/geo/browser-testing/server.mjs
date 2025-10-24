// __private-exports
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
 * Simple static file server for browser compatibility testing
 *
 * Serves files from the package root directory:
 * - /browser-testing/positive.html - Browser compatibility test
 * - /dist/* - The built package files
 * - /node_modules/geodesy/* - Geodesy library files for import map
 *
 * @module server
 */

import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Package root directory (one level up from browser-testing/)
 * @constant {string}
 */
const PACKAGE_ROOT = join(__dirname, '..');

/**
 * HTTP server port
 * @constant {number}
 */
const PORT = 8765;

/**
 * Start the HTTP server for serving test files
 *
 * Creates a simple HTTP server that serves static files from the package root.
 * Automatically handles content-type headers for HTML, JavaScript, JSON, and
 * source map files.
 *
 * @returns {import('node:http').Server} HTTP server instance
 *
 * @example
 * const server = startServer();
 * // ... run tests ...
 * server.close();
 */
export function startServer() {
  const server = createServer(async (req, res) => {
    try {
      // Handle root path and directory paths
      let requestPath = req.url;

      if (requestPath === '/' || requestPath === '/browser-testing/') {
        requestPath = '/browser-testing/index.html';
      }

      const filePath = join(PACKAGE_ROOT, requestPath);
      const content = await readFile(filePath);

      // Set appropriate content type
      const ext = extname(filePath);
      const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.map': 'application/json',
      };

      res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
      res.end(content);
    } catch {
      res.statusCode = 404;
      res.end('Not found');
    }
  });

  console.log(`HTTP server started on port ${PORT}\n`);
  server.listen(PORT);

  return server;
}

export { PORT };
