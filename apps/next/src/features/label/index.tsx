import 'server-only';
import { LabelClientExample } from './client';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';

export function LabelExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <LabelClientExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
