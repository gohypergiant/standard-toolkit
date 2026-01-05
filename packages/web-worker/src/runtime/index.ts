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

const registeredFunctions = new Map();

export function register(fnName: string, callback: any) {
  registeredFunctions.set(fnName, callback);
}

export function onMessage(e: MessageEvent) {
  const message = e.data;

  if (message.type === 'execute') {
    const functionToCall = registeredFunctions.get(message.payload.fn);

    if (functionToCall) {
      Promise.resolve(functionToCall(message.payload.args)).then((result) => {
        self.postMessage({
          id: message.id,
          type: 'result',
          payload: {
            data: result,
          },
        });
      });
    }
  }
}

self.postMessage({ type: 'ready' });
