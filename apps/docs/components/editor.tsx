// biome-ignore lint/correctness/noUnusedImports: just needs to be in scope
import React, { type PropsWithChildren, useEffect } from 'react';

export default function Editor() {
  useEffect(() => {
    import('https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm')
      .then((lib) => {
        globalThis.monaco = lib;
      })
      .catch(() => {
        // TODO: do something with this error state???
      });
  }, []);
}
