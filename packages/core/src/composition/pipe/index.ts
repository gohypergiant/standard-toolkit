/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UnaryFunction } from '@/types';

// If its a list of functions, last being Unary
type PipeParams<Fns> = Fns extends readonly [
  infer First extends UnaryFunction,
  ...any[],
]
  ? // Get Params of the first, which returns [...argTypes], so get the first one [0]
    // so that we have the true type of the arg
    Parameters<First>[0]
  : never;

// Get the return type of the last function in the list (last to be called)
// have to spread and infer last so that it gets the right type for the last one
// [-1] no bueno
type PipeReturn<Fns> = ReturnType<
  Fns extends readonly [...any[], infer Last extends UnaryFunction]
    ? Last
    : never
>;

type Pipeable<Fn> =
  // If it's a single func, just return it
  Fn extends readonly [UnaryFunction]
    ? Fn
    : // if its a list of Unary funcs (ignoring the last)
      Fn extends readonly [...infer Head extends readonly UnaryFunction[], any]
      ? // Start building the list of func type by using the return type of the last in Head
        // as the arg of the previous in line and recursively spread the rest (doing the same thing)
        // The last is ignored but handled by the top level FlowReturn
        readonly [...Pipeable<Head>, (arg: PipeReturn<Head>) => any]
      : never;

/**
 * Allows you combine two or more functions to create a new function, which passes the results from one
 * function to the next until all have be called. Has a left-to-right call order.
 *
 * @example
 * const getActiveUsers = page => pipe(
 *   filterActive,
 *   sortUserNames,
 *   displayPage,
 * );
 *
 * const activeUsers = getActiveUsersByPage(users);
 */
export const pipe =
  <Fns extends readonly UnaryFunction[]>(...fns: Pipeable<Fns>) =>
  (arg: PipeParams<Fns>): PipeReturn<Fns> => {
    return fns.reduce((acc, cur) => cur(acc), arg) as PipeReturn<Fns>;
  };
