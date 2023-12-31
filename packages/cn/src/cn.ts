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
    .flatMap((arg): Array<boolean | number | CnClassName> | boolean | number | CnClassName => {
      if (Array.isArray(arg) && arg.length < 2) {
        return arg
      }

      if (Array.isArray(arg) && arg.length >= 2) {
        const isConditional =
          typeof arg[1] === 'number' || typeof arg[1] === 'boolean' || arg[1] === undefined || arg[1] === null
        if (!isConditional) {
          return arg
        }

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

        return Object.entries(arg).map(
          ([valueIfTruthy, value]: [string, string | CnClassCondition | [string | CnClassCondition, CnClassName]]) => {
            if (Array.isArray(value)) {
              const [condition, elseValue] = value

              return condition ? valueIfTruthy : elseValue
            }

            return value ? valueIfTruthy : undefined
          },
        )
      }

      if (arg === true) {
        return ''
      }

      return arg
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
