import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { ClassificationBannerServerExample } from './server';

export function ClassificationBannerExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <ClassificationBannerServerExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
