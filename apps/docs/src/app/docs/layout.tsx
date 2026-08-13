import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout {...baseOptions()} tree={source.getPageTree()} tabMode='auto' tabs={[
      {
        title: 'Standard Toolkit',
        description: 'TODO',
        url: '/docs',
      },
      {
        title: 'Neo Toolkit',
        description: 'TODO',
        url: 'https://neo-toolkit.accelint.io',
      },
      {
        title: 'Agent Skills',
        description: 'TODO',
        url: 'https://agent-skills.accelint.io',
      },
    ]}>
      {children}
    </DocsLayout>
  );
}
