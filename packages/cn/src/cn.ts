import type { CnClassArg } from './types'

/**
 * A utility for conditionally joining classNames together.
 *
 * Examples:
 *
 * ```ts
 * cn('foo', 'bar') // 'foo bar'
 * cn('foo', null, 'bar') // 'foo bar'
 * cn('foo', undefined, 'bar') // 'foo bar'
 * cn('foo', '', 'bar') // 'foo bar'
 * cn('foo', [falsyValue, 'bar']) // 'foo'
 * cn('foo', [falsyValue, 'bar', 'fallback']) // 'foo fallback'
 * cn('foo', [truthyValue, 'bar']) // 'foo bar'
 *
 * ```
 */
export function cn(...classNames: CnClassArg[]): string {
  return classNames
    .flatMap((arg) => {
      if (
        Array.isArray(arg) &&
        arg.length >= 2 &&
        (typeof arg[0] === 'boolean' || arg[0] === undefined || arg[0] === null)
      ) {
        if (arg.length > 2) {
          const [condition, valueIfTruthy, ...valuesIfFalsy] = arg

          return condition ? valueIfTruthy : valuesIfFalsy
        }

        const [condition, valueIfTruthy] = arg

        return condition ? valueIfTruthy : undefined
      }

      return arg
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
