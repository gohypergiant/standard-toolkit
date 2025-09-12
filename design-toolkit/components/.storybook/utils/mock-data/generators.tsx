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

import { Placeholder } from '@accelint/icons';
import type { MockMenuItem, MockTableData, MockUser } from './interfaces';

/**
 * Helper to generate large datasets for performance testing
 */
export const generateMockData = {
  menuItems: (count: number): MockMenuItem[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
      prefixIcon: <Placeholder />,
    }));
  },

  users: (count: number): MockUser[] => {
    const roles = ['Developer', 'Designer', 'Manager', 'Analyst'];
    const statuses: MockUser['status'][] = ['online', 'offline', 'away'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      avatar: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`,
      role: roles[i % roles.length] || 'Developer',
      status: statuses[i % statuses.length] || 'offline',
    }));
  },

  tableData: (count: number): MockTableData[] => {
    const statuses: MockTableData['status'][] = [
      'active',
      'inactive',
      'pending',
    ];
    const categories = ['Web App', 'Mobile', 'Desktop', 'API'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Project ${String.fromCharCode(65 + (i % 26))}`,
      status: statuses[i % statuses.length] || 'active',
      category: categories[i % categories.length] || 'Web App',
      lastModified: new Date(2024, 2, (i % 28) + 1),
      progress: Math.floor(Math.random() * 100),
    }));
  },
};
