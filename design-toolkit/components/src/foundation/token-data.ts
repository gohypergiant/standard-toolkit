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

// __private-exports

export const darkTokens = {
  bg: {
    base: [
      {
        name: 'bg-surface-default',
        cssvar: '--primitive-neutral-900',
        actual: '#151517',
      },
      {
        name: 'bg-surface-raised',
        cssvar: '--primitive-neutral-800',
        actual: '#212223',
      },
      {
        name: 'bg-surface-overlay',
        cssvar: '--primitive-neutral-800',
        actual: '#212223',
      },
      {
        name: 'bg-surface-muted',
        cssvar: '--primitive-alpha-white-100, rgba(255, 255, 255, 0.08)',
      },
      {
        name: 'bg-interactive-bold',
        cssvar: '--primitive-neutral-800',
        actual: '#212223',
      },
      {
        name: 'bg-interactive-bold-hover',
        cssvar: '--primitive-neutral-700',
        actual: '#2f2f31',
      },
      {
        name: 'bg-interactive-bold-pressed',
        cssvar: '--primitive-neutral-950',
        actual: '#000000',
      },
      {
        name: 'bg-interactive-muted',
        cssvar: '--primitive-neutral-700',
        actual: '#2f2f31',
      },
      {
        name: 'bg-interactive-muted-hover',
        cssvar: '--primitive-neutral-600',
        actual: '#414245',
      },
      {
        name: 'bg-interactive-muted-pressed',
        cssvar: '--primitive-neutral-950',
        actual: '#000000',
      },
      {
        name: 'bg-interactive-disabled',
        cssvar: '--primitive-neutral-200',
        actual: '#d5d7d9',
      },
      {
        name: 'bg-accent-primary-bold',
        cssvar: '--primitive-accent-primary-700',
        actual: '#004f7e',
      },
      {
        name: 'bg-accent-primary-hover',
        cssvar: '--primitive-accent-primary-600',
        actual: '#0068a1',
      },
      {
        name: 'bg-accent-primary-pressed',
        cssvar: '--primitive-accent-primary-800',
        actual: '#00213e',
      },
      {
        name: 'bg-accent-primary-muted',
        cssvar: '--primitive-accent-primary-800',
        actual: '#00213e',
      },
    ],
    utility: [
      {
        name: 'bg-info-bold',
        cssvar: '--primitive-utility-info-500',
        actual: '#565759',
      },
      {
        name: 'bg-info-hover',
        cssvar: '--primitive-utility-info-400',
        actual: '#888a8f',
      },
      {
        name: 'bg-info-pressed',
        cssvar: '--primitive-utility-info-600',
        actual: '#414245',
      },
      {
        name: 'bg-info-muted',
        cssvar: '--primitive-utility-info-800',
        actual: '#212223',
      },
      {
        name: 'bg-advisory-bold',
        cssvar: '--primitive-utility-advisory-600',
        actual: '#3c67a0',
      },
      {
        name: 'bg-advisory-hover',
        cssvar: '--primitive-utility-advisory-500',
        actual: '#4e88da',
      },
      {
        name: 'bg-advisory-pressed',
        cssvar: '--primitive-utility-advisory-700',
        actual: '#264062',
      },
      {
        name: 'bg-advisory-muted',
        cssvar: '--primitive-utility-advisory-900',
        actual: '#0e1825',
      },
      {
        name: 'bg-normal-bold',
        cssvar: '--primitive-utility-normal-600',
        actual: '#1c7e23',
      },
      {
        name: 'bg-normal-hover',
        cssvar: '--primitive-utility-normal-500',
        actual: '#26a12e',
      },
      {
        name: 'bg-normal-pressed',
        cssvar: '--primitive-utility-normal-700',
        actual: '#145718',
      },
      {
        name: 'bg-normal-muted',
        cssvar: '--primitive-utility-normal-900',
        actual: '#08210a',
      },
      {
        name: 'bg-serious-bold',
        cssvar: '--primitive-utility-serious-600',
        actual: '#bb7a00',
      },
      {
        name: 'bg-serious-hover',
        cssvar: '--primitive-utility-serious-500',
        actual: '#e89906',
      },
      {
        name: 'bg-serious-pressed',
        cssvar: '--primitive-utility-serious-800',
        actual: '#634101',
      },
      {
        name: 'bg-serious-muted',
        cssvar: '--primitive-utility-serious-900',
        actual: '#291b00',
      },
      {
        name: 'bg-critical-bold',
        cssvar: '--primitive-utility-critical-700',
        actual: '#790501',
      },
      {
        name: 'bg-critical-hover',
        cssvar: '--primitive-utility-critical-600',
        actual: '#a10701',
      },
      {
        name: 'bg-critical-pressed',
        cssvar: '--primitive-utility-critical-800',
        actual: '#540300',
      },
      {
        name: 'bg-critical-muted',
        cssvar: '--primitive-utility-critical-900',
        actual: '#290200',
      },
    ],
  },
  fg: {
    base: [
      {
        name: 'fg-primary-bold',
        cssvar: '--primitive-neutral-50',
        actual: '#ffffff',
      },
      {
        name: 'fg-primary-muted',
        cssvar: '--primitive-neutral-300',
        actual: '#c3c5c7',
      },
      {
        name: 'fg-inverse-bold',
        cssvar: '--primitive-neutral-800',
        actual: '#212223',
      },
      {
        name: 'fg-inverse-muted',
        cssvar: '--primitive-neutral-400',
        actual: '#888a8f',
      },
      {
        name: 'fg-disabled',
        cssvar: '--primitive-neutral-500',
        actual: '#565759',
      },
    ],
    utility: [
      {
        name: 'fg-accent-primary-bold',
        cssvar: '--primitive-accent-primary-400',
        actual: '#009cde',
      },
      {
        name: 'fg-accent-primary-hover',
        cssvar: '--primitive-accent-primary-200',
        actual: '#6ed1ff',
      },
      {
        name: 'fg-accent-primary-pressed',
        cssvar: '--primitive-accent-primary-600',
        actual: '#0068a1',
      },
      {
        name: 'fg-info-bold',
        cssvar: '--primitive-utility-info-400',
        actual: '#888a8f',
      },
      {
        name: 'fg-info-hover',
        cssvar: '--primitive-utility-info-200',
        actual: '#d5d7d9',
      },
      {
        name: 'fg-info-pressed',
        cssvar: '--primitive-utility-info-600',
        actual: '#414245',
      },
      {
        name: 'fg-advisory-bold',
        cssvar: '--primitive-utility-advisory-400',
        actual: '#62a6ff',
      },
      {
        name: 'fg-advisory-hover',
        cssvar: '--primitive-utility-advisory-200',
        actual: '#a9ceff',
      },
      {
        name: 'fg-advisory-pressed',
        cssvar: '--primitive-utility-advisory-600',
        actual: '#3c67a0',
      },
      {
        name: 'fg-normal-bold',
        cssvar: '--primitive-utility-normal-400',
        actual: '#2bbf35',
      },
      {
        name: 'fg-normal-hover',
        cssvar: '--primitive-utility-normal-200',
        actual: '#86e98c',
      },
      {
        name: 'fg-normal-pressed',
        cssvar: '--primitive-utility-normal-600',
        actual: '#1c7e23',
      },
      {
        name: 'fg-serious-bold',
        cssvar: '--primitive-utility-serious-400',
        actual: '#fbab16',
      },
      {
        name: 'fg-serious-hover',
        cssvar: '--primitive-utility-serious-200',
        actual: '#ffd382',
      },
      {
        name: 'fg-serious-pressed',
        cssvar: '--primitive-utility-serious-600',
        actual: '#bb7a00',
      },
      {
        name: 'fg-critical-bold',
        cssvar: '--primitive-utility-critical-400',
        actual: '#ff2e27',
      },
      {
        name: 'fg-critical-hover',
        cssvar: '--primitive-utility-critical-200',
        actual: '#ff9390',
      },
      {
        name: 'fg-critical-pressed',
        cssvar: '--primitive-utility-critical-600',
        actual: '#a10701',
      },
    ],
    a11y: [
      {
        name: 'fg-a11y-on-accent',
        cssvar: '--primitive-neutral-50',
        actual: '#ffffff',
      },
      {
        name: 'fg-a11y-on-utility',
        cssvar: '--primitive-neutral-50',
        actual: '#ffffff',
      },
    ],
  },
  outline: [
    {
      name: 'outline-static',
      cssvar: '--primitive-neutral-600',
      actual: '#414245',
    },
    {
      name: 'outline-interactive',
      cssvar: '--primitive-neutral-600',
      actual: '#414245',
    },
    {
      name: 'outline-interactive-hover',
      cssvar: '--primitive-neutral-400',
      actual: '#888a8f',
    },
    {
      name: 'outline-interactive-pressed',
      cssvar: '--primitive-neutral-700',
      actual: '#2f2f31',
    },
    {
      name: 'outline-interactive-disabled',
      cssvar: '--primitive-neutral-700',
      actual: '#2f2f31',
    },
    {
      name: 'outline-accent-primary-bold',
      cssvar: '--primitive-accent-primary-300',
      actual: '#39b7fa',
    },
    {
      name: 'outline-accent-primary-hover',
      cssvar: '--primitive-accent-primary-200',
      actual: '#6ed1ff',
    },
    {
      name: 'outline-accent-primary-pressed',
      cssvar: '--primitive-accent-primary-600',
      actual: '#0068a1',
    },
    {
      name: 'outline-info-bold',
      cssvar: '--primitive-utility-info-400',
      actual: '#888a8f',
    },
    {
      name: 'outline-info-hover',
      cssvar: '--primitive-utility-info-200',
      actual: '#d5d7d9',
    },
    {
      name: 'outline-info-pressed',
      cssvar: '--primitive-utility-info-600',
      actual: '#414245',
    },
    {
      name: 'outline-advisory-bold',
      cssvar: '--primitive-utility-advisory-400',
      actual: '#62a6ff',
    },
    {
      name: 'outline-advisory-hover',
      cssvar: '--primitive-utility-advisory-200',
      actual: '#a9ceff',
    },
    {
      name: 'outline-advisory-pressed',
      cssvar: '--primitive-utility-advisory-600',
      actual: '#3c67a0',
    },
    {
      name: 'outline-normal-bold',
      cssvar: '--primitive-utility-normal-400',
      actual: '#2bbf35',
    },
    {
      name: 'outline-normal-hover',
      cssvar: '--primitive-utility-normal-200',
      actual: '#86e98c',
    },
    {
      name: 'outline-normal-pressed',
      cssvar: '--primitive-utility-normal-600',
      actual: '#1c7e23',
    },
    {
      name: 'outline-serious-bold',
      cssvar: '--primitive-utility-serious-500',
      actual: '#e89906',
    },
    {
      name: 'outline-serious-hover',
      cssvar: '--primitive-utility-serious-200',
      actual: '#ffd382',
    },
    {
      name: 'outline-serious-pressed',
      cssvar: '--primitive-utility-serious-700',
      actual: '#8e5d00',
    },
    {
      name: 'outline-critical-bold',
      cssvar: '--primitive-utility-critical-400',
      actual: '#ff2e27',
    },
    {
      name: 'outline-critical-hover',
      cssvar: '--primitive-utility-critical-300',
      actual: '#ff6d68',
    },
    {
      name: 'outline-critical-pressed',
      cssvar: '--primitive-utility-critical-600',
      actual: '#a10701',
    },
  ],
};

