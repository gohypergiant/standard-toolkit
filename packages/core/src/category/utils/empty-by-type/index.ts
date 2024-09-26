import { IDENTITY_ELEMENTS } from '../identity-elements';

export const emptyByType = <T>(val: T) => {
  const t = typeof val;

  if (val === null) {
    return IDENTITY_ELEMENTS.Null;
  }

  if (val === undefined) {
    return IDENTITY_ELEMENTS.Undefined;
  }

  if (t === 'string') {
    return IDENTITY_ELEMENTS.String;
  }

  if (t === 'number') {
    return IDENTITY_ELEMENTS.Additive;
  }

  if (t === 'boolean') {
    return IDENTITY_ELEMENTS.Boolean;
  }

  // Arrays are "object" so check strict array first
  if (Array.isArray(val)) {
    return IDENTITY_ELEMENTS.Array;
  }

  if (t === 'object') {
    return IDENTITY_ELEMENTS.Object;
  }

  // Dont know if this really makes sense
  if (t === 'function') {
    return IDENTITY_ELEMENTS.Function;
  }

  // Cant concat type
  return;
};
