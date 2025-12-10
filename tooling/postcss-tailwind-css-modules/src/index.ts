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

import parser, { type ClassName, type Root } from 'postcss-selector-parser';
import type { Plugin, Rule } from 'postcss';

const PROCESSED = Symbol('global-group-class-processed');
interface ProcessedRule extends Rule {
  [PROCESSED]?: boolean;
}

const globalGroupPlugin = (): Plugin => {
  const transform = parser((selectors: Root) => {
    selectors.walkClasses((currentClassNode: ClassName) => {
      if (!currentClassNode.value.startsWith('group/')) {
        return;
      }
      const globalWrapped = parser
        .pseudo({
          value: ':global',
        })
        .append(
          parser.selector({ value: '' }).append(currentClassNode.clone()),
        );
      currentClassNode.replaceWith(globalWrapped);
    });
  });

  return {
    postcssPlugin: '@accelint/postcss-tailwind-css-modules',

    Rule(rule: ProcessedRule) {
      const filePath = rule.root().source?.input.file;
      if (
        // do not apply this transformation if file is not a css module
        !filePath?.endsWith('.module.css') ||
        // ensure we don't wrap in :global() more than once
        rule[PROCESSED]
      ) {
        return;
      }

      rule.selector = transform.processSync(rule.selector);
      rule[PROCESSED] = true;
    },
  };
};

globalGroupPlugin.postcss = true;

export default globalGroupPlugin;