export const lightTokens = {
  bg: {
    base: [
      {
        name: 'bg-surface-default',
        cssvar: ' --primitive-neutral-100',
        actual: ' #eff1f2',
      },
      {
        name: 'bg-surface-raised',
        cssvar: ' --primitive-neutral-50',
        actual: ' #ffffff',
      },
      {
        name: 'bg-surface-overlay',
        cssvar: ' --primitive-neutral-50',
        actual: ' #ffffff',
      },
      {
        name: 'bg-surface-muted',
        cssvar: ' --primitive-alpha-black-100',
        actual: ' rgba',
      },
      {
        name: 'bg-interactive-bold',
        cssvar: ' --primitive-neutral-300',
        actual: ' #c3c5c7',
      },
      {
        name: 'bg-interactive-bold-hover',
        cssvar: ' --primitive-neutral-200',
        actual: ' #d5d7d9',
      },
      {
        name: 'bg-interactive-bold-pressed',
        cssvar: ' --primitive-neutral-300',
        actual: ' #c3c5c7',
      },
      {
        name: 'bg-interactive-muted',
        cssvar: ' --primitive-neutral-300',
        actual: ' #c3c5c7',
      },
      {
        name: 'bg-interactive-muted-hover',
        cssvar: ' --primitive-neutral-200',
        actual: ' #d5d7d9',
      },
      {
        name: 'bg-interactive-muted-pressed',
        cssvar: ' --primitive-neutral-400',
        actual: ' #888a8f',
      },
      {
        name: '  bg-interactive-disabled',
        cssvar: ' --primitive-neutral-200',
        actual: ' #d5d7d9',
      },
      {
        name: '  bg-accent-primary-bold',
        cssvar: ' --primitive-accent-primary-700',
        actual: ' #004f7e',
      },
      {
        name: '  bg-accent-primary-hover',
        cssvar: ' --primitive-accent-primary-600',
        actual: ' #0068a1',
      },
      {
        name: '  bg-accent-primary-pressed',
        cssvar: ' --primitive-accent-primary-800',
        actual: ' #00213e',
      },
      {
        name: '  bg-accent-primary-muted',
        cssvar: ' --primitive-accent-primary-800',
        actual: ' #00213e',
      },
    ],
    utility: [
      {
        name: 'bg-info-bold',
        cssvar: ' --primitive-utility-info-400',
        actual: ' #888a8f',
      },
      {
        name: 'bg-info-hover',
        cssvar: ' --primitive-utility-info-300',
        actual: ' #c3c5c7',
      },
      {
        name: 'bg-info-pressed',
        cssvar: ' --primitive-utility-info-600',
        actual: ' #414245',
      },
      {
        name: 'bg-info-muted',
        cssvar: ' --primitive-utility-info-100',
        actual: ' #eff1f2',
      },
      {
        name: 'bg-advisory-bold',
        cssvar: ' --primitive-utility-advisory-600',
        actual: ' #3c67a0',
      },
      {
        name: 'bg-advisory-hover',
        cssvar: ' --primitive-utility-advisory-500',
        actual: ' #4e88da',
      },
      {
        name: 'bg-advisory-pressed',
        cssvar: '--primitive-utility-advisory-700',
        actual: '#264062',
      },
      {
        name: 'bg-advisory-muted',
        cssvar: ' --primitive-utility-advisory-800',
        actual: ' #1a2c43',
      },
      {
        name: 'bg-normal-bold',
        cssvar: ' --primitive-utility-normal-600',
        actual: ' #1c7e23',
      },
      {
        name: 'bg-normal-hover',
        cssvar: ' --primitive-utility-normal-500',
        actual: ' #26a12e',
      },
      {
        name: 'bg-normal-pressed',
        cssvar: ' --primitive-utility-normal-700',
        actual: ' #145718',
      },
      {
        name: 'bg-normal-muted',
        cssvar: ' --primitive-utility-normal-800',
        actual: ' #0e3b11',
      },
      {
        name: 'bg-serious-bold',
        cssvar: ' --primitive-utility-serious-600',
        actual: ' #bb7a00',
      },
      {
        name: 'bg-serious-hover',
        cssvar: ' --primitive-utility-serious-500',
        actual: ' #e89906',
      },
      {
        name: 'bg-serious-pressed',
        cssvar: ' --primitive-utility-serious-800',
        actual: ' #634101',
      },
      {
        name: 'bg-serious-muted',
        cssvar: ' --primitive-utility-serious-100',
        actual: ' #ffeac2',
      },
      {
        name: 'bg-critical-bold',
        cssvar: ' --primitive-utility-critical-700',
        actual: ' #790501',
      },
      {
        name: 'bg-critical-hover',
        cssvar: ' --primitive-utility-critical-600',
        actual: ' #a10701',
      },
      {
        name: '  bg-critical-pressed',
        cssvar: ' --primitive-utility-critical-800',
        actual: ' #540300',
      },
      {
        name: '  bg-critical-muted',
        cssvar: ' --primitive-utility-critical-100',
        actual: ' #ffc4c2',
      },
    ],
    a11y: [],
  },
  fg: {
    base: [
      {
        name: '  fg-primary-bold',
        cssvar: ' --primitive-neutral-800',
        actual: ' #212223',
      },
      {
        name: '  fg-primary-muted',
        cssvar: ' --primitive-neutral-300',
        actual: ' #c3c5c7',
      },
      {
        name: '  fg-inverse-bold',
        cssvar: ' --primitive-neutral-700',
        actual: ' #2f2f31',
      },
      {
        name: '  fg-inverse-muted',
        cssvar: ' --primitive-neutral-400',
        actual: ' #888a8f',
      },
      {
        name: '  fg-disabled',
        cssvar: ' --primitive-neutral-500',
        actual: ' #565759',
      },
      {
        name: '  fg-accent-primary-bold',
        cssvar: ' --primitive-accent-primary-400',
        actual: ' #009cde',
      },
      {
        name: '  fg-accent-primary-hover',
        cssvar: ' --primitive-accent-primary-200',
        actual: ' #6ed1ff',
      },
      {
        name: '  fg-accent-primary-pressed',
        cssvar: ' --primitive-accent-primary-600',
        actual: ' #0068a1',
      },
    ],
    utility: [
      {
        name: '  fg-info-bold',
        cssvar: ' --primitive-utility-info-400',
        actual: ' #888a8f',
      },
      {
        name: '  fg-info-hover',
        cssvar: ' --primitive-utility-info-200',
        actual: ' #d5d7d9',
      },
      {
        name: '  fg-info-pressed',
        cssvar: ' --primitive-utility-info-600',
        actual: ' #414245',
      },
      {
        name: '  fg-advisory-bold',
        cssvar: ' --primitive-utility-advisory-400',
        actual: ' #62a6ff',
      },
      {
        name: '  fg-advisory-hover',
        cssvar: ' --primitive-utility-advisory-200',
        actual: ' #a9ceff',
      },
      {
        name: '  fg-advisory-pressed',
        cssvar: ' --primitive-utility-advisory-600',
        actual: ' #3c67a0',
      },
      {
        name: '  fg-normal-bold',
        cssvar: ' --primitive-utility-normal-400',
        actual: ' #2bbf35',
      },
      {
        name: '  fg-normal-hover',
        cssvar: ' --primitive-utility-normal-200',
        actual: ' #86e98c',
      },
      {
        name: '  fg-normal-pressed',
        cssvar: ' --primitive-utility-normal-600',
        actual: ' #1c7e23',
      },
      {
        name: '  fg-serious-bold',
        cssvar: ' --primitive-utility-serious-400',
        actual: ' #fbab16',
      },
      {
        name: '  fg-serious-hover',
        cssvar: ' --primitive-utility-serious-200',
        actual: ' #ffd382',
      },
      {
        name: '  fg-serious-pressed',
        cssvar: ' --primitive-utility-serious-600',
        actual: ' #bb7a00',
      },
      {
        name: '  fg-critical-bold',
        cssvar: ' --primitive-utility-critical-400',
        actual: ' #ff2e27',
      },
      {
        name: '  fg-critical-hover',
        cssvar: ' --primitive-utility-critical-200',
        actual: ' #ff9390',
      },
      {
        name: '  fg-critical-pressed',
        cssvar: ' --primitive-utility-critical-600',
        actual: ' #a10701',
      },
    ],
    a11y: [
      {
        name: '  fg-a11y-on-accent',
        cssvar: ' --primitive-neutral-50',
        actual: ' #ffffff',
      },
      {
        name: '  fg-a11y-on-utility',
        cssvar: ' --primitive-neutral-50',
        actual: ' #ffffff',
      },
    ],
  },
  outline: [
    {
      name: '  outline-static',
      cssvar: ' --primitive-neutral-300',
      actual: ' #c3c5c7',
    },
    {
      name: '  outline-interactive',
      cssvar: ' --primitive-neutral-300',
      actual: ' #c3c5c7',
    },
    {
      name: '  outline-interactive-hover',
      cssvar: ' --primitive-neutral-400',
      actual: ' #888a8f',
    },
    {
      name: '  outline-interactive-pressed',
      cssvar: ' --primitive-neutral-200',
      actual: ' #d5d7d9',
    },
    {
      name: '  outline-interactive-disabled',
      cssvar: ' --primitive-neutral-200',
      actual: ' #d5d7d9',
    },
    {
      name: '  outline-accent-primary-bold',
      cssvar: ' --primitive-accent-primary-500',
      actual: ' #008fd0',
    },
    {
      name: '  outline-accent-primary-hover',
      cssvar: ' --primitive-accent-primary-600',
      actual: ' #0068a1',
    },
    {
      name: '  outline-accent-primary-pressed',
      cssvar: ' --primitive-accent-primary-400',
      actual: ' #009cde',
    },
    {
      name: '  outline-info-bold',
      cssvar: ' --primitive-utility-info-400',
      actual: ' #888a8f',
    },
    {
      name: '  outline-info-hover',
      cssvar: ' --primitive-utility-info-600',
      actual: ' #414245',
    },
    {
      name: '  outline-info-pressed',
      cssvar: ' --primitive-utility-info-500',
      actual: ' #565759',
    },
    {
      name: '  outline-advisory-bold',
      cssvar: ' --primitive-utility-advisory-400',
      actual: ' #62a6ff',
    },
    {
      name: '  outline-advisory-hover',
      cssvar: ' --primitive-utility-advisory-600',
      actual: ' #3c67a0',
    },
    {
      name: '  outline-advisory-pressed',
      cssvar: ' --primitive-utility-advisory-500',
      actual: ' #4e88da',
    },
    {
      name: '  outline-normal-bold',
      cssvar: ' --primitive-utility-normal-400',
      actual: ' #2bbf35',
    },
    {
      name: '  outline-normal-hover',
      cssvar: ' --primitive-utility-normal-600',
      actual: ' #1c7e23',
    },
    {
      name: '  outline-normal-pressed',
      cssvar: ' --primitive-utility-normal-500',
      actual: ' #26a12e',
    },
    {
      name: '  outline-serious-bold',
      cssvar: ' --primitive-utility-serious-600',
      actual: ' #bb7a00',
    },
    {
      name: '  outline-serious-hover',
      cssvar: ' --primitive-utility-serious-700',
      actual: ' #8e5d00',
    },
    {
      name: '  outline-serious-pressed',
      cssvar: ' --primitive-utility-serious-500',
      actual: ' #e89906',
    },
    {
      name: '  outline-critical-bold',
      cssvar: ' --primitive-utility-critical-400',
      actual: ' #ff2e27',
    },
    {
      name: '  outline-critical-hover',
      cssvar: ' --primitive-utility-critical-600',
      actual: ' #a10701',
    },
    {
      name: '  outline-critical-pressed',
      cssvar: ' --primitive-utility-critical-500',
      actual: ' #d40b04',
    },
    {
      name: '  shadow-elevation-raised',
      cssvar: ' --shadow-elevation-overlay',
      actual: ' 0 8px 10px 0 rgba(0 0 0 / 0.',
    },
    {
      name: '  shadow-elevation-overlay',
      cssvar: ' --shadow-elevation-raised',
      actual: ' 0 5px 5px 0 rgba(0 0 0 / 0.',
    },
  ],
};
