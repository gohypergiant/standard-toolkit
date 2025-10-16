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

const isCompound = (tag: ts.JSDocTag) =>
  tag.tagName.getText() === 'compound-component';

function readDocblockDef(node: ts.Node): ComponentStructure | undefined {
  if (!(ts.isFunctionDeclaration(node) || ts.isVariableStatement(node))) {
    return undefined;
  }

  const jsDoc = ts.getJSDocTags(node);

  if (!jsDoc.some(isCompound)) {
    return undefined;
  }

  // Parse the child requirements from JSDoc
  const children = jsDoc
    .filter((tag: ts.JSDocTag) => tag.tagName.getText() === 'requires')
    .map((tag: ts.JSDocTag) => {
      const comment = tag.comment?.toString() || '';
      const [componentName, rule, countAsString] = comment.split(' ');
      const count = Number.parseInt(countAsString, 10);

      return {
        name: componentName,
        min:
          rule === 'exactly'
            ? count
            : rule === 'min'
              ? count
              : rule === 'max'
                ? 0
                : 1,
        max: rule === 'exactly' ? count : rule === 'max' ? count : undefined,
      };
    });

  // to aid in getting the component name
  const nodeResolved = ts.isFunctionDeclaration(node)
    ? node
    : (node as ts.VariableStatement).declarationList.declarations[0];

  return {
    name: nodeResolved.name?.getText() || '',
    children,
  };
}

/*
function validateJsxElement(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
  components: Map<string, ComponentStructure>,
  sourceFile: ts.SourceFile,
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
    const checkAndCountChild = (child: ts.JsxChild) => {
      if (ts.isJsxElement(child)) {
        const tagName = child.openingElement.tagName.getText();
        const childName = tagName.split('.')[1] || tagName; // Handle Component.SubComponent format
        childCounts.set(childName, (childCounts.get(childName) || 0) + 1);
      } else if (ts.isJsxSelfClosingElement(child)) {
        const tagName = child.tagName.getText();
        const childName = tagName.split('.')[1] || tagName; // Handle Component.SubComponent format
        childCounts.set(childName, (childCounts.get(childName) || 0) + 1);
      }
    };

    node.children.forEach(checkAndCountChild);
  }

  // Validate against requirements
  structure.children.forEach((requirement) => {
    const count = childCounts.get(requirement.name) || 0;

    if (count < requirement.min) {
      diagnostics.push({
        file: sourceFile,
        start: node.getStart(),
        length: node.getWidth(),
        category: ts.DiagnosticCategory.Error,
        code: 9999,
        messageText:
          requirement.min === 1 && requirement.max === 1
            ? `Component ${elementName} requires exactly one ${requirement.name} component`
            : `Component ${elementName} requires at least ${requirement.min} ${requirement.name} component(s), but found ${count}`,
      });
    }

    if (requirement.max !== undefined && count > requirement.max) {
      diagnostics.push({
        file: sourceFile,
        start: node.getStart(),
        length: node.getWidth(),
        category: ts.DiagnosticCategory.Error,
        code: 9999,
        messageText:
          requirement.min === requirement.max
            ? `Component ${elementName} requires exactly ${requirement.max} ${requirement.name} component(s), but found ${count}`
            : `Component ${elementName} allows at most ${requirement.max} ${requirement.name} component(s), but found ${count}`,
      });
    }
  });

  return diagnostics;
}
*/

interface TransformerConfig {
  components: string[];
}

export function createTransformer(
  config: TransformerConfig,
): ts.TransformerFactory<ts.SourceFile> {
  return (context: ts.TransformationContext): ts.Transformer<ts.SourceFile> => {
    return (sourceFile: ts.SourceFile): ts.SourceFile => {
      // First pass: collect component structures
      const components = new Map<string, ComponentStructure>();
      const diagnostics: ts.Diagnostic[] = [];

      const addError = (
        sourceFile: ts.SourceFile,
        node: ts.Node,
        messageText: string,
      ) =>
        diagnostics.push({
          file: sourceFile,
          start: node.getStart(),
          length: node.getWidth(),
          category: ts.DiagnosticCategory.Error,
          code: 9999,
          messageText,
        });

      // Collect and validate component declarations
      const collectComponents = (node: ts.Node) => {
        const structure = readDocblockDef(node);

        if (structure) {
          components.set(structure.name, structure);
          // Validate structure after collection to ensure we have all components
          try {
            structure.children.forEach((child) => {
              if (!config.components.includes(child.name)) {
                addError(
                  sourceFile,
                  node,
                  `Invalid child component "${child.name}" in compound component "${structure.name}". Must be one of: ${config.components.join(', ')}`,
                );
              }
            });
          } catch (error) {
            addError(
              sourceFile,
              node,
              error instanceof Error ? error.message : 'Unknown error',
            );
          }
        }
        ts.forEachChild(node, collectComponents);
      };
      collectComponents(sourceFile);

      // Second pass: validate component usage
      const validateJsxUsage = (node: ts.Node) => {
        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
          const elementName = ts.isJsxElement(node)
            ? node.openingElement.tagName.getText()
            : node.tagName.getText();

          const structure = components.get(elementName);
          if (structure) {
            // Collect and validate child components
            const childCounts = new Map<string, number>();
            if (ts.isJsxElement(node)) {
              node.children.forEach((child) => {
                if (ts.isJsxElement(child)) {
                  const tagName = child.openingElement.tagName.getText();
                  const childName = tagName.split('.')[1] || tagName;
                  childCounts.set(
                    childName,
                    (childCounts.get(childName) || 0) + 1,
                  );
                } else if (ts.isJsxSelfClosingElement(child)) {
                  const tagName = child.tagName.getText();
                  const childName = tagName.split('.')[1] || tagName;
                  childCounts.set(
                    childName,
                    (childCounts.get(childName) || 0) + 1,
                  );
                }
              });
            }

            // Validate each required child component
            structure.children.forEach((requirement) => {
              const count = childCounts.get(requirement.name) || 0;
              if (count < requirement.min) {
                addError(
                  sourceFile,
                  node,
                  requirement.min === 1 && requirement.max === 1
                    ? `Component ${elementName} requires exactly one ${requirement.name} component`
                    : `Component ${elementName} requires at least ${requirement.min} ${requirement.name} component(s), but found ${count}`,
                );
              }
              if (requirement.max !== undefined && count > requirement.max) {
                addError(
                  sourceFile,
                  node,
                  requirement.min === requirement.max
                    ? `Component ${elementName} requires exactly ${requirement.max} ${requirement.name} component(s), but found ${count}`
                    : `Component ${elementName} allows at most ${requirement.max} ${requirement.name} component(s), but found ${count}`,
                );
              }
            });
          }
        }
        ts.forEachChild(node, validateJsxUsage);
      };
      validateJsxUsage(sourceFile);

      // Return a decorated source file with diagnostics
      const decoratedSource = Object.create(sourceFile) as ts.SourceFile;
      Object.assign(decoratedSource, sourceFile, {
        get diagnostics() {
          return diagnostics;
        },
      });

      return decoratedSource;
    };
  };
}
