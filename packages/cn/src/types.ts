export type CnClassCondition = boolean | undefined | null
export type CnClassName = string | undefined | null
export type CnClassArg =
  | CnClassName
  | CnClassName[]
  | [condition: CnClassCondition, ifTrueClass: CnClassName, ...elseClasses: CnClassName[]]
