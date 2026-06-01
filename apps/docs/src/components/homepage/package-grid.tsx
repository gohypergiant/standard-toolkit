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

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Package {
  name: string;
  description: string;
  section: 'toolkits' | 'packages' | 'tooling';
  slug: string;
}

const packages: Package[] = [
  // Toolkits
  {
    name: 'Design Foundation',
    description: 'Core design tokens and Tailwind configuration',
    section: 'toolkits',
    slug: 'design-foundation',
  },
  {
    name: 'Design Toolkit',
    description: 'React components built with React Aria Components',
    section: 'toolkits',
    slug: 'design-toolkit',
  },
  {
    name: 'Map Toolkit',
    description: 'Mapping and geospatial visualization utilities',
    section: 'toolkits',
    slug: 'map-toolkit',
  },
  // Packages
  {
    name: 'Bus',
    description: 'Event bus library for cross-context communication',
    section: 'packages',
    slug: 'bus',
  },
  {
    name: 'Constants',
    description: 'Collection of commonly used constant values',
    section: 'packages',
    slug: 'constants',
  },
  {
    name: 'Core',
    description: 'Utility functions for arrays, objects, and composition',
    section: 'packages',
    slug: 'core',
  },
  {
    name: 'Dataset',
    description: 'Type-safe geospatial dataset validation',
    section: 'packages',
    slug: 'dataset',
  },
  {
    name: 'Formatters',
    description: 'Formatting functions for readability and consistency',
    section: 'packages',
    slug: 'formatters',
  },
  {
    name: 'Geo',
    description: 'Functions for coordinates and geospatial data',
    section: 'packages',
    slug: 'geo',
  },
  {
    name: 'Hotkey Manager',
    description: 'Keyboard shortcut management',
    section: 'packages',
    slug: 'hotkey-manager',
  },
  {
    name: 'Icons',
    description: 'Open-source icon library',
    section: 'packages',
    slug: 'icons',
  },
  {
    name: 'Logger',
    description: 'Flexible logging with callsite tracking',
    section: 'packages',
    slug: 'logger',
  },
  {
    name: 'Math',
    description: 'Collection of basic mathematical functions',
    section: 'packages',
    slug: 'math',
  },
  {
    name: 'NTDS',
    description: 'NTDS-compliant SVG icon components',
    section: 'packages',
    slug: 'ntds',
  },
  {
    name: 'Predicates',
    description: 'Collection of predicate functions',
    section: 'packages',
    slug: 'predicates',
  },
  {
    name: 'Temporal',
    description: 'Date and time parsing, formatting, and manipulation',
    section: 'packages',
    slug: 'temporal',
  },
  {
    name: 'Web Worker',
    description: 'Simplified Web Workers interface',
    section: 'packages',
    slug: 'web-worker',
  },
  {
    name: 'WebSocket',
    description: 'Simplified WebSocket interface',
    section: 'packages',
    slug: 'websocket',
  },
  // Tooling
  {
    name: 'Biome Config',
    description: 'Shared Biome configuration',
    section: 'tooling',
    slug: 'biome-config',
  },
  {
    name: 'ESLint Config',
    description: 'Shared ESLint configuration',
    section: 'tooling',
    slug: 'eslint-config',
  },
  {
    name: 'PostCSS Tailwind CSS Modules',
    description: 'PostCSS plugin for Tailwind CSS Modules',
    section: 'tooling',
    slug: 'postcss-tailwind-css-modules',
  },
  {
    name: 'Prettier Config',
    description: 'Shared Prettier configuration',
    section: 'tooling',
    slug: 'prettier-config',
  },
  {
    name: 'Smeegl',
    description: 'Build tooling utilities',
    section: 'tooling',
    slug: 'smeegl',
  },
  {
    name: 'TypeScript Config',
    description: 'Shared TypeScript configuration',
    section: 'tooling',
    slug: 'typescript-config',
  },
  {
    name: 'Vitest Config',
    description: 'Shared Vitest configuration',
    section: 'tooling',
    slug: 'vitest-config',
  },
];

const sectionLabels = {
  toolkits: 'Toolkits',
  packages: 'Packages',
  tooling: 'Tooling',
};

export function PackageGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<
    'all' | 'toolkits' | 'packages' | 'tooling'
  >('all');

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection =
      selectedSection === 'all' || pkg.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  const groupedPackages = {
    toolkits: filteredPackages.filter((pkg) => pkg.section === 'toolkits'),
    packages: filteredPackages.filter((pkg) => pkg.section === 'packages'),
    tooling: filteredPackages.filter((pkg) => pkg.section === 'tooling'),
  };

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Packages
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Discover {packages.length} packages across toolkits, utilities, and
            developer tools.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mx-auto mt-10 max-w-2xl">
          <input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <div className="mt-4 flex gap-2">
            {(['all', 'toolkits', 'packages', 'tooling'] as const).map(
              (section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => setSelectedSection(section)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedSection === section
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {section === 'all'
                    ? 'All'
                    : sectionLabels[section]}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Package Grid */}
        <div className="mx-auto mt-16 max-w-7xl">
          {selectedSection === 'all' ? (
            <>
              {(Object.keys(groupedPackages) as Array<keyof typeof groupedPackages>).map(
                (section) =>
                  groupedPackages[section].length > 0 && (
                    <div key={section} className="mb-12">
                      <h3 className="mb-6 text-2xl font-semibold">
                        {sectionLabels[section]}
                      </h3>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {groupedPackages[section].map((pkg) => (
                          <PackageCard key={pkg.slug} pkg={pkg} />
                        ))}
                      </div>
                    </div>
                  ),
              )}
            </>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          )}

          {filteredPackages.length === 0 && (
            <div className="text-center text-muted-foreground">
              No packages found matching your search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <Link
      href={`/docs/${pkg.section}/${pkg.slug}`}
      className="group relative rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-md transition-all"
    >
      <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
        {pkg.name}
      </h4>
      <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>
      <div className="mt-4 text-xs text-muted-foreground">
        {sectionLabels[pkg.section]}
      </div>
    </Link>
  );
}
