import { BinaryTree, ChildNode } from "./deps.ts";

/** PostCSS AST to JavaScript Object(CSS-in-JS) */
export function toObject(
  ast: { nodes: ChildNode[] },
): BinaryTree<string | number> {
  return ast.nodes.reduce((acc, cur) => {
    if (cur.type === "atrule") {
      const atRule = constructAtRule(cur.name, cur.params);
      return { ...acc, [atRule]: toObject(cur) };
    }
    if (cur.type === "rule") {
      return { ...acc, [cur.selector]: toObject(cur) };
    }
    if (cur.type === "decl") {
      const prop = constructProp(cur.prop, cur.variable);
      const value = constructValue(cur.value, cur.important);
      return { ...acc, [prop]: value };
    }
    return acc;
  }, {});
}

export function constructAtRule(name: string, params: string): string {
  const withParams = params ? ` ${params}` : "";
  const atRule = `@${name}${withParams}`;
  return atRule;
}

export function constructValue(
  value: string,
  important: boolean,
): string | number {
  value = value.trim();
  if (important) {
    const IMPORTANT = "!important";
    return value ? `${value} ${IMPORTANT}` : IMPORTANT;
  }
  // Convert only numbers without a unit to type `number`.
  if (/^[\d.\s]+$/.test(value)) {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? number : value;
  }

  return value;
}

export function constructProp(prop: string, variable: boolean): string {
  prop = prop.trim();
  // if custom property, just return
  return variable ? prop : camelCase(prop);
}

export function camelCase(value: string): string {
  // $ is SASS variable
  return value.toLowerCase().replace(
    /-(\w|$)/g,
    (_, char) => char.toUpperCase(),
  );
}
