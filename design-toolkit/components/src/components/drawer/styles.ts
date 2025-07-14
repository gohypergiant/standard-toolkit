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

      // base styles
      'group/layout relative top-[var(--classification-banner-height)]',
      // grid definition
      'grid grid-cols-[var(--route-layout-grid-cols)] grid-rows-[var(--route-layout-grid-rows)] transition-[grid-template-columns,grid-template-rows]',
      // menu styles
      'data-[menu*="float"]:h-[var(--available-height)] data-[menu*="scroll"]:min-h-[var(--available-height)]',
    ],
    main: 'relative z-1 col-[var(--panel-main-cols)] row-[var(--panel-main-rows)]',
    drawer: '',
    menu: '',
    trigger:
      'fg-default-dark hover:fg-default-light cursor-pointer hover:bg-surface-overlay',
  },
  variants: {
    anchor: {
      bottom: {
        drawer: [
          // base styles
          'relative row-start-3 row-end-4',
          // grid placement
          'z-5 col-start-2 col-end-3 group-data-[extend*=bottom]/layout:z-10 group-data-[bottom*=extend]/layout:col-start-1 group-data-[extend*=bottom]/layout:col-start-1 group-data-[extend=right]/layout:col-start-1 group-data-[bottom*=extend]/layout:col-end-4 group-data-[extend*=bottom]/layout:col-end-4 group-data-[extend=left]/layout:col-end-4',
          // allows pointer events to pass-through, i.e. to the map
          'pointer-events-none [&>*]:pointer-events-auto',
          // hides all content except the panel-menu when closed
          'group-data-[bottom*=closed]/layout:[&>*:not(nav)]:hidden',
        ],
        menu: '-translate-y-[var(--panel-size-icons)] rounded-b-none',
      },
      left: {
        drawer: [
          // base styles
          'relative col-start-1 col-end-2',
          // allows pointer events to pass-through, i.e. to the map
          'pointer-events-none [&>*]:pointer-events-auto',
          // grid placement
          'z-5 row-start-2 row-end-3 group-data-[extend*=left]/layout:z-10 group-data-[extend=right]/layout:z-1 group-data-[extend*=left]/layout:row-start-1 group-data-[extend=bottom]/layout:row-start-1 group-data-[left*=extend]/layout:row-start-1 group-data-[extend*=left]/layout:row-end-4 group-data-[extend=top]/layout:row-end-4 group-data-[left*=extend]/layout:row-end-4',
          // hides all content except the panel-menu when closed
          'group-data-[left*=closed]/layout:[&>*:not(nav,[data-drawer-tabs])]:hidden',
        ],
        menu: 'left-full rounded-l-none',
      },
      right: {
        drawer: [
          // base styles
          'relative col-start-3 col-end-4',
          // allows pointer events to pass-through, i.e. to the map
          'pointer-events-none [&>*]:pointer-events-auto',
          // grid placement
          'z-5 row-start-2 row-end-3 group-data-[extend*=right]/layout:z-10 group-data-[extend=left]/layout:z-1 group-data-[extend*=right]/layout:row-start-1 group-data-[extend=bottom]/layout:row-start-1 group-data-[right*=extend]/layout:row-start-1 group-data-[extend*=right]/layout:row-end-4 group-data-[extend=top]/layout:row-end-4 group-data-[right*=extend]/layout:row-end-4',
          // hides all content except the panel-menu when closed
          'group-data-[right*=closed]/layout:[&>*:not(nav)]:hidden',
        ],
        menu: '-left-[var(--panel-size-icons)] rounded-r-none',
      },
      top: {
        drawer: [
          // base styles
          'relative row-start-1 row-end-2',
          // allows pointer events to pass-through, i.e. to the map
          'pointer-events-none [&>*]:pointer-events-auto',
          // grid placement
          'z-5 col-start-2 col-end-3 group-data-[extend*=top]/layout:z-10 group-data-[extend*=top]/layout:col-start-1 group-data-[extend=right]/layout:col-start-1 group-data-[top*=extend]/layout:col-start-1 group-data-[extend*=top]/layout:col-end-4 group-data-[extend=left]/layout:col-end-4 group-data-[top*=extend]/layout:col-end-4',
          // hides all content except the panel-menu when closed
          'group-data-[top*=closed]/layout:[&>*:not(nav)]:hidden',
        ],
        menu: 'bottom-0 translate-y-[var(--panel-size-icons)] rounded-t-none',
      },
    },
    orientation: {
      horizontal: {
        menu: 'transform-[translateX(-50%)] absolute left-[50%] flex h-[var(--panel-size-icons)] rounded-large bg-surface-default px-s',
      },
      vertical: {
        menu: 'absolute mt-xxl w-[var(--panel-size-icons)] rounded-large bg-surface-default py-s',
      },
    },
  },
});
