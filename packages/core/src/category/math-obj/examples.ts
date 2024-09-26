import { MathObj } from '.';

const numModule = MathObj(42);
const strModule = MathObj('testing');
const fnModule = MathObj((x: any) => x);

console.log('Type:', MathObj.name);
console.log('Example: M1 Value ➞', numModule.inspect());
console.log('Example: M2 Value ➞', strModule.inspect());
console.log('Example: M3 Value ➞', fnModule.inspect());

console.log();
