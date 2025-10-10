/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import * as ts from 'typescript';

interface ComponentStructure {
  name: string;
  children: {
    name: string;
    min: number;
    max?: number;
  }[];
}

function parseComponentStructure(
  node: ts.Node,
): ComponentStructure | undefined {
  if (!(ts.isFunctionDeclaration(node) || ts.isVariableStatement(node))) {
    return undefined;
  }

  const jsDoc = ts.getJSDocTags(node);
  if (
    !jsDoc.some(
      (tag: ts.JSDocTag) => tag.tagName.getText() === 'compound-component',
    )
  ) {
    return undefined;
  }

  // Get the component name
  let name: string;
  if (ts.isFunctionDeclaration(node)) {
    name = node.name?.getText() || '';
  } else {
    const declaration = (node as ts.VariableStatement).declarationList
      .declarations[0];
    name = declaration.name.getText();
  }

  // Parse the child requirements from JSDoc
  const children = jsDoc
    .filter((tag: ts.JSDocTag) => tag.tagName.getText() === 'requires')
    .map((tag: ts.JSDocTag) => {
      const comment = tag.comment as string;
      const [componentName, requirement] = comment.split(' ');
      const [type, count] = requirement.split(' ');

      return {
        name: componentName,
        min: type === 'exactly' ? Number.parseInt(count, 10) : 0,
        max: type === 'max' ? Number.parseInt(count, 10) : undefined,
      };
    });

  return { name, children };
}

function validateJsxElement(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
  components: Map<string, ComponentStructure>,
  program: ts.Program,
): ts.Diagnostic[] {
  const diagnostics: ts.Diagnostic[] = [];

  // Get the component name
  const elementName = ts.isJsxElement(node)
    ? node.openingElement.tagName.getText()
    : node.tagName.getText();

  // Check if this is a compound component we need to validate
  const structure = components.get(elementName);
  if (!structure) {
    return diagnostics;
  }

  // Count children
  const childCounts = new Map<string, number>();
  if (ts.isJsxElement(node)) {
    node.children.forEach((child: ts.JsxChild) => {
      if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) {
        const name = ts.isJsxElement(child)
          ? child.openingElement.tagName.getText()
          : child.tagName.getText();
        childCounts.set(name, (childCounts.get(name) || 0) + 1);
      }
    });
  }

  // Validate against requirements
  structure.children.forEach((requirement) => {
    const count = childCounts.get(requirement.name) || 0;

    if (count < requirement.min) {
      diagnostics.push({
        file: node.getSourceFile(),
        start: node.getStart(),
        length: node.getWidth(),
        category: ts.DiagnosticCategory.Error,
        code: 9999, // Custom error code
        messageText: `Component <${elementName}> requires at least ${requirement.min} of <${requirement.name}>, but found ${count}`,
      });
    }

    if (requirement.max !== undefined && count > requirement.max) {
      diagnostics.push({
        file: node.getSourceFile(),
        start: node.getStart(),
        length: node.getWidth(),
        category: ts.DiagnosticCategory.Error,
        code: 9999, // Custom error code
        messageText: `Component <${elementName}> allows at most ${requirement.max} of <${requirement.name}>, but found ${count}`,
      });
    }
  });

  return diagnostics;
}

export default function createTransformer(config: { components: string[] }) {
  return {
    name: 'compound-components',
    setup(build: any) {
      build.onTransform({ filter: /\.[jt]sx?$/ }, async (args: any) => {
        const program = ts.createProgram([args.path], {});
        const sourceFile = program.getSourceFile(args.path);
        if (!sourceFile) return;

        const components = new Map<string, ComponentStructure>();

        // First pass: collect component structures
        ts.forEachChild(sourceFile, (node: ts.Node) => {
          const structure = parseComponentStructure(node);
          if (structure) {
            components.set(structure.name, structure);
          }
        });

        // Second pass: validate JSX
        const transformer: ts.TransformerFactory<ts.SourceFile> = (
          context: ts.TransformationContext,
        ) => {
          return (sourceFile: ts.SourceFile) => {
            function visit(node: ts.Node): ts.Node {
              if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
                const diagnostics = validateJsxElement(
                  node,
                  components,
                  program,
                );
                // Add diagnostics to the program through synthetic comments
                for (const diagnostic of diagnostics) {
                  const newNode = ts.addSyntheticTrailingComment(
                    node,
                    ts.SyntaxKind.MultiLineCommentTrivia,
                    ` @ts-error ${diagnostic.messageText} `,
                    true,
                  );
                  return newNode;
                }
              }
              return ts.visitEachChild(node, visit, context);
            }

            return ts.visitNode(sourceFile, visit) as ts.SourceFile;
          };
        };

        return { program, transformer };
      });
    },
  };
}
