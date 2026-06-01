/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Standard Toolkit
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          A comprehensive collection of TypeScript utilities, React components,
          and development tools for building modern web applications.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/docs/getting-started"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Get Started
          </a>
          <a
            href="https://github.com/gohypergiant/standard-toolkit"
            className="text-sm font-semibold leading-6"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
