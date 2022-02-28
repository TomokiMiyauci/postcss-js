import { toAST } from "./to_ast.ts";
import { expect, ParamReturn, test } from "./dev_deps.ts";
import { AtRule, Declaration, Root, Rule } from "./deps.ts";

test("toAST", () => {
  const table: ParamReturn<typeof toAST>[] = [
    [
      { display: "block" },
      new Root({
        nodes: [
          new Declaration({ "prop": "display", value: "block" }),
        ],
      }),
    ],
    [
      { color: "black", background: "white" },
      new Root({
        nodes: [
          new Declaration({
            prop: "color",
            value: "black",
          }),
          new Declaration({
            prop: "background",
            value: "white",
          }),
        ],
      }),
    ],
    [
      { ".block": { display: "block" } },
      new Root({
        nodes: [
          new Rule({
            selector: ".block",
            nodes: [new Declaration({ prop: "display", value: "block" })],
          }),
        ],
      }),
    ],
    [
      { "@media (min-width: 640px)": { ".block": { display: "block" } } },
      new Root({
        nodes: [
          new AtRule({
            name: "media",
            nodes: [
              new Rule({
                selector: ".block",
                nodes: [new Declaration({ prop: "display", value: "block" })],
              }),
            ],
            params: "(min-width: 640px)",
          }),
        ],
      }),
    ],
    [
      {
        "h1,h2": {
          display: "block",
        },
      },
      new Root({
        nodes: [
          new Rule({
            selector: "h1,h2",
            nodes: [new Declaration({ prop: "display", value: "block" })],
          }),
        ],
      }),
    ],
    [
      {
        "h1,h2": {
          display: "block",
        },
        "h1": {
          display: "inline",
        },
      },
      new Root({
        nodes: [
          new Rule({
            selector: "h1,h2",
            nodes: [new Declaration({ prop: "display", value: "block" })],
          }),
          new Rule({
            selector: "h1",
            nodes: [new Declaration({ prop: "display", value: "inline" })],
          }),
        ],
      }),
    ],
  ];

  table.forEach(([object, result]) =>
    expect(toAST(object).toJSON()).toEqual(
      result.toJSON(),
    )
  );
});
