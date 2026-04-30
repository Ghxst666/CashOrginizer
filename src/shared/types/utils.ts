/**
 * Делает сложные вложенные типы более читаемыми.
 *
 * TypeScript иногда отображает типы в сложном виде, особенно если в них есть пересечения (`&`)
 * или вычисляемые свойства. `Prettify<T>` рекурсивно проходит по объекту `T` и раскрывает его типы,
 * делая их проще для восприятия.
 *
 * @example
 * type Complex = { a: string } & { b: number };
 * type Pretty = Prettify<Complex>;
 * // TypeScript теперь покажет { a: string; b: number } вместо { a: string } & { b: number }
 *
 * @template T - Тип, который нужно сделать более читаемым
 */
export type Prettify<T> = T extends object
  ? { [Key in keyof T]: Prettify<T[Key]> }
  : T
