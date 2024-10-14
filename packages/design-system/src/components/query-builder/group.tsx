import { Fragment, useContext, useMemo } from 'react';
import {
  type RuleGroupArray,
  type RuleGroupICArray,
  type RuleGroupProps,
  TestID,
  isRuleGroup,
  isRuleGroupType,
  pathsAreEqual,
  useRuleGroup,
  useStopEventPropagation,
} from 'react-querybuilder';
import { inlineVars } from '../../utils';
import { QueryBuilderContext } from './constants';
import { queryBuilderGroupStateVars } from './query-builder.css';
import type { RuleGroupElementsProps } from './types';

/**
 * Rules have 5 non-optional functional pieces:
 * - Field
 * - Operator (conditional)
 * - Value Source (conditional)
 * - Value (conditional)
 * - Remove
 */
const CORE_FUNCTIONS_COUNT = 5;

export function RuleGroup(props: RuleGroupProps) {
  const {
    classNames,
    controlElements: {
      ruleGroupBodyElements: RuleGroupBodyElements,
      ruleGroupFooterElements: RuleGroupFooterElements,
      ruleGroupHeaderElements: RuleGroupHeaderElements,
    },
  } = useContext(QueryBuilderContext);

  const {
    schema: {
      enableDragAndDrop,
      showCloneButtons,
      showLockButtons,
      showShiftActions,
    },
  } = props;

  const after = useMemo(
    () =>
      [showCloneButtons, showLockButtons].reduce(
        (acc, flag) => acc + (flag ? 1 : 0),
        0,
      ),
    [showCloneButtons, showLockButtons],
  );

  const before = useMemo(
    () =>
      [enableDragAndDrop, showShiftActions].reduce(
        (acc, flag) => acc + (flag ? 1 : 0),
        0,
      ),
    [enableDragAndDrop, showShiftActions],
  );

  const columns = useMemo(
    () => CORE_FUNCTIONS_COUNT + before + after,
    [after, before],
  );

  const style = useMemo(
    () =>
      inlineVars(queryBuilderGroupStateVars, {
        after,
        before,
        columns,
        isDisabled: false,
      }),
    [after, before, columns],
  );

  const group = useRuleGroup(props);
  const addRule = useStopEventPropagation(group.addRule);
  const addGroup = useStopEventPropagation(group.addGroup);
  const cloneGroup = useStopEventPropagation(group.cloneGroup);
  const toggleLockGroup = useStopEventPropagation(group.toggleLockGroup);
  const removeGroup = useStopEventPropagation(group.removeGroup);
  const shiftGroupUp = useStopEventPropagation(group.shiftGroupUp);
  const shiftGroupDown = useStopEventPropagation(group.shiftGroupDown);

  const elementProps = useMemo(
    () => ({
      ...(group as RuleGroupElementsProps),
      addGroup,
      addRule,
      cloneGroup,
      removeGroup,
      shiftGroupDown,
      shiftGroupUp,
      toggleLockGroup,
    }),
    [
      addGroup,
      addRule,
      cloneGroup,
      group,
      removeGroup,
      shiftGroupDown,
      shiftGroupUp,
      toggleLockGroup,
    ],
  );

  return (
    <div className={classNames?.group?.container} style={style}>
      <div
        ref={group.previewRef}
        className={group.outerClassName}
        title={group.accessibleDescription}
        data-dragmonitorid={group.dragMonitorId}
        data-dropmonitorid={group.dropMonitorId}
        data-level={group.path.length}
        data-path={JSON.stringify(group.path)}
        data-rule-group-id={group.id}
        data-testid={TestID.ruleGroup}
      >
        <div ref={group.dropRef} className={group.classNames.header}>
          <RuleGroupHeaderElements {...elementProps} />
        </div>
        <div className={group.classNames.body}>
          <RuleGroupBodyElements {...elementProps} />
        </div>
        <div className={classNames?.group?.footer}>
          <RuleGroupFooterElements {...elementProps} />
        </div>
      </div>
    </div>
  );
}

