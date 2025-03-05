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

// TS' `Function` type only models the object side of it, not whether it is callable.
type SomeFunction = (...args: any[]) => any;

/**
 * Ensures that the given function is only called once.
 * @param fn The function to call once.
 */
export const once = <T extends SomeFunction>(fn: T) => {
  let done = false;

  // TODO: Better types, since it can return void?
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  return (...args: Parameters<T>): ReturnType<T> | void =>
    // biome-ignore lint/suspicious/noAssignInExpressions: Shhhh
    // biome-ignore lint/style/noCommaOperator: Shhh
    done ? void 0 : ((done = true), fn(args));
};
