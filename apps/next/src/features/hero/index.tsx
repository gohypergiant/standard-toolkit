import 'server-only';
import { HeroClientExample } from './client';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';

export function HeroExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <HeroClientExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
