export { default as Rule } from "https://deno.land/x/postcss@8.4.6/lib/rule.js";
export { default as Declaration } from "https://deno.land/x/postcss@8.4.6/lib/declaration.js";
export { default as AtRule } from "https://deno.land/x/postcss@8.4.6/lib/at-rule.js";
export { default as Root } from "https://deno.land/x/postcss@8.4.6/lib/root.js";
export { isObject } from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export { deepMerge } from "https://deno.land/std@0.127.0/collections/deep_merge.ts";
export type {
  ChildNode,
} from "https://deno.land/x/postcss@8.4.6/lib/postcss.d.ts";

export type BinaryTree<Leaf, P extends PropertyKey = string | number> = {
  [k in P]: Leaf | BinaryTree<Leaf>;
};
