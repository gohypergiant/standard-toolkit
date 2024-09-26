import { expect, test } from 'vitest';
import { mapHelper } from '.';
import { Functor, type Functor_ } from '../../functors/1_functor';
import { Monad, type Monad_ } from '../../functors/4_monad';

const func = Functor(42);
const monad = Monad.of(42);

const numStr = (n: number) => `${n}`;

test('it should work with Functors', () => {
  const task = mapHelper(numStr);
  const actual = task(func) as Functor_<string>;
  const actual2 = mapHelper(numStr)(func) as Functor_<string>;

  expect(actual.inspect()).toEqual('Functor(42)');
  expect(actual.__value).toEqual('42');

  expect(actual2.inspect()).toEqual('Functor(42)');
  expect(actual2.__value).toEqual('42');
});

test('it should work with Monads', () => {
  const task = mapHelper(numStr);
  const actual = task(monad) as Monad_<string>;
  const actual2 = mapHelper(numStr)(monad) as Monad_<string>;

  expect(actual.inspect()).toEqual('Monad(42)');
  expect(actual.__value).toEqual('42');

  expect(actual2.inspect()).toEqual('Monad(42)');
  expect(actual2.__value).toEqual('42');
});
