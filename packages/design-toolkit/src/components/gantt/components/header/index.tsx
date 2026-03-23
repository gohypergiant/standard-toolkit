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

import { GANTT_HEADER_HEIGHT_PX } from '../../constants';
import { useGanttContext } from '../../context';
import styles from './styles.module.css';
import type { PropsWithChildren, Ref } from 'react';

type HeaderProps = {
  ref?: Ref<HTMLDivElement | null>;
};

function Header({ children, ref }: PropsWithChildren<HeaderProps>) {
  return (
    <div
      ref={ref}
      className={styles.header}
      data-height={GANTT_HEADER_HEIGHT_PX}
    >
      {children}
    </div>
  );
}

export function ContentHeader({ children }: PropsWithChildren) {
  const { assignHeaderElementRef } = useGanttContext();

  return <Header ref={assignHeaderElementRef}>{children}</Header>;
}

export function PanelHeader({ children }: PropsWithChildren) {
  return <Header>{children}</Header>;
}
