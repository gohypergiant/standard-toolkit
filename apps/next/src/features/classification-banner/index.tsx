import 'server-only';
import { ClassificationBannerClientExample } from './client';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';

export function ClassificationBannerExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <ClassificationBannerClientExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
