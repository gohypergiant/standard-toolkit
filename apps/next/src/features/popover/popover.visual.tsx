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
	Checkbox,
	Popover,
	PopoverContent,
	PopoverFooter,
	PopoverTitle,
	PopoverTrigger,
} from '@accelint/design-toolkit';
import { createVisualTestScenarios } from '~/visual-regression/vitest';
import type { PopoverContentVariant } from './variants';
import { CONTENT_PROP_COMBOS } from './variants';

function SimpleContent() {
	return (
		<PopoverTrigger isOpen>
			<Button variant='outline'>Open popover</Button>
			<Popover>
				<PopoverTitle>Simple Popover</PopoverTitle>
				<PopoverContent>
					This is a simple popover with basic text content.
				</PopoverContent>
			</Popover>
		</PopoverTrigger>
	);
}

function WithActionsContent() {
	return (
		<PopoverTrigger isOpen>
			<Button variant='outline'>Open popover</Button>
			<Popover>
				<PopoverTitle>Popover With Actions</PopoverTitle>
				<PopoverContent>
					This popover includes footer actions for user interaction.
				</PopoverContent>
				<PopoverFooter>
					<Button variant='outline'>Cancel</Button>
					<Button variant='filled'>Confirm</Button>
				</PopoverFooter>
			</Popover>
		</PopoverTrigger>
	);
}

function CustomContent() {
	return (
		<PopoverTrigger isOpen>
			<Button variant='outline'>Open popover</Button>
			<Popover classNames={{ popover: 'min-w-sm' }}>
				<PopoverTitle>Custom Content</PopoverTitle>
				<PopoverContent>
					<Checkbox>Option A</Checkbox>
					<Checkbox>Option B</Checkbox>
					<Checkbox>Option C</Checkbox>
				</PopoverContent>
			</Popover>
		</PopoverTrigger>
	);
}

const CONTENT_COMPONENTS: Record<
	PopoverContentVariant['content'],
	() => JSX.Element
> = {
	simple: SimpleContent,
	'with-actions': WithActionsContent,
	custom: CustomContent,
};

createVisualTestScenarios(
	'Popover',
	CONTENT_PROP_COMBOS.map((props) => ({
		name: `${props.content} content`,
		render: () => {
			const Component = CONTENT_COMPONENTS[props.content];
			return <Component />;
		},
		screenshotName: `popover-${props.content}.png`,
		waitMs: 300,
		selector: '[role="dialog"]',
	})),
);
