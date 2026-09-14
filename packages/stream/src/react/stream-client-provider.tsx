// __private-exports

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

'use client';
import * as React from 'react';
import type { StreamClient } from '../index';

export const StreamClientContext = React.createContext<
  StreamClient | undefined
>(undefined);

/** Context StreamClient (or override). Throws outside provider. */
export const useStreamClient = (client?: StreamClient): StreamClient => {
  const contextClient = React.useContext(StreamClientContext);

  if (client) {
    return client;
  }

  if (!contextClient) {
    throw new Error('No StreamClient set, use StreamClientProvider to set one');
  }

  return contextClient;
};

export type StreamClientProviderProps = {
  client: StreamClient;
  children?: React.ReactNode;
};

/** QueryClientProvider analog. */
export const StreamClientProvider = ({
  client,
  children,
}: StreamClientProviderProps): React.JSX.Element => {
  React.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);

  return (
    <StreamClientContext.Provider value={client}>
      {children}
    </StreamClientContext.Provider>
  );
};
