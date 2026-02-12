import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { ClassificationBadgeServerExample } from './server';

export function ClassificationBadgeExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <ClassificationBadgeServerExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
