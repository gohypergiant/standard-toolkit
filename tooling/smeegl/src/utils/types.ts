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

import type { Result, Unit } from 'true-myth';

type ErrorPath = { msg: string; tmp: string | null };

export type CrcType = 'DEC' | 'HEX';
export type TargetType = 'SPRITESHEET' | 'REACT';

export type SpriteInfo = {
  name: string; // sprite name, no extension
  fileName: string; // kebob-case name with extension
  filePath: string; // filename in the tmpDir
  parentPath: string; // parent folder path segment compared to root
  indexName?: string; // sprite definition name, used for binary naming
};

export type FindSpritesOutput = {
  tmp: string | null;
  commonBasePath: string;
  sprites: SpriteInfo[];
};

type CopySpritesOutput = { tmp: string; sprites: SpriteInfo[] };
type GenerateSpritesOutput = {
  tmp: string;
  json: string;
  png: string;
  sprites: SpriteInfo[];
};

export type FindSpritesResult = Result<FindSpritesOutput, ErrorPath>;
export type CopySpritesResult = Result<CopySpritesOutput, ErrorPath>;
export type GenerateSpritesResult = Result<GenerateSpritesOutput, ErrorPath>;
export type GenerateConstantsResult = Result<{ tmp: string }, ErrorPath>;
export type CleanUpTempDirectoryResult = Result<Unit, string>;
