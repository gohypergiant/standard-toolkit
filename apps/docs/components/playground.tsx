import MonacoEditor from '@monaco-editor/react';
import type React from 'react';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  files: Record<string, object>;
}>;

export default function Playground({ children, files }: Props) {
  console.log(files);

  const code = (children as React.ReactElement).props.children.props.children;

  // const [value, setValue] = useState(code);

  return (
    <figure>
      {/* {children} */}

      <MonacoEditor
        defaultLanguage='typescript'
        defaultValue={code}
        height='24em'
        options={{
          minimap: { enabled: false },
        }}
        theme='vs-dark'
      />
    </figure>
  );
}
