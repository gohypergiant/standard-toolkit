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

export type City = 'New York' | 'San Diego' | 'Austin';

export type Address = {
  city: City;
  street: string;
};

export type Person = {
  name: string;
  address?: Address;
};

export type Profile = {
  info: Person;
};

export type User = {
  username: string;
  password: string;
  profile: Profile[];
};

export const personStore: Person = {
  name: 'Alice',
  address: {
    city: 'New York',
    street: '123 Main St',
  },
};

export const userStore: User = {
  username: 'foobar',
  password: 'cleverPassword',
  profile: [
    {
      info: {
        name: 'Frank',
        address: {
          city: 'Austin',
          street: '123 Main St',
        },
      },
    },
  ],
};
