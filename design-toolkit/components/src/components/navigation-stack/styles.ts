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

import {tv} from "@/lib/utils"
import type { VariantProps} from "tailwind-variants"

export const NavigationStackStylesDefaults = {} as const;

export const NavigationStackStyles = tv({
  slots: {
    backButton: 'flex items-center justify-center',
    container: 'flex h-full w-full flex-col',
    content: 'flex-1 overflow-auto text-body-m',
    header: '',
    headerContent: 'flex items-center',
    title: 'text-default-light',
    view: 'flex flex-1 flex-col'
  },
  variants: {
    hasBackButton: {
      true: {
        headerContent: 'justify-between'
      },
      false: {
        headerContent: 'justify-start'
      }
    },
    canGoBack: {
      true: {
        title: 'text-body-m'
      },
      false: {
        title: 'text-header-l'
      }
    }
  },
  defaultVariants: NavigationStackStylesDefaults
})

export type NavigationStackStyleVariants = VariantProps<typeof NavigationStackStyles>
