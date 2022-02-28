import {
  AtRule,
  BinaryTree,
  ChildNode,
  Declaration,
  isObject,
  Root,
  Rule,
} from "./deps.ts";

const reImportant = /\s*!important\s*$/i;

function hyphenCase(value: string): string {
  return value.replace(/([A-Z])/g, "-$1");
}

function dashify(value: string): string {
  return hyphenCase(value).toLocaleLowerCase();
}

function decl(name: string, value: string): Declaration {
  if (!name.startsWith("--")) {
    name = dashify(name);
  }
  value = value.trim();
  const _value = reImportant.test(value)
    ? (() => {
      const _value = value.replace(reImportant, "");
      return { value: _value, important: true };
    })()
    : { value };

  return new Declaration({ prop: name, ..._value });
}

function atRule(
  name: string,
  value: BinaryTree<string | number> | string | number,
  params?: string,
): AtRule {
  const atRule = new AtRule({ name, params });
  if (typeof value === "object") {
    return atRule.append(toAST(value));
  }
  return atRule;
}

function isAtRule(value: string): boolean {
  return value.charAt(0) === "@";
}

/** JavaScript Object(CSS-in-JS) to postcss AST
 * ```ts
 * import { toAST } from "https://deno.land/x/postcss_js@$VERSION/mod.ts"
 * const css = {
 *    h1: { display: "block" },
 *    "h2, h3": { color: "red" },
 *    "@media (min-width 640px)": {
 *      ".block": { display: "block" }
 *    }
 * }
 * toAST(css)
 * ```
 */
export function toAST(
  object: BinaryTree<string | number>,
): Root {
  const nodes = Object.entries(object).map(([prop, maybeNestedObject]) => {
    if (isAtRule(prop)) {
      const parts = prop.match(/@(\S+)(?:\s+([\W\w]*)\s*)?/);
      if (!parts) return;
      const [_, name, params] = parts;
      return atRule(name, maybeNestedObject, params);
    }

    if (isObject(maybeNestedObject)) {
      return new Rule({
        selector: prop,
        nodes: toAST(maybeNestedObject).nodes,
      });
    }
    return decl(prop, String(maybeNestedObject));
  }).filter(Boolean) as ChildNode[];
  return new Root({ nodes });
}
