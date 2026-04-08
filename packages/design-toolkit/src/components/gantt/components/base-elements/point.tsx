// __private-exports
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
  type HTMLAttributes,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import { useTemporalDataContext } from '@/components/gantt/context/temporal-data';
import { timestampWithinBounds } from '@/components/gantt/utils/helpers';
import { usePointElementLayout } from './use-point-element-layout';
import type { GanttRowElementColorProp } from '@/components/gantt/types';

/** Props for point-based Gantt elements (markers, brackets). */
export type PointProps = HTMLAttributes<HTMLDivElement> & {
  /** Timestamp in epoch milliseconds for the point position on the timeline. */
  timeMs: number;
  /** Visual color variant. @default 'accent' */
  color?: GanttRowElementColorProp;
};

function PointInner({
  children,
  timeMs,
  color = 'accent',
  ...rest
}: PropsWithChildren<PointProps>) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  usePointElementLayout({
    element,
    timeMs,
  });

  const assignElementRef = useCallback((node: HTMLDivElement | null) => {
    setElement(node);
  }, []);

  return (
    <div ref={assignElementRef} data-color={color} {...rest}>
      {children}
    </div>
  );
}

export function Point(props: PropsWithChildren<PointProps>) {
  const { renderedRegionBounds } = useTemporalDataContext();

  if (!timestampWithinBounds(props.timeMs, renderedRegionBounds)) {
    return null;
  }

  return <PointInner {...props} />;
}
