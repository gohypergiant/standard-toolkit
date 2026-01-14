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

import {
  Button,
  Dialog,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@accelint/design-toolkit';
import { createVisualTestScenarios } from '~/visual-regression/vitest';
import { type DialogVariant, PROP_COMBOS } from './variants';

function DialogVariantComponent({ props }: { props: DialogVariant }) {
  return (
    <DialogTrigger isOpen>
      <Button variant="outline">Open {props.size} dialog</Button>
      <Dialog {...props} isDismissable>
        <DialogTitle>Dialog: {props.size}</DialogTitle>
        <p>
          This is a {props.size} dialog with some example content to show the
          visual appearance.
        </p>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="filled">Confirm</Button>
        </DialogFooter>
      </Dialog>
    </DialogTrigger>
  );
}

createVisualTestScenarios(
  'Dialog',
  PROP_COMBOS.map((props) => ({
    name: `${props.size} variant`,
    render: () => <DialogVariantComponent props={props} />,
    screenshotName: `dialog-${props.size}.png`,
    waitMs: 300,
    selector: '[role="dialog"]',
  })),
);
