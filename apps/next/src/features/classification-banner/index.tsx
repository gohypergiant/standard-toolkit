import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { LinkServerExample } from './server';

export function LinkExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <LinkServerExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
