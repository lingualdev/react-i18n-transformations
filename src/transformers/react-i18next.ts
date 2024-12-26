import { printNode, Project, ProjectOptions, SyntaxKind, ts } from "ts-morph";

const factory = ts.factory;

export const transform = ({
  tsConfigFilePath,
  filesPaths,
}: {
  tsConfigFilePath?: ProjectOptions["tsConfigFilePath"];
  filesPaths: string | string[];
}) => {
  const project = new Project({
    tsConfigFilePath,
  });

  project.addSourceFilesAtPaths(filesPaths);

  for (const sourceFile of project.getSourceFiles()) {
    for (const statement of sourceFile.getStatements()) {
      const hasTranslatableContent = statement
        .getDescendantsOfKind(SyntaxKind.JsxText)
        .some((node) => !node.containsOnlyTriviaWhiteSpaces());

      if (!hasTranslatableContent) {
        continue;
      }

      statement.transform((traversal) => {
        const node = traversal.visitChildren();
        if (ts.isJsxText(node) && !node.containsOnlyTriviaWhiteSpaces) {
          const text = node.getText();
          const key = `${sourceFile
            .getBaseNameWithoutExtension()
            .toLowerCase()}.${text
            .substring(0, 100)
            .replace(/ /g, "_")
            .toLowerCase()}`;

          return traversal.factory.updateJsxText(
            node,
            `{t("${key}", "${text}")}`
          );
        }
        return node;
      });

      // add import function
      const hasUserTranslationImport =
        sourceFile.getImportDeclaration("react-i18next");

      if (!hasUserTranslationImport) {
        sourceFile.addImportDeclaration({
          namedImports: ["useTranslation"],
          moduleSpecifier: "react-i18next",
        });
      }

      // add useTranslation hook
      const hasTranslateHook = statement
        .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
        .some((node) => node.getText().startsWith("useTranslation"));

      if (!hasTranslateHook) {
        // add the useTranslation hook as no translation was found
        const [blocks] = statement.getDescendantsOfKind(SyntaxKind.Block);
        const useTranslationStatement = printNode(
          factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
              [
                factory.createVariableDeclaration(
                  factory.createObjectBindingPattern([
                    factory.createBindingElement(
                      undefined,
                      undefined,
                      factory.createIdentifier("t"),
                      undefined
                    ),
                  ]),
                  undefined,
                  undefined,
                  factory.createCallExpression(
                    factory.createIdentifier("useTranslation"),
                    undefined,
                    []
                  )
                ),
              ],
              ts.NodeFlags.Const
            )
          )
        );

        if (blocks) {
          blocks.insertText(blocks.getStatements()[0].getPos(), (writer) => {
            writer.newLine();
            writer.write(useTranslationStatement);
            writer.newLine();
          });
        }
      }
    }

    sourceFile.formatText();
    sourceFile.saveSync();
  }
};
