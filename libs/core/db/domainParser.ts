type SimpleOperator =
  | "="
  | "!="
  | "ilike"
  | "not ilike"
  | "in"
  | "not in"
  | ">"
  | "<"
  | ">="
  | "<=";

type LogicalOperator = "and" | "or" | "not";

type DomainCondition = [string, SimpleOperator, any];
type DomainLogical = [LogicalOperator, ...Domain[]];
export type Domain = DomainCondition | DomainLogical;

export function parseDomain(domain: Domain): any {
  if (!Array.isArray(domain)) return {};

  const [first] = domain;

  if (first === "and" || first === "or" || first === "not") {
    const logic = first as LogicalOperator;
    const [, ...conditions] = domain as DomainLogical;
    const subDomains = conditions.map((d) => parseDomain(d));
    if (logic === "not") return { NOT: subDomains[0] };
    return { [logic.toUpperCase()]: subDomains };
  }

  const [field, operator, value] = domain as DomainCondition;

  const fieldParts = field.split(".");
  let current: any = {};
  let cursor = current;

  for (let i = 0; i < fieldParts.length - 1; i++) {
    cursor[fieldParts[i]] = {};
    cursor = cursor[fieldParts[i]];
  }

  const lastField = fieldParts[fieldParts.length - 1];
  let condition: any;

  switch (operator) {
    case "=":
      condition = value;
      break;
    case "!=":
      condition = { not: value };
      break;
    case "ilike":
      condition = { contains: value, mode: "insensitive" };
      break;
    case "not ilike":
      condition = { not: { contains: value, mode: "insensitive" } };
      break;
    case "in":
      condition = { in: value };
      break;
    case "not in":
      condition = { notIn: value };
      break;
    case ">":
      condition = { gt: value };
      break;
    case "<":
      condition = { lt: value };
      break;
    case ">=":
      condition = { gte: value };
      break;
    case "<=":
      condition = { lte: value };
      break;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }

  cursor[lastField] = condition;
  return current;
}
