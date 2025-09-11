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
import type { ReactNode } from 'react';

/**
 * Shared mock data for consistent Storybook examples
 */

export interface MockMenuItem {
  id: number;
  name: string;
  description?: string;
  prefixIcon?: ReactNode;
  children?: MockMenuItem[];
  isDisabled?: boolean;
  hotkey?: string;
}

export interface MockUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'online' | 'offline' | 'away';
}

export interface MockTableData {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  lastModified: Date;
  progress: number;
}

export const MOCK_DATA = {
  /**
   * Standard menu items for dropdown/navigation components
   */
  MENU_ITEMS: [
    {
      id: 1,
      prefixIcon: <Placeholder />,
      name: 'North American Birds',
      children: [
        {
          id: 2,
          prefixIcon: <Placeholder />,
          name: 'Blue Jay',
          description: 'Cyanocitta cristata',
        },
        {
          id: 3,
          prefixIcon: <Placeholder />,
          name: 'Gray Catbird',
          description: 'Dumetella carolinensis',
          isDisabled: true,
          hotkey: '⌘G',
        },
        {
          id: 4,
          prefixIcon: <Placeholder />,
          name: 'Black-capped Chickadee',
          description: 'Poecile atricapillus',
        },
        {
          id: 5,
          prefixIcon: <Placeholder />,
          name: 'Song Sparrow',
          description: 'Melospiza melodia',
          hotkey: '⌘S',
        },
      ],
    },
    {
      id: 6,
      prefixIcon: <Placeholder />,
      name: 'African Birds',
      children: [
        {
          id: 7,
          prefixIcon: <Placeholder />,
          name: 'Lilac-breasted Roller',
          description: 'Coracias caudatus',
        },
        {
          id: 8,
          prefixIcon: <Placeholder />,
          name: 'Secretary Bird',
          description: 'Sagittarius serpentarius',
        },
      ],
    },
  ] as MockMenuItem[],

  /**
   * Simple options for select/combobox components
   */
  SIMPLE_OPTIONS: [
    { id: 'option1', name: 'Option 1', value: 'option1' },
    { id: 'option2', name: 'Option 2', value: 'option2' },
    { id: 'option3', name: 'Option 3', value: 'option3' },
    {
      id: 'option4',
      name: 'Option 4 (Disabled)',
      value: 'option4',
      isDisabled: true,
    },
    { id: 'option5', name: 'Option 5', value: 'option5' },
  ],

  /**
   * User data for avatar/profile components
   */
  USERS: [
    {
      id: 1,
      name: 'Ada Lovelace',
      email: 'ada@lovelace.com',
      avatar: 'https://i.pravatar.cc/100?img=1',
      role: 'Countess of Lovelace',
      status: 'online' as const,
    },
    {
      id: 2,
      name: 'Leonhard Euler',
      email: 'leonhard@euler.com',
      avatar: 'https://i.pravatar.cc/100?img=2',
      role: 'Mathematician',
      status: 'away' as const,
    },
    {
      id: 3,
      name: 'Henry Ford',
      email: 'henry@ford.com',
      role: 'Product Manager',
      status: 'offline' as const,
    },
  ] as MockUser[],

  /**
   * Table data for data display components
   */
  TABLE_DATA: [
    {
      id: 1,
      name: 'Project Alpha',
      status: 'active' as const,
      category: 'Web Application',
      lastModified: new Date('2024-03-15'),
      progress: 75,
    },
    {
      id: 2,
      name: 'Beta Testing Initiative',
      status: 'pending' as const,
      category: 'Quality Assurance',
      lastModified: new Date('2024-03-10'),
      progress: 30,
    },
    {
      id: 3,
      name: 'Mobile App Redesign',
      status: 'inactive' as const,
      category: 'Mobile',
      lastModified: new Date('2024-02-28'),
      progress: 100,
    },
  ] as MockTableData[],

  /**
   * Long text content for documentation/content components
   */
  TEXT_CONTENT: {
    SHORT: 'Quick brown fox jumps over the lazy dog.',
    MEDIUM:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    LONG: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  },

  /**
   * Error messages for different scenarios
   */
  ERROR_MESSAGES: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_FORMAT: 'Please check the format and try again',
    NETWORK_ERROR: 'Unable to connect. Please try again later.',
    PERMISSION_DENIED: 'You do not have permission to perform this action',
  },
};

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
