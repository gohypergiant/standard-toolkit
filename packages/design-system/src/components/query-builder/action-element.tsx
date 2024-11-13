import type { PressEvent } from '@react-types/shared';
import { useCallback, useMemo } from 'react';
import { Button } from '../button';
import type { ActionProps } from './types';
import { pressToMouseEvent } from './utils';

export function ActionElement({
  disabled,
  disabledTranslation,
  title: titleProp,
  handleOnClick,
}: ActionProps) {
  const handlePress = useCallback(
    (event: PressEvent) => handleOnClick(pressToMouseEvent(event)),
    [handleOnClick],
  );

  const title = useMemo(
    () =>
      disabledTranslation?.title && disabled
        ? disabledTranslation.title
        : titleProp,
    [disabledTranslation?.title, disabled, titleProp],
  );

  return (
    <Button isDisabled={disabled && !disabledTranslation} onPress={handlePress}>
      {title}
    </Button>
  );
}
