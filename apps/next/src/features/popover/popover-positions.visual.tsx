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

import {
	Button,
	Popover,
	PopoverContent,
	PopoverTitle,
	PopoverTrigger,
} from '@accelint/design-toolkit';
import { createVisualTestScenarios } from '~/visual-regression/vitest';
import type { PopoverPositionVariant } from './variants';
import { POSITION_PROP_COMBOS } from './variants';

function PopoverPositionVariantComponent({
	props,
}: {
	props: PopoverPositionVariant;
}) {
	return (
		<div className='relative flex h-screen w-screen items-center justify-center'>
			<PopoverTrigger isOpen>
				<Button variant='outline'>Trigger</Button>
				<Popover placement={props.placement}>
					<PopoverTitle>Popover</PopoverTitle>
					<PopoverContent>Placement: {props.placement}</PopoverContent>
				</Popover>
			</PopoverTrigger>
		</div>
	);
}

createVisualTestScenarios(
	'Popover Positions',
	POSITION_PROP_COMBOS.map((props) => ({
		name: `${props.placement} placement`,
		render: () => <PopoverPositionVariantComponent props={props} />,
		screenshotName: `popover-position-${props.placement.replace(/ /g, '-')}.png`,
		waitMs: 300,
	})),
);
