import { transform } from "../src/transformers/react-intl";
import fs from "node:fs";
import path from "node:path";

const originalFile = path.join(
  __dirname,
  "./translations/react-intl/Basic.tsx"
);
const compareFile = path.join(
  __dirname,
  "./translations/react-intl/BasicTest.tsx"
);
const expectedFile = path.join(
  __dirname,
  "./translations/react-intl/Basic_expected.tsx"
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
  it("should replace a string literal with intl.formatMessage", () => {
    transform({
      filesPaths: [compareFile],
    });

    const result = fs.readFileSync(compareFile, "utf-8");
    const expected = fs.readFileSync(expectedFile, "utf8");

    expect(result).toEqual(expected);
  });
});
