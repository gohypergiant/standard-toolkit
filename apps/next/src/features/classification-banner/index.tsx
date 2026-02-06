import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { ClassificationBannerServerExample } from './server';

export function LinkExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <ClassificationBannerServerExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
