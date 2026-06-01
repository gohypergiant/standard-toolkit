---
title: Dialog
description: Modal dialog component for important content and interactions
source: packages/design-toolkit/src/components/dialog/index.tsx
source_sha: d81b19b6817d343234b330036b1389a46144e63c
doc_sha: pending
deprecated: false
updated: 2026-05-28
---

# Dialog

Modal dialog component for important content and interactions. Provides accessible modal functionality with focus management, backdrop handling, and keyboard navigation.

## Usage

```tsx
import { Dialog, DialogTrigger, DialogTitle, Button } from '@accelint/design-toolkit';

export function MyComponent() {
  return (
    <DialogTrigger>
      <Button>Open Dialog</Button>
      <Dialog>
        {({ close }) => (
          <>
            <DialogTitle>Confirm Action</DialogTitle>
            <p>Are you sure?</p>
            <Button onPress={close}>Confirm</Button>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  );
}
```

## Reference

```typescript
interface DialogProps extends ModalOverlayProps {
  children: React.ReactNode | ((opts: { close: () => void }) => React.ReactNode);
  size?: 'small' | 'large';
  classNames?: {
    overlay?: string;
    modal?: string;
    dialog?: string;
  };
  parentRef?: RefObject<HTMLElement>;
}
```

### Props

| Prop | Type | Default | Required |
|------|------|---------|----------|
| `children` | `ReactNode \| Function` | - | Yes |
| `size` | `'small' \| 'large'` | `'small'` | No |
| `classNames` | `object` | - | No |
| `parentRef` | `RefObject<HTMLElement>` | - | No |
| `isOpen` | `boolean` | - | No |
| `onOpenChange` | `(isOpen: boolean) => void` | - | No |
| `isDismissable` | `boolean` | `true` | No |
| `isKeyboardDismissDisabled` | `boolean` | `false` | No |

#### `children`

Dialog content. Can be:
- React node: Static content
- Function: Receives `{ close }` callback for programmatic dismissal

#### `size`

Dialog width variant:
- `small` - Compact width for simple dialogs
- `large` - Wide width for complex content or forms

#### `classNames`

Custom CSS class names for internal elements:
- `overlay` - Backdrop/overlay element
- `modal` - Modal container (handles positioning)
- `dialog` - Dialog content element

#### `parentRef`

Reference to parent element for portal rendering. Defaults to document body.

### Inherited Props

Dialog extends React Aria's `ModalOverlay`, inheriting:
- `isOpen` / `onOpenChange` - Control open state
- `isDismissable` - Allow dismissal via backdrop click
- `isKeyboardDismissDisabled` - Disable ESC key dismissal
- `shouldCloseOnInteractOutside` - Custom dismissal logic

See [React Aria Dialog](https://react-spectrum.adobe.com/react-aria/Dialog.html) for full API reference.

## Examples

### Example: Confirmation dialog

```tsx
import { Dialog, DialogTrigger, DialogTitle, DialogFooter, Button } from '@accelint/design-toolkit';

<DialogTrigger>
  <Button color="critical">Delete Account</Button>
  <Dialog>
    {({ close }) => (
      <>
        <DialogTitle>Delete Account</DialogTitle>
        <p>This action cannot be undone. All your data will be permanently deleted.</p>
        <DialogFooter>
          <Button variant="outline" onPress={close}>
            Cancel
          </Button>
          <Button color="critical" onPress={() => {
            handleDelete();
            close();
          }}>
            Delete
          </Button>
        </DialogFooter>
      </>
    )}
  </Dialog>
</DialogTrigger>
```

### Example: Form dialog

```tsx
import { Dialog, DialogTrigger, DialogTitle, DialogContent, DialogFooter, TextField, Button } from '@accelint/design-toolkit';
import { useState } from 'react';

function CreateUserDialog() {
  const [name, setName] = useState('');
  
  return (
    <DialogTrigger>
      <Button>Add User</Button>
      <Dialog size="large">
        {({ close }) => (
          <>
            <DialogTitle>Create New User</DialogTitle>
            <DialogContent>
              <TextField 
                label="Full Name"
                value={name}
                onChange={setName}
                isRequired
              />
              <TextField 
                label="Email"
                type="email"
                isRequired
              />
            </DialogContent>
            <DialogFooter>
              <Button variant="outline" onPress={close}>Cancel</Button>
              <Button onPress={() => {
                handleCreate(name);
                close();
              }}>
                Create
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  );
}
```

### Example: Controlled dialog

```tsx
import { Dialog, Button } from '@accelint/design-toolkit';
import { useState } from 'react';

function ControlledDialog() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onPress={() => setIsOpen(true)}>
        Open Dialog
      </Button>
      <Dialog 
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
      >
        <DialogTitle>Controlled Dialog</DialogTitle>
        <p>This dialog is controlled externally.</p>
        <Button onPress={() => setIsOpen(false)}>Close</Button>
      </Dialog>
    </>
  );
}
```

### Example: Non-dismissable dialog

```tsx
import { Dialog, DialogTrigger, DialogTitle, Button } from '@accelint/design-toolkit';

<DialogTrigger>
  <Button>Start Process</Button>
  <Dialog 
    isDismissable={false}
    isKeyboardDismissDisabled
  >
    {({ close }) => (
      <>
        <DialogTitle>Processing...</DialogTitle>
        <p>Please wait while we process your request.</p>
        <Button onPress={close}>Done</Button>
      </>
    )}
  </Dialog>
</DialogTrigger>
```

> **Good to know:** When `isDismissable={false}`, users cannot close the dialog by clicking the backdrop or pressing ESC. Always provide an explicit close action.

## Related

- [DialogTrigger](./trigger.md) - Trigger component for opening dialogs
- [DialogTitle](./title.md) - Accessible title component
- [DialogContent](./content.md) - Scrollable content container
- [DialogFooter](./footer.md) - Action buttons container
- [Popover](../popover/index.md) - Non-modal overlay for contextual content
