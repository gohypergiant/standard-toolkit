import { tv } from 'tailwind-variants';

export const DrawerStyles = tv({
  slots: {
    root: [
      '[--available-height:100vh]',
      '[--drawer-size-closed:0] [--drawer-size-icons:40px] [--drawer-size-nav:200px] [--drawer-size-open:min(475px,25%)] [--drawer-size-xl:min(600px,35%)]',

      'data-[bottom*="over"]:[--drawer-main-row-end:4]',
      'data-[bottom*="push"]:[--drawer-main-row-end:3]',

      'data-[top*="over"]:[--drawer-main-row-start:1]',
      'data-[top*="push"]:[--drawer-main-row-start:2]',

      'data-[left*="over"]:[--drawer-main-col-start:1]',
      'data-[left*="push"]:[--drawer-main-col-start:2]',

      'data-[right*="over"]:[--drawer-main-col-end:4]',
      'data-[right*="push"]:[--drawer-main-col-end:3]',

      '[--route-layout-grid-cols:var(--drawer-w-left)_auto_var(--drawer-w-right)]',
      '[--route-layout-grid-rows:var(--drawer-h-top)_auto_var(--drawer-h-bottom)]',
      '[--drawer-main-cols:var(--drawer-main-col-start)/var(--drawer-main-col-end)]',
      '[--drawer-main-rows:var(--drawer-main-row-start)/var(--drawer-main-row-end)]',

      'data-[bottom*="closed"]:[--drawer-h-bottom:var(--drawer-size-closed)]',
      'data-[bottom*="icons"]:[--drawer-h-bottom:var(--drawer-size-icons)]',
      'data-[bottom*="nav"]:[--drawer-h-bottom:var(--drawer-size-nav)]',
      'data-[bottom*="open"]:[--drawer-h-bottom:var(--drawer-size-open)]',
      'data-[bottom*="xl"]:[--drawer-h-bottom:var(--drawer-size-xl)]',

      'data-[top*="closed"]:[--drawer-h-top:var(--drawer-size-closed)]',
      'data-[top*="icons"]:[--drawer-h-top:var(--drawer-size-icons)]',
      'data-[top*="nav"]:[--drawer-h-top:var(--drawer-size-nav)]',
      'data-[top*="open"]:[--drawer-h-top:var(--drawer-size-open)]',
      'data-[top*="xl"]:[--drawer-h-top:var(--drawer-size-xl)]',

      'data-[left*="closed"]:[--drawer-w-left:var(--drawer-size-closed)]',
      'data-[left*="icons"]:[--drawer-w-left:var(--drawer-size-icons)]',
      'data-[left*="nav"]:[--drawer-w-left:var(--drawer-size-nav)]',
      'data-[left*="open"]:[--drawer-w-left:var(--drawer-size-open)]',
      'data-[left*="xl"]:[--drawer-w-left:var(--drawer-size-xl)]',

      'data-[right*="closed"]:[--drawer-w-right:var(--drawer-size-closed)]',
      'data-[right*="icons"]:[--drawer-w-right:var(--drawer-size-icons)]',
      'data-[right*="nav"]:[--drawer-w-right:var(--drawer-size-nav)]',
      'data-[right*="open"]:[--drawer-w-right:var(--drawer-size-open)]',
      'data-[right*="xl"]:[--drawer-w-right:var(--drawer-size-xl)]',

      // base styles
      'group/layout relative top-[var(--classification-banner-height)]',
      // grid definition
      'grid grid-cols-[var(--route-layout-grid-cols)] grid-rows-[var(--route-layout-grid-rows)] transition-[grid-template-columns,grid-template-rows]',
      // menu styles
      // 'data-[menu*="float"]:h-[var(--available-height)] data-[menu*="scroll"]:min-h-[var(--available-height)]',
      'h-[var(--available-height)] min-h-[var(--available-height)]',
    ],
    main: 'relative z-1 col-[var(--drawer-main-cols)] row-[var(--drawer-main-rows)]',
    drawer: [
      'bg-surface-default text-body-m',
      'data-[drawer-state*="closed"]:[&>*:not(nav,[data-drawer-tabs])]:hidden',
      'data-[drawer-state*="icons"]:block',
      'data-[drawer-state*="nav"]:block',
      'data-[drawer-state*="open"]:block',
      'data-[drawer-state*="xl"]:block',
    ],
    menu: '',
    trigger:
      'fg-default-dark hover:fg-default-light cursor-pointer hover:bg-surface-overlay',
    menuItem: [
      'flex flex-col items-center justify-center',
      'fg-default-dark cursor-pointer p-s outline-none',
      'rounded-medium group-dtk-orientation-horizontal:rounded-small group-dtk-orientation-horizontal:rounded-b-none',
      'group-dtk-orientation-horizontal:border-static-light group-dtk-orientation-horizontal:border-b',
      'group-dtk-orientation-vertical:border group-dtk-orientation-vertical:border-transparent',
      //hover
      'hover:fg-default-light hover:group-dtk-orientation-horizontal:border-interactive-hover',
      //selected
      'data-[selected=true]:fg-highlight data-[selected=true]:bg-highlight-subtle data-[selected=true]:group-dtk-orientation-horizontal:border-highlight',
      //focused
      'focus:fg-default-light focus:group-dtk-orientation-horizontal:border-interactive-hover',
      //disabled
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:group-dtk-orientation-horizontal:border-interactive-disabled',
    ],
    content: 'p-l',
    panel: 'text-default-light',
    header: 'mb-s flex flex-row items-center justify-between',
    title: 'w-full text-default-light text-header-l',
    footer: 'mt-s flex flex-row items-center justify-end',
  },
  variants: {
    placement: {
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
        menu: '-translate-y-[var(--drawer-size-icons)] rounded-b-none',
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
        menu: ['left-full rounded-l-none'],
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
        menu: '-left-[var(--drawer-size-icons)] rounded-r-none',
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
        menu: 'bottom-0 translate-y-[var(--drawer-size-icons)] rounded-t-none',
      },
    },
    orientation: {
      horizontal: {
        menu: 'transform-[translateX(-50%)] absolute left-[50%] flex h-[var(--drawer-size-icons)] rounded-large bg-surface-default px-s',
      },
      vertical: {
        menu: 'absolute mt-xxl w-[var(--drawer-size-icons)] rounded-large bg-surface-default py-s',
      },
    },
    visible: {
      true: {
        content: 'block',
      },
      false: {
        content: 'hidden',
      },
    },
  },
  compoundVariants: [
    {
      orientation: 'vertical',
      placement: 'left',
      class: {
        menu: 'flex flex-col gap-xs rounded-l-none px-xs py-m',
      },
    },
    {
      orientation: 'vertical',
      placement: 'right',
      class: {
        menu: 'flex flex-col gap-s rounded-r-none py-m',
      },
    },
    {
      orientation: 'horizontal',
      placement: 'top',
      class: {
        menu: 'flex flex-row gap-s rounded-t-none px-m py-xs',
      },
    },
    {
      orientation: 'horizontal',
      placement: 'bottom',
      class: {
        menu: 'flex flex-row gap-s rounded-b-none px-m py-xs',
      },
    },
  ],
});
