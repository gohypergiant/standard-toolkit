// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from 'react';
import { Tab, Tabs } from 'rspress/theme';

export default function Component({ pack }: { pack: string }) {
  return (
    <Tabs>
      {...[
        tab('pnpm', 'add', pack),
        tab('npm', 'install -save', pack),
        tab('yarn', 'add', pack),
      ]}
    </Tabs>
  );
}

function tab(label: string, command: string, pack: string) {
  return (
    <Tab label={label}>
      <div aria-label={label} className='rounded px-2'>
        <div className='language-bash'>
          <div className='rspress-code-content rspress-scrollbar'>
            <div>
              <pre className='code' style={{ backgroundColor: 'inherit' }}>
                <code className='language-bash' style={{ whiteSpace: 'pre' }}>
                  <span style={{ display: 'block', padding: '0px 1.25rem' }}>
                    <span
                      className='linenumber react-syntax-highlighter-line-number'
                      style={{
                        display: 'inline-block',
                        minWidth: '1.25em',
                        paddingRight: '1em',
                        textAlign: 'right',
                        userSelect: 'none',
                        color: 'var(--code-token-comment)',
                      }}
                    >
                      1
                    </span>
                    <span>
                      {label} {command} {`@accelint/${pack}`}
                    </span>
                  </span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Tab>
  );
}
