import type { CnClassArg, CnClassCondition, CnClassName } from './types'

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
    .flatMap((arg): Array<boolean | CnClassName> | boolean | CnClassName => {
      if (Array.isArray(arg) && arg.length >= 2) {
        if (arg.length > 2) {
          const [valueIfTruthy, condition, elseValue] = arg

          return condition ? valueIfTruthy : elseValue
        }

        const [valueIfTruthy, condition] = arg

        return condition ? valueIfTruthy : undefined
      }

      if (typeof arg === 'object') {
        if (arg === null) {
          return []
        }

        return Object.entries(arg).map(([valueIfTruthy, value]: [string, string | [CnClassCondition, string]]) => {
          if (Array.isArray(value)) {
            const [condition, elseValue] = value

            return condition ? valueIfTruthy : elseValue
          }

          return value ? valueIfTruthy : undefined
        })
      }

      return arg
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
