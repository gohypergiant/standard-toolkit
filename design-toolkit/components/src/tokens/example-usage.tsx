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

import React from 'react';
import {
  colorsHighlightPrimary03,
  colorsNeutral01,
  radiusMedium,
  spacingL,
  typographyBodyLSize,
} from './generated/tokens';

// Example of using tokens in JavaScript/TypeScript
const TokenExample: React.FC = () => {
  // You can use tokens directly in JavaScript
  const primaryColor = colorsHighlightPrimary03; // "#28f5be"
  const spacingLarge = spacingL; // "16px"

  // Example of using tokens for inline styles
  const inlineStyle = {
    backgroundColor: primaryColor,
    padding: spacingLarge,
    borderRadius: radiusMedium, // "4px"
  };

  return (
    <div>
      <h2>Token Usage Examples</h2>

      {/* Using tokens in inline styles */}
      <div style={inlineStyle}>This div uses tokens for inline styles</div>

      {/* Using tokens in className (via CSS variables) */}
      <div className='bg-highlight-primary-03 p-l rounded-medium'>
        This div uses tokens via CSS classes
      </div>

      {/* Using tokens for dynamic styling */}
      <div
        style={{
          color: colorsNeutral01,
          fontSize: typographyBodyLSize,
        }}
      >
        Dynamic styling with tokens
      </div>
    </div>
  );
};

export default TokenExample;
