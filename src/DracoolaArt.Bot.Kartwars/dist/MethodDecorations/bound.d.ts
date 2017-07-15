/**
 * Binds an instance method to the containing class to persist the lexical scope of 'this'.
 * @param target The target class or prototype; used by the TypeScript compiler (omit function call brackets to use as a decorator).
 * @param propKey The property key of the target method; used by the TypeScript compiler (omit function call brackets to use as a decorator).
 */
declare function bound(target: Object, propKey: string | symbol): PropertyDescriptor;
