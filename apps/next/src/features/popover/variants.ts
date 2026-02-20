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

import type { PopoverProps } from '@accelint/design-toolkit/components/popover/types';

export type PopoverPositionVariant = Pick<PopoverProps, 'placement'>;

export const POSITION_PROP_COMBOS = [
	{ placement: 'top' },
	{ placement: 'top left' },
	{ placement: 'top right' },
	{ placement: 'bottom' },
	{ placement: 'bottom left' },
	{ placement: 'bottom right' },
	{ placement: 'left' },
	{ placement: 'left top' },
	{ placement: 'left bottom' },
	{ placement: 'right' },
	{ placement: 'right top' },
	{ placement: 'right bottom' },
] as const satisfies readonly PopoverPositionVariant[];

export type PopoverContentVariant = {
	content: 'simple' | 'with-actions' | 'custom';
};

export const CONTENT_PROP_COMBOS: PopoverContentVariant[] = [
	{ content: 'simple' },
	{ content: 'with-actions' },
	{ content: 'custom' },
];
