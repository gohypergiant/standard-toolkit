// const isFunction = (value: any) => typeof value === 'function';

// class IO {
//   constructor(effect) {
//     if(!isFunction(effect)) {
//       throw new Error('effect needs to be a function');
//     }

//     this._effect = effect;
//   }

//   static of(val) {
//     return new IO(() => val);
//   }

//   static from(fn) {
//     return new IO(fn);
//   }

//   map(fn) {
//     return new IO(() => fn(this._effect()));
//   }

//   chain(fn) {
//     return fn(this._effect());
//   }

//   run() {
//     return this._effect();
//   }
// }

// export default IO;

// ^ TODO
// eslint-disable-next-line
export interface IO_<T> {}

export const IO = <T>(v: T): IO_<T> => ({
  name: 'IO',
  __value: v,
  // impurePerform: v,
});
