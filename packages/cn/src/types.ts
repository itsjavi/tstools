export type CnClassCondition = boolean | number | undefined | null
export type CnClassName = string | undefined | null
export type CnClassArg =
  | CnClassName
  | CnClassName[]
  | boolean
  | [ifTrueClass: CnClassName, condition: CnClassCondition]
  | [ifTrueClass: CnClassName, condition: CnClassCondition, elseClass: CnClassName]
  | {
      [key: string]: string | CnClassCondition | [condition: string | CnClassCondition, elseClass: CnClassName]
    }
