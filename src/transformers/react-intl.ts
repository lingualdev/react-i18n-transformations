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
            `{intl.formatMessage({id: "${key}", defaultMessage: "${text}"})}`
          );
        }
        return node;
      });

      // add import function
      const hasUserTranslationImport =
        sourceFile.getImportDeclaration("react-intl");

      if (!hasUserTranslationImport) {
        sourceFile.addImportDeclaration({
          namedImports: ["useIntl"],
          moduleSpecifier: "react-intl",
        });
      }

      // add useTranslation hook
      const hasTranslateHook = statement
        .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
        .some((node) => node.getText().startsWith("useIntl"));

      if (!hasTranslateHook) {
        // add the useTranslation hook as no translation was found
        const [blocks] = statement.getDescendantsOfKind(SyntaxKind.Block);
        const useTranslationStatement = printNode(
          factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
              [
                factory.createVariableDeclaration(
                  factory.createIdentifier("intl"),
                  undefined,
                  undefined,
                  factory.createCallExpression(
                    factory.createIdentifier("useIntl"),
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
