// biome-ignore lint/correctness/noUnusedImports: not sure what else to do
import React, { type PropsWithChildren, useState } from 'react';

export function Playground(props) {
  // const [value, setValue] = useState('');

  return (
    <div>
      {props.children}
      {/* <textarea
        id='editor'
        name='editor'
        onChange={({ target }) => setValue(target.value)}
        style={{
          display: 'flex',
          margin: 0,
          padding: '1em',
          width: '-webkit-fill-available',
        }}
        value={value}
      /> */}
    </div>
  );
}

export function Run({
  children,
  context,
}: PropsWithChildren<{ context: CallableFunction }>) {
  const lines = children.map((child) => child.props.children);
  const code = [...lines.slice(0, -1), `return ${lines.at(-1)}`].join('\n');
  const result = new Function('context', `with(context){${code}}`)(context);

  return (
    <>
      <strong>Result</strong>
      <div className='language-ts'>
        <div className='rspress-code-content rspress-scrollbar'>
          <div>
            <pre>
              <code
                style={{
                  display: 'block',
                  padding: '0px 1.25rem',
                }}
              >
                {`// ${JSON.stringify(result)}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
