### Idea 1: components as props

This is what is currently wired up.

```jsx
<Tree>
  <Tree.Item
    label="Testing"
    actionComponent={(treeItemState) => <ExampleAction isDisabled={treeItemState.isDisabled} />}
    iconComponent={<Placeholder />}
  >
  
    {/* Sub tree */}
    <Tree.Item 
      label="Testing" 
      iconComponent={<Placeholder />}
    />
  </Tree.Item>
</Tree>
```


### Idea 2: slots as children

```jsx
<Tree>
  <Tree.Item label="Testing">
    <MyIcon slot="icon">...</MyIcon>
    // NOTE: these would technically need to be custom components so that we can consume context
    <MyIconButton slot="action">...</MyIconButton>
    
    {/* Sub tree */}
    <Tree.Item label="Testing">
      <MyIconButton slot="action">...</MyIconButton>
    </Tree.Item>
  </Tree.Item>
</Tree>
```

