import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Defaults } from './defaults';
import { Theme } from './theme';

export const metadata: Metadata = {
  title: 'Next App',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en'>
      <body>
        <Theme>
          <Defaults>{children}</Defaults>
        </Theme>
      </body>
    </html>
  );
}
