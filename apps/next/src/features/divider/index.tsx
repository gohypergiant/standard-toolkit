import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { DividerServerExample } from './server';

export function DividerExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <DividerServerExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
