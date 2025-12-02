import parser, { type ClassName, type Root } from 'postcss-selector-parser';
import type { Plugin, Rule } from 'postcss';

const PROCESSED = Symbol('global-group-class-processed');

interface ProcessedRule extends Rule {
  [PROCESSED]?: boolean;
}

const log = (...args: unknown[]): void => {
  if (!process.env.DEBUG) {
    return;
  }

  console.log(...args);
};

const groupClassPlugin = (): Plugin => {
  log('[@accelint/global-group-postcss-plugin] PLUGIN INVOKED');

  const transform = parser((selectors: Root) => {
    selectors.walkClasses((currentClassNode: ClassName) => {
      if (currentClassNode.value.startsWith('group/')) {
        log(
          `[@accelint/global-group-postcss-plugin] Found group/* class: .${currentClassNode.value}`,
        );

        const globalWrapped = parser
          .pseudo({
            value: ':global',
          })
          .append(
            parser.selector({ value: '' }).append(currentClassNode.clone()),
          );
        currentClassNode.replaceWith(globalWrapped);
      }
    });
  });

  return {
    postcssPlugin: '@accelint/global-group-postcss-plugin',

    Rule(rule: ProcessedRule) {
      const filePath = rule.root().source?.input.file;
      if (!filePath?.endsWith('.module.css')) {
        // do not apply this transformation if file is not a css module
        return;
      }

      if (rule[PROCESSED]) {
        // ensure we don't wrap in :global() more than once
        return;
      }

      const originalSelector = rule.selector;
      rule.selector = transform.processSync(rule.selector);

      if (rule.selector !== originalSelector) {
        rule[PROCESSED] = true;

        log('[@accelint/global-group-postcss-plugin] Transformed:');
        log(`    Before: ${originalSelector}`);
        log(`    After:  ${rule.selector}\n\n`);
      }
    },
  };
};

groupClassPlugin.postcss = true;

export default groupClassPlugin;
