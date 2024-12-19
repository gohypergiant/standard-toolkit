import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';

const PATTERN_EXCLUDE = /node_modules|\.(?:bench|css|d|stories|test)\./;

function walk(directory, callback) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (!PATTERN_EXCLUDE.test(fullPath)) {
      if (stat.isDirectory()) {
        walk(fullPath, callback);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        callback(fullPath);
      }
    }
  }
}

function collectModules(dir) {
  const modules = [];

  walk(dir, (filePath) => {
    const sourceFile = ts.createSourceFile(
      filePath,
      fs.readFileSync(filePath, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );

    const exports = [];

    ts.forEachChild(sourceFile, (node) => {
      if (ts.isExportDeclaration(node) && node.exportClause) {
        if (node.exportClause.elements) {
          for (const element of node.exportClause.elements) {
            exports.push(element.name.getText());
          }
        }
      } else if (ts.isExportAssignment(node)) {
        exports.push('default');
      }
    });

    modules.push({ filePath, exports });
  });

  return modules;
}

// Example usage:
const monorepoPath = path.join(process.cwd(), 'packages');
const modules = collectModules(monorepoPath);
console.log(modules);
