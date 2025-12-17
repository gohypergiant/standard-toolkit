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

import { Link } from '@accelint/design-toolkit/components/link';

const LINKS = [
  { path: '/', label: 'All' },
  { path: '/accordion', label: 'Accordion' },
  { path: '/accordion-group', label: 'Accordion Group' },
  { path: '/action-bar/client', label: 'Action Bar' },
  { path: '/avatar', label: 'Avatar' },
  { path: '/badge', label: 'Badge' },
  { path: '/button', label: 'Button' },
  { path: '/dialog/client', label: 'Dialog' },
  { path: '/drawer/client', label: 'Drawer' },
  { path: '/notice', label: 'Notice' },
  { path: '/tooltip', label: 'Tooltip' },
];

export function Nav() {
  return (
    <div className='flex flex-row gap-s fixed top-0 left-0 right-0 bg-surface-default p-xs shadow-elevation-overlay'>
      {LINKS.map((link, k) => {
        return (
          <Link key={link.path} href={link.path}>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
