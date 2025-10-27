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
'use client';

import 'client-only';
import { OptionsItem } from './item';
import { OptionsItemContent } from './item-content';
import { OptionsItemDescription } from './item-description';
import { OptionsItemLabel } from './item-label';
import { Options } from './options';
import { OptionsSection } from './section';

// Attach subcomponents to maintain API compatibility
Options.Item = OptionsItem;
Options.Section = OptionsSection;
Options.Item.Content = OptionsItemContent;
Options.Item.Label = OptionsItemLabel;
Options.Item.Description = OptionsItemDescription;

export { Options };
