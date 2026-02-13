import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { DividerClientExample } from './server';

export function DividerExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <DividerClientExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
