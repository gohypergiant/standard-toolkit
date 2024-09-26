import { IDENTITY_ELEMENTS } from '../identity-elements';

export const concatByType = <T>(v1: T, v2: T) => {
  const t1 = typeof v1;
  const t2 = typeof v2;

  if (v1 === null) {
    return IDENTITY_ELEMENTS.Null;
  }

  if (v1 === undefined) {
    return IDENTITY_ELEMENTS.Undefined;
  }

  if (t1 === 'string' && t2 === 'string') {
    return (v1 as unknown as string) + (v2 as unknown as string);
  }

  if (t1 === 'number' && t2 === 'number') {
    return (v1 as unknown as number) + (v2 as unknown as number);
  }

  if (t1 === 'boolean' && t2 === 'boolean') {
    return (v1 as unknown as boolean) && (v2 as unknown as boolean);
  }

  // Arrays are "object" so check strict array first
  if (Array.isArray(v1) && Array.isArray(v2)) {
    return [...(v1 as unknown as []), ...(v2 as unknown as [])];
  }

  if (t1 === 'object' && t2 === 'object') {
    return { ...v1, ...v2 };
  }

  // TODO: Dont know if this really makes sense
  // if (t1 === 'function' && t2 === 'function') {
  //   return (v2 as unknown as Function)((v1 as unknown as Function)());
  // }

  // Cant concat type
  return;
};
