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

interface Feature {
  name: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    name: 'Type-Safe',
    description:
      'Built with TypeScript in strict mode, providing full type safety and excellent IDE support.',
    icon: '🔒',
  },
  {
    name: 'Tree-Shakeable',
    description:
      'Optimized for modern bundlers with ESM support. Import only what you need.',
    icon: '🌳',
  },
  {
    name: 'Well-Tested',
    description:
      'Comprehensive test coverage with Vitest ensuring reliability and quality.',
    icon: '✅',
  },
  {
    name: 'React Ready',
    description:
      'Includes React components and hooks built with React Aria Components.',
    icon: '⚛️',
  },
  {
    name: 'Design System',
    description:
      'Complete design system with design tokens and composable components.',
    icon: '🎨',
  },
  {
    name: 'Developer Experience',
    description:
      'Clear documentation, consistent APIs, and helpful TypeScript types.',
    icon: '💎',
  },
];

export function FeatureGrid() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Build faster with proven tools
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Standard Toolkit provides a comprehensive set of utilities,
            components, and tools that work together seamlessly.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xl">
                    {feature.icon}
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
