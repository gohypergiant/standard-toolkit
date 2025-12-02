const selectorParser = require('postcss-selector-parser');

const PROCESSED = Symbol('global-group-class-processed');

const log = (...args) => {
  if (!process.env.DEBUG) {
    // no op
    return;
  }

  console.log(...args);
}

const groupClassPlugin = () => {
  log('[@accelint/global-group-postcss-plugin] PLUGIN INVOKED');

  const transform = selectorParser((selectors) => {
    selectors.walkClasses((classNode) => {
      if (classNode.value.startsWith('group/')) {
        log(`[@accelint/global-group-postcss-plugin] Found group/* class: .${classNode.value}`);

        const globalPseudo = selectorParser.pseudo({
          value: ':global',
        });
        const newClass = classNode.clone();
        globalPseudo.append(selectorParser.selector({ value: '' }).append(newClass));
        classNode.replaceWith(globalPseudo);
      }
    });
  });

  return {
    postcssPlugin: '@accelint/global-group-postcss-plugin',

    Rule(rule) {
      if (rule[PROCESSED]) {
        return;
      }

      const originalSelector = rule.selector;
      rule.selector = transform.processSync(rule.selector);

      if (rule.selector !== originalSelector) {
        // ensure we're not wrapping in :global more than once
        rule[PROCESSED] = true;

        log(`[@accelint/global-group-postcss-plugin] Transformed:`);
        log(`    Before: ${originalSelector}`);
        log(`    After:  ${rule.selector}\n\n`);
      }
    },
  };
};

groupClassPlugin.postcss = true;

module.exports = groupClassPlugin;
