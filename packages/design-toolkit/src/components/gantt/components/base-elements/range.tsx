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

import { type HTMLAttributes, type PropsWithChildren, useState } from 'react';
import { useGanttContext } from '../../context';
import { shouldRenderRangeElement } from '../../utils/helpers';
import { useRangeElementLayout } from './use-range-element-layout';
import type { RowElementColorProp } from '../../types';

export type RangeProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  startMs: number;
  endMs: number;
  color?: RowElementColorProp;
};

function RangeInner({
  children,
  startMs,
  endMs,
  color = 'accent',
  ...rest
}: PropsWithChildren<RangeProps>) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useRangeElementLayout({
    element,
    timeBounds: {
      startMs,
      endMs,
    },
  });

  const assignElementRef = (node: HTMLDivElement) => {
    setElement(node);
  };

  return (
    <div ref={assignElementRef} data-color={color} {...rest}>
      {children}
    </div>
  );
}

export function Range(props: PropsWithChildren<RangeProps>) {
  const { renderedRegionBounds } = useGanttContext();
  const { startMs, endMs } = props;

  if (!shouldRenderRangeElement(renderedRegionBounds, { startMs, endMs })) {
    return null;
  }

  return <RangeInner {...props} />;
}
