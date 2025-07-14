import { tv } from 'tailwind-variants';

/*

:root {
  --classification-banner-height: 20px;
  --available-height: calc(100vh - var(--classification-banner-height));

  --panel-size-closed: 0px;
  --panel-size-icons: 40px;
  --panel-size-nav: 200px;
  --panel-size-open: min(475px, 25%);
  --panel-size-xl: min(600px, 35%);
}


  [data-id="b8a0eb6e-5b5d-e65e-93d2-2596b8b7dcd9"] {
    // Setting a bunch of variables for CSS animations
    &[data-bottom*=over] { --panel-main-row-end: 4; }
    &[data-bottom*=push] { --panel-main-row-end: 3; }

    &[data-top*=over] { --panel-main-row-start: 1; }
    &[data-top*=push] { --panel-main-row-start: 2; }

    &[data-left*=over] { --panel-main-col-start: 1; }
    &[data-left*=push] { --panel-main-col-start: 2; }

    &[data-right*=over] { --panel-main-col-end: 4; }
    &[data-right*=push] { --panel-main-col-end: 3; }

    --route-layout-grid-cols: var(--panel-w-left) auto var(--panel-w-right);
    --route-layout-grid-rows: var(--panel-h-top) auto var(--panel-h-bottom);
    --panel-main-cols: var(--panel-main-col-start)/var(--panel-main-col-end);
    --panel-main-rows: var(--panel-main-row-start)/var(--panel-main-row-end);

    &[data-bottom*="closed"] { --panel-h-bottom: var(--panel-size-closed); }
    &[data-bottom*="icons"] { --panel-h-bottom: var(--panel-size-icons); }
    &[data-bottom*="nav"] { --panel-h-bottom: var(--panel-size-nav); }
    &[data-bottom*="open"] { --panel-h-bottom: var(--panel-size-open); }
    &[data-bottom*="xl"] { --panel-h-bottom: var(--panel-size-xl); }

    &[data-top*="closed"] { --panel-h-top: var(--panel-size-closed); }
    &[data-top*="icons"] { --panel-h-top: var(--panel-size-icons); }
    &[data-top*="nav"] { --panel-h-top: var(--panel-size-nav); }
    &[data-top*="open"] { --panel-h-top: var(--panel-size-open); }
    &[data-top*="xl"] { --panel-h-top: var(--panel-size-xl); }

    &[data-left*="closed"] { --panel-w-left: var(--panel-size-closed); }
    &[data-left*="icons"] { --panel-w-left: var(--panel-size-icons); }
    &[data-left*="nav"] { --panel-w-left: var(--panel-size-nav); }
    &[data-left*="open"] { --panel-w-left: var(--panel-size-open); }
    &[data-left*="xl"] { --panel-w-left: var(--panel-size-xl); }

    &[data-right*="closed"] { --panel-w-right: var(--panel-size-closed); }
    &[data-right*="icons"] { --panel-w-right: var(--panel-size-icons); }
    &[data-right*="nav"] { --panel-w-right: var(--panel-size-nav); }
    &[data-right*="open"] { --panel-w-right: var(--panel-size-open); }
    &[data-right*="xl"] { --panel-w-right: var(--panel-size-xl); }
  }

*/

export const DrawerStyles = tv({
  slots: {
    root: [
      '[--available-height:100vh]',
      '[--panel-size-closed:0] [--panel-size-icons:40px] [--panel-size-nav:200px] [--panel-size-open:min(475px,25%)] [--panel-size-xl:min(600px,35%)]',

      'data-[bottom*="over"]:[--panel-main-row-end:4]',
      'data-[bottom*="push"]:[--panel-main-row-end:3]',

      'data-[top*="over"]:[--panel-main-row-start:1]',
      'data-[top*="push"]:[--panel-main-row-start:2]',

      'data-[left*="over"]:[--panel-main-col-start:1]',
      'data-[left*="push"]:[--panel-main-col-start:2]',

      'data-[right*="over"]:[--panel-main-col-end:4]',
      'data-[right*="push"]:[--panel-main-col-end:3]',

      '[--route-layout-grid-cols:var(--panel-w-left)_auto_var(--panel-w-right)]',
      '[--route-layout-grid-rows:var(--panel-h-top)_auto_var(--panel-h-bottom)]',
      '[--panel-main-cols:var(--panel-main-col-start)/var(--panel-main-col-end)]',
      '[--panel-main-rows:var(--panel-main-row-start)/var(--panel-main-row-end)]',

      'data-[bottom*="closed"]:[--panel-h-bottom:var(--panel-size-closed)]',
      'data-[bottom*="icons"]:[--panel-h-bottom:var(--panel-size-icons)]',
      'data-[bottom*="nav"]:[--panel-h-bottom:var(--panel-size-nav)]',
      'data-[bottom*="open"]:[--panel-h-bottom:var(--panel-size-open)]',
      'data-[bottom*="xl"]:[--panel-h-bottom:var(--panel-size-xl)]',

      'data-[top*="closed"]:[--panel-h-top:var(--panel-size-closed)]',
      'data-[top*="icons"]:[--panel-h-top:var(--panel-size-icons)]',
      'data-[top*="nav"]:[--panel-h-top:var(--panel-size-nav)]',
      'data-[top*="open"]:[--panel-h-top:var(--panel-size-open)]',
      'data-[top*="xl"]:[--panel-h-top:var(--panel-size-xl)]',

      'data-[left*="closed"]:[--panel-w-left:var(--panel-size-closed)]',
      'data-[left*="icons"]:[--panel-w-left:var(--panel-size-icons)]',
      'data-[left*="nav"]:[--panel-w-left:var(--panel-size-nav)]',
      'data-[left*="open"]:[--panel-w-left:var(--panel-size-open)]',
      'data-[left*="xl"]:[--panel-w-left:var(--panel-size-xl)]',

      'data-[right*="closed"]:[--panel-w-right:var(--panel-size-closed)]',
      'data-[right*="icons"]:[--panel-w-right:var(--panel-size-icons)]',
      'data-[right*="nav"]:[--panel-w-right:var(--panel-size-nav)]',
      'data-[right*="open"]:[--panel-w-right:var(--panel-size-open)]',
      'data-[right*="xl"]:[--panel-w-right:var(--panel-size-xl)]',
    ],
  },
});
