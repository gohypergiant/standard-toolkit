import { test } from 'vitest';
// import { concat } from '.';
// import { Semigroup } from '../../functors/2b_semigroup';
// import { Monoid } from '../../functors/3c_monoid';

// const arr1 = [1, 2, 3, 4, 5];
// const arr2 = [6, 7, 8, 9, 0];
// const semi = Semigroup('hello ');
// const semi2 = Semigroup('world');
// const mon = Monoid('hello ');
// const mon2 = Monoid('world');

// describe('concat', () => {
//   it('should work with Arrays', () => {
//     const task = concat(arr2);
//     const actual = task(arr1);
//     const actual2 = concat(arr2)(arr1);

//     expect(Array.isArray(actual)).toBeTruthy();
//     expect(Array.isArray(actual2)).toBeTruthy();

//     expect(actual).toHaveLength(arr1.length + arr2.length);
//     expect(actual2).toHaveLength(arr1.length + arr2.length);

//     expect(actual).toStrictEqual(arr1.concat(arr2));
//     expect(actual2).toStrictEqual(arr1.concat(arr2));
//   });

//   it('should work with Semigroups', () => {
//     const task = concat(semi2);
//     const actual = task(semi);
//     const actual2 = concat(semi2)(semi);

//     expect(actual.inspect()).toEqual('Semigroup(hello world)');
//     expect(actual.__value).toEqual('hello world');

//     expect(actual2.inspect()).toEqual('Semigroup(hello world)');
//     expect(actual2.__value).toEqual('hello world');
//   });

//   it('should work with Monoids', () => {
//     const task = concat(mon2);
//     const actual = task(mon);
//     const actual2 = concat(mon2)(mon);

//     expect(actual.inspect()).toEqual('Monoid(hello world)');
//     expect(actual.__value).toEqual('hello world');

//     expect(actual2.inspect()).toEqual('Monoid(hello world)');
//     expect(actual2.__value).toEqual('hello world');
//   });

//   // it('should work with Groups', () => {});
// });

test.skip('do these tests');
