// __private-exports
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
'use client';

import 'client-only';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import {
  type RuleGroupProps,
  TestID,
  useRuleGroup,
  useStopEventPropagation,
} from 'react-querybuilder';

export function RuleGroup(props: RuleGroupProps) {
  const group = useRuleGroup(props);

  const {
    schema: {
      controls: { ruleGroupBodyElements: RuleGroupBodyElements },
    },
  } = group;

  const {
    schema: { classNames },
  } = props;

  const addRule = useStopEventPropagation(group.addRule);
  const addGroup = useStopEventPropagation(group.addGroup);
  const cloneGroup = useStopEventPropagation(group.cloneGroup);
  const toggleLockGroup = useStopEventPropagation(group.toggleLockGroup);
  const removeGroup = useStopEventPropagation(group.removeGroup);

  const elementProps = useMemo(
    () => ({
      ...group,
      addGroup,
      addRule,
      cloneGroup,
      removeGroup,
      toggleLockGroup,
    }),
    [addGroup, addRule, cloneGroup, group, removeGroup, toggleLockGroup],
  );

  return (
    <div className={cn(classNames.ruleGroup)}>
      <div className={cn(classNames.header)}>
        <RuleGroupHeaderComponent {...elementProps} />
      </div>
      <div className={cn(classNames.body)}>
        <RuleGroupBodyElements {...elementProps} />
      </div>
      <div className={cn(classNames.header)}>
        <RuleGroupFooterComponent {...elementProps} />
      </div>
    </div>
  );
}

export function RuleGroupHeaderComponent(
  ruleGroup: RuleGroupProps & ReturnType<typeof useRuleGroup>,
) {
  const shouldShowLock = ruleGroup.schema.showLockButtons;
  const isNotRoot = ruleGroup.path.length > 0;
  const shouldShowClone = ruleGroup.schema.showCloneButtons && isNotRoot;

  const {
    schema: {
      controls: {
        combinatorSelector: CombinatorSelectorControlElement,
        cloneGroupAction: CloneGroupActionControlElement,
        lockGroupAction: LockGroupActionControlElement,
        removeGroupAction: RemoveGroupActionControlElement,
      },
    },
  } = ruleGroup;

  return (
    <>
      <CombinatorSelectorControlElement
        key={TestID.combinators}
        testID={TestID.combinators}
        options={ruleGroup.schema.combinators}
        value={ruleGroup.combinator}
        title={ruleGroup.translations.combinators.title}
        className={ruleGroup.classNames.combinators}
        handleOnChange={ruleGroup.onCombinatorChange}
        rules={ruleGroup.ruleGroup.rules}
        level={ruleGroup.path.length}
        path={ruleGroup.path}
        disabled={ruleGroup.disabled}
        context={ruleGroup.context}
        validation={ruleGroup.validationResult}
        schema={ruleGroup.schema}
      />
      {shouldShowClone && (
        <div>
          <CloneGroupActionControlElement
            key={TestID.cloneGroup}
            testID={TestID.cloneGroup}
            label={ruleGroup.translations.cloneRuleGroup.label}
            title={ruleGroup.translations.cloneRuleGroup.title}
            className={ruleGroup.classNames.cloneGroup}
            handleOnClick={ruleGroup.cloneGroup}
            rules={ruleGroup.ruleGroup.rules}
            level={ruleGroup.path.length}
            path={ruleGroup.path}
            disabled={ruleGroup.disabled}
            context={ruleGroup.context}
            validation={ruleGroup.validationResult}
            ruleOrGroup={ruleGroup.ruleGroup}
            schema={ruleGroup.schema}
          />
        </div>
      )}
      {shouldShowLock && (
        <div>
          <LockGroupActionControlElement
            key={TestID.lockGroup}
            testID={TestID.lockGroup}
            label={ruleGroup.translations.lockGroup.label}
            title={ruleGroup.translations.lockGroup.title}
            className={ruleGroup.classNames.lockGroup}
            handleOnClick={ruleGroup.toggleLockGroup}
            rules={ruleGroup.ruleGroup.rules}
            level={ruleGroup.path.length}
            path={ruleGroup.path}
            disabled={ruleGroup.disabled}
            disabledTranslation={
              ruleGroup.parentDisabled
                ? undefined
                : ruleGroup.translations.lockGroupDisabled
            }
            context={ruleGroup.context}
            validation={ruleGroup.validationResult}
            ruleOrGroup={ruleGroup.ruleGroup}
            schema={ruleGroup.schema}
          />
        </div>
      )}
      {isNotRoot && (
        <div>
          <RemoveGroupActionControlElement
            key={TestID.removeGroup}
            testID={TestID.removeGroup}
            label={ruleGroup.translations.removeGroup.label}
            title={ruleGroup.translations.removeGroup.title}
            className={ruleGroup.classNames.removeGroup}
            handleOnClick={ruleGroup.removeGroup}
            rules={ruleGroup.ruleGroup.rules}
            level={ruleGroup.path.length}
            path={ruleGroup.path}
            disabled={ruleGroup.disabled}
            context={ruleGroup.context}
            validation={ruleGroup.validationResult}
            ruleOrGroup={ruleGroup.ruleGroup}
            schema={ruleGroup.schema}
          />
        </div>
      )}
    </>
  );
}

export function RuleGroupFooterComponent(
  ruleGroup: RuleGroupProps & ReturnType<typeof useRuleGroup>,
) {
  const {
    schema: {
      controls: {
        addGroupAction: AddGroupActionControlElement,
        addRuleAction: AddRuleActionControlElement,
      },
    },
  } = ruleGroup;

  return (
    <>
      <AddRuleActionControlElement
        key={TestID.addRule}
        testID={TestID.addRule}
        label={ruleGroup.translations.addRule.label}
        title={ruleGroup.translations.addRule.title}
        className={ruleGroup.classNames.addRule}
        handleOnClick={ruleGroup.addRule}
        rules={ruleGroup.ruleGroup.rules}
        level={ruleGroup.path.length}
        path={ruleGroup.path}
        disabled={ruleGroup.disabled}
        context={ruleGroup.context}
        validation={ruleGroup.validationResult}
        ruleOrGroup={ruleGroup.ruleGroup}
        schema={ruleGroup.schema}
      />
      <AddGroupActionControlElement
        key={TestID.addGroup}
        testID={TestID.addGroup}
        label={ruleGroup.translations.addGroup.label}
        title={ruleGroup.translations.addGroup.title}
        className={ruleGroup.classNames.addGroup}
        handleOnClick={ruleGroup.addGroup}
        rules={ruleGroup.ruleGroup.rules}
        level={ruleGroup.path.length}
        path={ruleGroup.path}
        disabled={ruleGroup.disabled}
        context={ruleGroup.context}
        validation={ruleGroup.validationResult}
        ruleOrGroup={ruleGroup.ruleGroup}
        schema={ruleGroup.schema}
      />
    </>
  );
}
