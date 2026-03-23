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

import { PanelHeader } from '@/components/gantt/components/header';
import { PanelRowsVirtualizer } from '@/components/gantt/components/rows-virtualizer';
import { useGanttContext } from '@/components/gantt/context';
import styles from '../styles.module.css';
import type { PropsWithChildren } from 'react';

export function GanttPanelContainer({ children }: PropsWithChildren) {
  const { assignGanttPanelElementRef } = useGanttContext();

  return (
    <div ref={assignGanttPanelElementRef} className={styles['gantt-panel']}>
      <PanelHeader />
      <PanelRowsVirtualizer>{children}</PanelRowsVirtualizer>
    </div>
  );
}
