import 'server-only';
import { ClassificationBadgeClientExample } from './client';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';

export function ClassificationBadgeExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <ClassificationBadgeClientExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
