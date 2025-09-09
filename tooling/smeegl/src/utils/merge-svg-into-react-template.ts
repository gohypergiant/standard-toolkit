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

export const ASSUMED_DEFAULT_FILL_COLOR = '#FF69B4';

const fileTemplate = `
/**
 * THIS IS A GENERATED FILE. DO NOT ALTER DIRECTLY.
 */

import type { SVGProps } from 'react';

interface Props {
  title?: string;
  titleId?: string;
}
export const __REPLACE_WITH_COMPONENT_NAME__ = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & Props) => {
  const { fill } = props;
  const fillColor = fill ?? '${ASSUMED_DEFAULT_FILL_COLOR}'
  const hasTitle = typeof title === 'string' && Boolean(title.trim());

  return (

    __REPLACE_WITH_SVG_CONTENT__

)};
`;

export const mergeSvgIntoReactTemplate = (
  componentName: string,
  rawSvgContent: string,
) => {
  const content = fileTemplate
    .replace(/__REPLACE_WITH_COMPONENT_NAME__/g, componentName)
    .replace(/__REPLACE_WITH_SVG_CONTENT__/g, rawSvgContent)
    .replaceAll('fill-rule', 'fillRule')
    .replaceAll('clip-rule', 'clipRule')
    .replaceAll('clip-path', 'clipPath')
    .replaceAll('stroke-width', 'strokeWidth')
    .replaceAll('stroke-dasharray', 'strokeDasharray')
    .replaceAll('fill-opacity', 'fillOpacity')
    .replace(/fill="#([^"]*)"/g, 'fill={fillColor}')
    .replace(/fill='#([^']*)'/g, 'fill={fillColor}')
    .replace(
      'xmlns="http://www.w3.org/2000/svg">',
      'xmlns="http://www.w3.org/2000/svg" aria-labelledby={hasTitle ? titleId : undefined} {...props}> \n     {hasTitle && <title id={titleId}>{title}</title>}',
    );

  return content;
};
