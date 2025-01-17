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

/**
 * TypeDoc plugin for replacing @playground blocks with our custom playground component,
 *
 * @param {import('typedoc').Application} app
 */
export function load(app) {
  app.converter.on('createSignature', convertPlaygroundBlockToComponent);
}

/**
 * @param {import('typedoc').Context>} context
 * @param {import('typedoc').Models.SignatureReflection} reflection
 */
function convertPlaygroundBlockToComponent(context, reflection) {
  const playgroundTag = reflection?.comment?.blockTags?.find(
    ({ tag }) => tag === '@playground',
  );

  if (playgroundTag) {
    const code = playgroundTag.content[0].text.trim();
    playgroundTag.content = [
      {
        kind: 'text',
        text: `import { Playground } from '@site/src/components/playground';

<Playground
  code={\`${code}\`}
  dependencies={['${context.project.name}']}
/>
        `,
      },
    ];
  }
}
