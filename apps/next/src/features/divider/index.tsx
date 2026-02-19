import 'server-only';
import { DividerClientExample } from './client';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';

export function DividerExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <DividerClientExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
