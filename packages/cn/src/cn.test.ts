import { cn } from './cn'

describe('cn (classNames)', () => {
  it('should return empty string if no arguments passed', () => {
    expect(cn()).toBe('')
  })
  it('should concatenate class names together', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz')
  })

  it('should handle conditional class names', () => {
    expect(cn(['foo', true], ['bar', false], ['baz', true])).toBe('foo baz')
  })

  it('should handle objects with conditions', () => {
    expect(
      cn({
        foo: true,
        bar: [false, 'bar-alt'],
        baz: true,
        lg: 1,
        md: 'md',
        xl: true,
      }),
    ).toBe('foo bar-alt baz lg md xl')
  })

  it('should handle if-else conditional class names', () => {
    expect(cn('foo', ['qux', true, 'baz'])).toBe('foo qux')
    expect(cn('foo', ['qux', 0, 'baz'])).toBe('foo baz')
  })

  it('should handle undefined and null class names', () => {
    expect(cn(undefined, null, 'foo', null)).toBe('foo')
  })

  it('should return empty string if no conditions match', () => {
    expect(cn(undefined, null, false, true, [null])).toBe('')
  })

  it('should handle empty and whitespace-only class names', () => {
    expect(cn('', ' ', 'foo', '   ', 'bar')).toBe('foo bar')
  })

  it('support arrays of class names', () => {
    expect(cn(['foo', 'bar'], ['baz'])).toBe('foo bar baz')
  })
})
