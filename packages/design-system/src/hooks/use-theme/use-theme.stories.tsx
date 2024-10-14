import type { Story, StoryDefault } from '@ladle/react';
import { genericColorVars, semanticColorVars, sizeVars } from '../../styles';
import { useTheme } from './use-theme';

export default {
  title: 'Hooks',
} satisfies StoryDefault;

export const Example: Story = () => {
  const { contract } = useTheme({
    colors: {
      generic: genericColorVars,
      semantic: semanticColorVars,
    },
    sizes: sizeVars,
  });

  console.log(contract);

  return <div>See story and console for details</div>;
};

Example.storyName = 'useTheme';
