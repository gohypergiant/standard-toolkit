import MonacoEditor from '@monaco-editor/react';
import type React from 'react';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  context: object;
}>;

export default function Playground({ children }: Props) {
  // props.context
  const code = (children as React.ReactElement).props.children.props.children;

  // const [value, setValue] = useState(code);

  return (
    <figure>
      {children}

      <MonacoEditor
        defaultLanguage='typescript'
        defaultValue={code}
        height='24em'
        theme='vs-dark'
      />
    </figure>
  );
}
