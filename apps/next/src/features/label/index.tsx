import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { LabelServerExample } from './server';

export function LabelExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <LabelServerExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
