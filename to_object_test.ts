import {
  camelCase,
  constructProp,
  constructValue,
  toObject,
} from "./to_object.ts";
import { expect, ParamReturn, test } from "./dev_deps.ts";
import { AtRule, Declaration, Root, Rule } from "./deps.ts";

test("camelCase", () => {
  const table: ParamReturn<typeof camelCase>[] = [
    ["", ""],
    ["display", "display"],
    ["font-size", "fontSize"],
    ["transition-timing-function", "transitionTimingFunction"],
    ["-webkit-mask", "WebkitMask"],
    ["-moz-transform", "MozTransform"],
    ["-webkit-mask", "WebkitMask"],
    ["-ms-linear-gradient", "MsLinearGradient"],
    ["--map-css", "-MapCss"],
  ];

  table.forEach(([value, result]) => expect(camelCase(value)).toBe(result));
});

test("constructProp", () => {
  const table: ParamReturn<typeof constructProp>[] = [
    ["", false, ""],
    ["   ", false, ""],
    ["--variable", true, "--variable"],
    ["--variable", false, "-Variable"],
    ["font-size", false, "fontSize"],
    ["-webkit-mask", false, "WebkitMask"],
  ];

  table.forEach(([value, important, result]) =>
    expect(constructProp(value, important)).toBe(result)
  );
});

test("constructValue", () => {
  const table: ParamReturn<typeof constructValue>[] = [
    ["", false, ""],
    ["", true, "!important"],
    [" ", true, "!important"],
    [" test ", true, "test !important"],
    ["0", true, "0 !important"],
    ["0", false, 0],
    ["01", false, 1],
    [" ", false, ""],
    ["0.1px", false, "0.1px"],
    ["0.1 px", false, "0.1 px"],
    ["0.1", false, 0.1],
    ["00000000.1", false, 0.1],
    [".1", false, 0.1],
    [".1em", false, ".1em"],
    ["x0", false, "x0"],
    ["block", false, "block"],
    ["1px solid black", false, "1px solid black"],
  ];

  table.forEach(([value, important, result]) =>
    expect(constructValue(value, important)).toBe(result)
  );
});

test("toObject", () => {
  const table: ParamReturn<typeof toObject>[] = [
    [new Root(), {}],
    [
      new Root({
        nodes: [
          new Rule({
            selector: "",
          }),
        ],
      }),
      {
        "": {},
      },
    ],
    [
      new Root({
        nodes: [
          new Rule({
            selector: ".block",
            nodes: [
              new Declaration({ prop: "block", value: "display" }),
            ],
          }),
        ],
      }),
      {
        ".block": {
          block: "display",
        },
      },
    ],
    [
      new Root({
        nodes: [
          new Declaration({ prop: "", value: "" }),
        ],
      }),
      { "": "" },
    ],
    [
      new Root({
        nodes: [
          new Declaration({ prop: "display", value: "block" }),
        ],
      }),
      { display: "block" },
    ],
    [
      new Root({
        nodes: [
          new Declaration({ prop: "display", value: "block" }),
          new Declaration({ prop: "font-size", value: "1em" }),
        ],
      }),
      { display: "block", fontSize: "1em" },
    ],
    [
      new Root({
        nodes: [
          new AtRule({
            name: "media",
            params: "(min-width: 640px)",
            nodes: [
              new Rule({
                selector: ".sm:!block",
                nodes: [
                  new Declaration({
                    prop: "display",
                    value: "block",
                    important: true,
                  }),
                  new Declaration({
                    prop: "-webkit-transition",
                    value: "all 4s ease",
                  }),
                ],
              }),
            ],
          }),
          new Rule({
            selector: ".text-sm",
            nodes: [
              new Declaration({ prop: "block", value: "display" }),
              new Declaration({ prop: "font-size", value: "16em" }),
            ],
          }),
        ],
      }),
      {
        "@media (min-width: 640px)": {
          ".sm:!block": {
            display: "block !important",
            WebkitTransition: "all 4s ease",
          },
        },
        ".text-sm": {
          block: "display",
          fontSize: "16em",
        },
      },
    ],
  ];

  table.forEach(([ast, result]) => expect(toObject(ast)).toEqual(result));
});
