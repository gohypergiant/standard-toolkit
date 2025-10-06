// __private-exports
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

import type { ChangeEventHandler } from 'react';

type RangeProps = {
  altText: string;
  label: string;
  max: number;
  min: number;
  onUpdate: ChangeEventHandler<HTMLInputElement>;
  step?: number;
  preview: string;
  value: number;
};

export function Range(props: RangeProps) {
  return (
    <div className='select-none' title={props.altText}>
      <label className='flex items-center' htmlFor={props.label}>
        <span style={{ flex: 1 }}>{props.label}</span>
        <span style={{ flex: 0, whiteSpace: 'nowrap' }}>{props.preview}</span>
      </label>
      <input
        id={props.label}
        max={props.max}
        min={props.min}
        name={props.label}
        onChange={props.onUpdate}
        step={props.step}
        type='range'
        value={props.value}
      />
    </div>
  );
}
