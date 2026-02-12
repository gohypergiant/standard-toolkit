import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { HeroServerExample } from './server';

export function HeroExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <HeroServerExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