export function RuleGroupHeaderComponents(
  ruleGroup: RuleGroupProps & ReturnType<typeof useRuleGroup>,
) {
  const { classNames } = useContext(QueryBuilderContext);

  const {
    schema: {
      controls: {
        shiftActions: ShiftActionsControlElement,
        dragHandle: DragHandleControlElement,
        combinatorSelector: CombinatorSelectorControlElement,
        notToggle: NotToggleControlElement,
        cloneGroupAction: CloneGroupActionControlElement,
        lockGroupAction: LockGroupActionControlElement,
        removeGroupAction: RemoveGroupActionControlElement,
      },
    },
  } = ruleGroup;

  const titles = useMemo(
    () => ({
      shiftUp: ruleGroup.translations.shiftActionUp.title,
      shiftDown: ruleGroup.translations.shiftActionDown.title,
    }),
    [
      ruleGroup.translations.shiftActionDown.title,
      ruleGroup.translations.shiftActionUp.title,
    ],
  );

  const labels = useMemo(
    () => ({
      shiftUp: ruleGroup.translations.shiftActionUp.label,
      shiftDown: ruleGroup.translations.shiftActionDown.label,
    }),
    [
      ruleGroup.translations.shiftActionDown.label,
      ruleGroup.translations.shiftActionUp.label,
    ],
  );

  return (
    <>
      {ruleGroup.schema.showShiftActions && ruleGroup.path.length > 0 && (
        <div className={classNames?.group?.shift}>
          <ShiftActionsControlElement
            key={TestID.shiftActions}
            testID={TestID.shiftActions}
            level={ruleGroup.path.length}
            path={ruleGroup.path}
            titles={titles}
            labels={labels}
            className={ruleGroup.classNames.shiftActions}
            disabled={ruleGroup.disabled}
            shiftUp={ruleGroup.shiftGroupUp}
            shiftDown={ruleGroup.shiftGroupDown}
            shiftUpDisabled={ruleGroup.shiftUpDisabled}
            shiftDownDisabled={ruleGroup.shiftDownDisabled}
            context={ruleGroup.context}
            validation={ruleGroup.validationResult}
            schema={ruleGroup.schema}
            ruleOrGroup={ruleGroup.ruleGroup}
          />
        </div>
      )}
      {ruleGroup.path.length > 0 && ruleGroup.schema.enableDragAndDrop && (
        <div className={classNames?.group?.drag}>
          <DragHandleControlElement
            key={TestID.dragHandle}
            testID={TestID.dragHandle}
            ref={ruleGroup.dragRef}
            level={ruleGroup.path.length}
            path={ruleGroup.path}
            title={ruleGroup.translations.dragHandle.title}
            label={ruleGroup.translations.dragHandle.label}
            className={ruleGroup.classNames.dragHandle}
            disabled={ruleGroup.disabled}
            context={ruleGroup.context}
            validation={ruleGroup.validationResult}
            schema={ruleGroup.schema}
            ruleOrGroup={ruleGroup.ruleGroup}
          />
        </div>
      )}
      {!ruleGroup.schema.showCombinatorsBetweenRules &&
        !ruleGroup.schema.independentCombinators && (
          <div className={classNames?.group?.combinator}>
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
          </div>
        )}
      {ruleGroup.schema.showNotToggle && (
        <div className={classNames?.group?.toggle}>
          <NotToggleControlElement
            key={TestID.notToggle}
            testID={TestID.notToggle}
            className={ruleGroup.classNames.notToggle}
            title={ruleGroup.translations.notToggle.title}
            label={ruleGroup.translations.notToggle.label}
            checked={ruleGroup.ruleGroup.not}
            handleOnChange={ruleGroup.onNotToggleChange}
            level={ruleGroup.path.length}
            disabled={ruleGroup.disabled}
            path={ruleGroup.path}
            context={ruleGroup.context}
            validation={ruleGroup.validationResult}
            schema={ruleGroup.schema}
            ruleGroup={ruleGroup.ruleGroup}
          />
        </div>
      )}
      {ruleGroup.schema.showCloneButtons && ruleGroup.path.length >= 1 && (
        <div className={classNames?.group?.clone}>
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
      {ruleGroup.schema.showLockButtons && (
        <div className={classNames?.group?.lock}>
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
      {ruleGroup.path.length > 0 && (
        <div className={classNames?.group?.remove}>
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

export function RuleGroupBodyComponents(
  ruleGroup: RuleGroupProps & ReturnType<typeof useRuleGroup>,
) {
  const {
    schema: {
      controls: {
        ruleGroup: RuleGroupControlElement,
        rule: RuleControlElement,
      },
    },
  } = ruleGroup;

  return (
    <>
      {(ruleGroup.ruleGroup.rules as RuleGroupICArray | RuleGroupArray).map(
        (rule, idx, { length: ruleArrayLength }) => {
          const thisPathMemo = ruleGroup.pathsMemo[idx];
          const thisPath = thisPathMemo?.path ?? [];

          const thisPathDisabled =
            !thisPathMemo ||
            thisPathMemo.disabled ||
            (typeof rule !== 'string' && rule.disabled);

          const shiftUpDisabled = pathsAreEqual([0], thisPath);

          const shiftDownDisabled =
            ruleGroup.path.length === 0 && idx === ruleArrayLength - 1;

          const key =
            typeof rule === 'string' ? [...thisPath, rule].join('-') : rule.id;

          return (
            <Fragment key={key}>
              {isRuleGroup(rule) && (
                <RuleGroupControlElement
                  key={TestID.ruleGroup}
                  id={rule.id}
                  schema={ruleGroup.schema}
                  actions={ruleGroup.actions}
                  path={thisPath}
                  translations={ruleGroup.translations}
                  ruleGroup={rule}
                  rules={rule.rules}
                  combinator={
                    isRuleGroupType(rule) ? rule.combinator : undefined
                  }
                  not={!!rule.not}
                  disabled={thisPathDisabled}
                  parentDisabled={
                    ruleGroup.parentDisabled || ruleGroup.disabled
                  }
                  shiftUpDisabled={shiftUpDisabled}
                  shiftDownDisabled={shiftDownDisabled}
                  context={ruleGroup.context}
                />
              )}
              {typeof rule !== 'string' && !isRuleGroup(rule) && (
                <RuleControlElement
                  key={TestID.rule}
                  id={rule.id!}
                  rule={rule}
                  field={rule.field}
                  operator={rule.operator}
                  value={rule.value}
                  valueSource={rule.valueSource}
                  schema={ruleGroup.schema}
                  actions={ruleGroup.actions}
                  path={thisPath}
                  disabled={thisPathDisabled}
                  parentDisabled={
                    ruleGroup.parentDisabled || ruleGroup.disabled
                  }
                  translations={ruleGroup.translations}
                  shiftUpDisabled={shiftUpDisabled}
                  shiftDownDisabled={shiftDownDisabled}
                  context={ruleGroup.context}
                />
              )}
            </Fragment>
          );
        },
      )}
    </>
  );
}

export function RuleGroupFooterComponents(
  ruleGroup: RuleGroupProps & ReturnType<typeof useRuleGroup>,
) {
  const { classNames } = useContext(QueryBuilderContext);

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
      <div className={classNames?.rule?.add}>
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
      </div>
      <div className={classNames?.group?.add}>
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
      </div>
    </>
  );
}
