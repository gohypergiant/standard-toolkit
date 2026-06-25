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

import { useGanttContext } from '@/components/gantt/context';
import { useVerticalScrollUpdate } from '@/components/gantt/hooks/use-vertical-scroll-update';
import { LayoutContainer } from './layout-container';
import styles from './styles.module.css';
import { VirtualizedContentHeightContainer } from './virtualized-content-height-container';
import type { PropsWithChildren } from 'react';

export function RootContainer({ children }: PropsWithChildren) {
  const { assignRootElementRef } = useGanttContext();
  const { onScroll } = useVerticalScrollUpdate();

  return (
    <div ref={assignRootElementRef} className={styles.root} onScroll={onScroll}>
      <VirtualizedContentHeightContainer>
        <LayoutContainer>{children}</LayoutContainer>
      </VirtualizedContentHeightContainer>
    </div>
  );
}
