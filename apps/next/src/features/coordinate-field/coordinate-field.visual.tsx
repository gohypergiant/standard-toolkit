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

import { CoordinateField } from '@accelint/design-toolkit/components/coordinate-field';
import { useEffect, useRef } from 'react';
import { dash } from 'radashi';
import { createVisualTestScenarios } from '~/visual-regression/vitest';
import {
  type CoordinateFieldVariant,
  COPY_MENU_SCENARIOS,
  DESCRIPTION_SCENARIOS,
  FORMAT_BUTTON_SCENARIOS,
  FORMAT_SCENARIOS,
  LAYOUT_SCENARIOS,
  SIZE_SCENARIOS,
  STATE_SCENARIOS,
} from './variants';

function buildScenarios(
  groupName: string,
  scenarios: CoordinateFieldVariant[],
) {
  return scenarios.map((props) => ({
    name: `${props.label}`,
    render: () => <CoordinateField {...props} />,
    screenshotName: `coordinate-field-${dash(groupName)}-${dash(props.label ?? 'unnamed')}.png`,
    className: 'inline-block p-s',
  }));
}

createVisualTestScenarios(
  'CoordinateField-Formats',
  buildScenarios('formats', FORMAT_SCENARIOS),
);

createVisualTestScenarios(
  'CoordinateField-Sizes',
  buildScenarios('sizes', SIZE_SCENARIOS),
);

createVisualTestScenarios(
  'CoordinateField-Layouts',
  buildScenarios('layouts', LAYOUT_SCENARIOS),
);

createVisualTestScenarios(
  'CoordinateField-States',
  buildScenarios('states', STATE_SCENARIOS),
);

createVisualTestScenarios(
  'CoordinateField-Description',
  buildScenarios('description', DESCRIPTION_SCENARIOS),
);

createVisualTestScenarios(
  'CoordinateField-FormatButton',
  buildScenarios('format-button', FORMAT_BUTTON_SCENARIOS),
);

function CopyMenuWrapper({ props }: { props: CoordinateFieldVariant }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = ref.current?.querySelector<HTMLElement>(
      '[aria-label="View coordinate in all formats"]',
    );
    button?.click();
  }, []);

  return (
    <div ref={ref}>
      <CoordinateField {...props} />
    </div>
  );
}

createVisualTestScenarios(
  'CoordinateField-CopyMenu',
  COPY_MENU_SCENARIOS.map((props) => ({
    name: `${props.label}`,
    render: () => <CopyMenuWrapper props={props} />,
    screenshotName: `coordinate-field-copy-menu-${dash(props.label ?? 'unnamed')}.png`,
    className: 'inline-block p-s',
    waitMs: 300,
    selector: '[role="dialog"]',
  })),
);
