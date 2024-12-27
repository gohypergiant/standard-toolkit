// NOTE: this is not being used but is an example of how to build a custom markdown plugin

type NodeMeta = {
  children?: any[];
  lang: string;
  // position: {
  //   end: NodeMetaPosition;
  //   start: NodeMetaPosition;
  // };
  type: string;
};

// type NodeMetaPosition = object;

const template = (pack: string) => `
import { Tab, Tabs } from 'rspress/theme';

<Tabs>
  <Tab label="pnpm">
\`\`\`bash
pnpm add ${pack}
\`\`\`
  </Tab>
  <Tab label="npm">
\`\`\`bash
npm install --save ${pack}
\`\`\`
  </Tab>
</Tabs>
`;

export default function plugin(..._configOptions: any) {
  return (node: NodeMeta) => {
    if (node.children) {
      for (const index in node.children) {
        const { lang, type } = node.children[index];

        if (type === 'code' && lang === 'depsInstall') {
          node.children[index].value = template(node.children[index].value);
        }
      }
    }
  };
}
