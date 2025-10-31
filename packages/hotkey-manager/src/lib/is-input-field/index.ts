export function isInputField(event: KeyboardEvent) {
  const target = event.target;

  if (!target) {
    return false;
  }

  return (
    (target instanceof HTMLElement && target.isContentEditable) ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
  );
}
