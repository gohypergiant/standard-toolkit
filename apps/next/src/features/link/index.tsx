import 'server-only';
import { LinkClientExample } from './client';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';

export function LinkExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <LinkClientExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
