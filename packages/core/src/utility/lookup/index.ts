import { I as identity } from '@/combinators';

export const lookup =
  <
    A extends Record<string | number | symbol, unknown>,
    B extends (...args: any[]) => any
  >(
    obj: A,
    def: B
  ) =>
  <C extends keyof A>(prop: string | number | symbol): A[C] => {
    const fn = def ?? identity;

    return fn(obj[prop]);
  };
