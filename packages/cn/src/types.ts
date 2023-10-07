export type CnClassCondition = boolean | undefined | null
export type CnClassName = string | undefined | null
export type CnClassArg =
  | CnClassName
  | CnClassName[]
  | [ifTrueClass: CnClassName, condition: CnClassCondition]
  | [ifTrueClass: CnClassName, condition: CnClassCondition, elseClass: CnClassName]
  | {
      [key: string]: CnClassCondition | [condition: CnClassCondition, elseClass: CnClassName]
    }
