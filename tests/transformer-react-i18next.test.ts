import { transform } from "../src/transformers/react-i18next";
import fs from "node:fs";
import path from "node:path";

const originalFile = path.join(
  __dirname,
  "./translations/react-i18next/Basic.tsx"
);
const compareFile = path.join(
  __dirname,
  "./translations/react-i18next/BasicTest.tsx"
);
const expectedFile = path.join(
  __dirname,
  "./translations/react-i18next/Basic_expected.tsx"
);

beforeEach(() => {
  fs.copyFile(originalFile, compareFile, (error) => {
    if (error) {
      throw error;
    }
  });
});
afterEach(() => {
  fs.rmSync(compareFile);
});

describe("transformer", () => {
  it("should replace a string literal with a t function", () => {
    // const tsConfigFilePath = path.join(cwd(), "tsconfig.json");

    transform({
      filesPaths: [compareFile],
    });

    const result = fs.readFileSync(compareFile, "utf-8");
    const expected = fs.readFileSync(expectedFile, "utf-8");

    expect(result).toEqual(expected);
  });
});
