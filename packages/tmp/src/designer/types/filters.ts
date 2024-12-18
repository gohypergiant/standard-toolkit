// * https://react-querybuilder.js.org/demo#addRuleToNewGroups=false&autoSelectField=true&autoSelectOperator=true&debugMode=false&disabled=false&enableDragAndDrop=true&independentCombinators=false&justifiedLayout=false&listsAsArrays=false&parseNumbers=false&resetOnFieldChange=true&resetOnOperatorChange=false&showBranches=true&showCloneButtons=false&showCombinatorsBetweenRules=false&showLockButtons=false&showNotToggle=false&showShiftActions=false&validateQuery=false

/**
 * This is a best-guess-attempt at typing the rules for RQB's
 * JSON output, as it is normally just `string`.
 */
export type FilterRule = {
  id?: string;
  field: string;
  value: boolean | string | string[] | number | number[];
  operator: string;
};

/**
 * This is a best-guess-attempt at typing the result of RQB's
 * JSON output, as it is normally just `string`.
 */
export type FilterGroup = {
  combinator: 'AND' | 'OR';
  not?: boolean;
  rules: (FilterRule | FilterGroup)[];
};
