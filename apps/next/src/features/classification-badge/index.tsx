import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { ClassificationBadgeServerExample } from './server';

export function LinkExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <ClassificationBadgeServerExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
