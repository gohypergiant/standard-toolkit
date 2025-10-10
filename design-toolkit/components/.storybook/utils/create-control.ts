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

const create = (
  type: keyof typeof createControl,
  description: string,
  [summary, defaultValue]: string | [string, string],
  options: string[] | readonly string[] = [],
) =>
  ({
    control: { type } as const,
    description,
    options,
    table: {
      type: { summary },
      defaultValue: { summary: defaultValue },
    },
  }) as const;

export const createControl = {
  boolean(description: string, defaultValue: 'false' | 'true' = 'false') {
    return create('boolean', description, ['boolean', defaultValue]);
  },

  radio(
    description: string,
    options: string[],
    defaultValue = options[0] ?? '',
  ) {
    return create('radio', description, [options.join(' | '), defaultValue]);
  },

  select(
    description: string,
    options: string[] | readonly string[],
    defaultValue = options[0] ?? '',
  ) {
    return create(
      'select',
      description,
      [options.join(' | '), defaultValue],
      options,
    );
  },

  text(description: string, summary = 'string') {
    return create('text', description, summary);
  },
};
