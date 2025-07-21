import { tv } from 'tailwind-variants';

/**
 * Base grid layout styles
 */
const gridBase = {
  container: [
    '[--available-height:100vh]',
    'group/layout relative top-[var(--classification-banner-height)]',
    'grid grid-cols-[var(--route-layout-grid-cols)] grid-rows-[var(--route-layout-grid-rows)]',
    'transition-[grid-template-columns,grid-template-rows]',
    'h-[var(--available-height)] min-h-[var(--available-height)]',
  ],

  //Properties for dynamic sizing
  properties: [
    //Drawer sizes
    '[--drawer-size-closed:0]',
    '[--drawer-size-icons:40px]',
    '[--drawer-size-nav:200px]',
    '[--drawer-size-content:min(475px,25%)]',
    '[--drawer-size-xl:min(600px,35%)]',

    //Grid template definitions
    '[--route-layout-grid-cols:var(--drawer-w-left)_1fr_var(--drawer-w-right)]',
    '[--route-layout-grid-rows:var(--drawer-h-top)_1fr_var(--drawer-h-bottom)]',
    '[--drawer-main-cols:var(--drawer-main-col-start)/var(--drawer-main-col-end)]',
    '[--drawer-main-rows:var(--drawer-main-row-start)/var(--drawer-main-row-end)]',
  ],
};

/**
 * Placement-specific grid positioning
 */
const placementStyles = {
  top: {
    position: 'relative row-start-1 row-end-2',
    visibility: 'z-5 col-start-2 col-end-3',
    extend: [
      'group-data-[extend*=top]/layout:z-10 group-data[extend*=top]/layout:col-start-1 group-data[extend*=top]/layout:col-end-4',
      'group-data-[extend=left]/layout:col-end-4',
      'group-data-[extend=right]/layout:col-start-1',
    ],
    interactions: 'pointer-events-none [&>*]:pointer-events-auto',
    content: 'group-data-[top*=closed]/layout:[&>*:not(nav)]:hidden',
  },

  bottom: {
    position: 'relative row-start-3 row-end-4',
    visibility: 'z-5 col-start-2 col-end-3',
    extend: [
      'group-data-[extend*=bottom]/layout:z-10 group-data[extend*=bottom]/layout:col-start-1 group-data[extend*=bottom]/layout:col-end-4',
      'group-data-[extend=left]/layout:col-end-4',
      'group-data-[extend=right]/layout:col-start-1',
    ],
    interactions: 'pointer-events-none [&>*]:pointer-events-auto',
    content: 'group-data-[bottom*=closed]/layout:[&>*:not(nav)]:hidden',
  },

  left: {
    position: 'relative col-start-1 col-end-2',
    visibility: 'z-5 row-start-2 row-end-3',
    extend: [
      'group-data-[extend*=left]/layout:z-10 group-data-[extend*=left]/layout:row-start-1 group-data-[extend*=left]/layout:row-end-4 ',
      'group-data-[extend*=right]/layout:z-1',
      'group-data-[extend=bottom]/layout:row-start-1',
      'group-data-[extend=top]/layout:row-end-4',
    ],
    interactions: 'pointer-events-none [&>*]:pointer-events-auto',
    content: 'group-data-[left*=closed]/layout:[&>*:not(nav)]:hidden',
  },

  right: {
    position: 'relative col-start-3 col-end-4',
    visibility: 'z-5 row-start-2 row-end-3',
    extend: [
      'group-data-[extend*=right]/layout:z-10 group-data-[extend*=left]/layout:row-start-1 group-data-[extend*=left]/layout:row-end-4 ',
      'group-data-[extend*=left]/layout:z-1',
      'group-data-[extend=bottom]/layout:row-start-1',
      'group-data-[extend=top]/layout:row-end-4',
    ],
    interactions: 'pointer-events-none [&>*]:pointer-events-auto',
    content: 'group-data-[right*=closed]/layout:[&>*:not(nav)]:hidden',
  },
};

/**
 * State-based dynamic properties
 */

const stateProperties = {
  //Main content grid positioning
  mainContent: [
    'data-[bottom*="over"]:[--drawer-main-row-end:4]',
    'data-[bottom*="push"]:[--drawer-main-row-end:3]',
    'data-[top*="over"]:[--drawer-main-row-start:1]',
    'data-[top*="push"]:[--drawer-main-row-start:2]',
    'data-[left*="over"]:[--drawer-main-col-start:1]',
    'data-[left*="push"]:[--drawer-main-col-start:2]',
    'data-[right*="over"]:[--drawer-main-col-end:4]',
    'data-[right*="push"]:[--drawer-main-col-end:3]',
  ],

  //Drawer size mappings
  sizing: [
    //Top drawer
    'data-[top*="closed"]:[--drawer-h-top:var(--drawer-size-closed)]',
    'data-[top*="icons"]:[--drawer-h-top:var(--drawer-size-icons)]',
    'data-[top*="nav"]:[--drawer-h-top:var(--drawer-size-nav)]',
    'data-[top*="content"]:[--drawer-h-top:var(--drawer-size-content)]',
    'data-[top*="xl"]:[--drawer-h-top:var(--drawer-size-xl)]',

    //Bottom drawer
    'data-[bottom*="closed"]:[--drawer-h-bottom:var(--drawer-size-closed)]',
    'data-[bottom*="icons"]:[--drawer-h-bottom:var(--drawer-size-icons)]',
    'data-[bottom*="nav"]:[--drawer-h-bottom:var(--drawer-size-nav)]',
    'data-[bottom*="content"]:[--drawer-h-bottom:var(--drawer-size-content)]',
    'data-[bottom*="xl"]:[--drawer-h-bottom:var(--drawer-size-xl)]',

    //Left drawer
    'data-[left*="closed"]:[--drawer-w-left:var(--drawer-size-closed)]',
    'data-[left*="icons"]:[--drawer-w-left:var(--drawer-size-icons)]',
    'data-[left*="nav"]:[--drawer-w-left:var(--drawer-size-nav)]',
    'data-[left*="content"]:[--drawer-w-left:var(--drawer-size-content)]',
    'data-[left*="xl"]:[--drawer-w-left:var(--drawer-size-xl)]',

    //Righ drawer
    'data-[right*="closed"]:[--drawer-w-right:var(--drawer-size-closed)]',
    'data-[right*="icons"]:[--drawer-w-right:var(--drawer-size-icons)]',
    'data-[right*="nav"]:[--drawer-w-right:var(--drawer-size-nav)]',
    'data-[right*="content"]:[--drawer-w-right:var(--drawer-size-content)]',
    'data-[right*="xl"]:[--drawer-w-right:var(--drawer-size-xl)]',
  ],
};

export const DrawerStyles = tv({
  slots: {
    root: [
      ...gridBase.properties,
      ...gridBase.container,
      ...stateProperties.mainContent,
      ...stateProperties.sizing,
    ],
    main: 'relative z-1 col-[var(--drawer-main-cols)] row-[var(--drawer-main-rows)]',
    drawer: [
      'bg-surface-default text-body-m',
      'data-[drawer-state*="closed"]:[&>*:not(nav)]:hidden',
      'data-[drawer-state*="icons"]:block',
      'data-[drawer-state*="nav"]:block',
      'data-[drawer-state*="content"]:block',
      'data-[drawer-state*="xl"]:block',
    ],
    content: ['flex h-full min-h-0 flex-col gap-s p-l'],
    panel: ['flex max-h-full flex-1 overflow-y-auto text-default-light'],
    header: ['mb-s flex flex-row items-center justify-between pt-px pr-px'],
    title: 'w-full text-default-light text-header-l',
    footer: 'mt-s flex flex-row items-center justify-end text-default-light',
    trigger:
      'fg-default-dark hover:fg-default-light cursor-pointer hover:bg-surface-overlay',
  },
  variants: {
    placement: {
      top: {
        drawer: [
          placementStyles.top.position,
          placementStyles.top.visibility,
          placementStyles.top.extend,
          placementStyles.top.interactions,
          placementStyles.top.content,
        ],
      },
      bottom: {
        drawer: [
          placementStyles.bottom.position,
          placementStyles.bottom.visibility,
          placementStyles.bottom.extend,
          placementStyles.bottom.interactions,
          placementStyles.bottom.content,
        ],
      },
      left: {
        drawer: [
          placementStyles.left.position,
          placementStyles.left.visibility,
          placementStyles.left.extend,
          placementStyles.left.interactions,
          placementStyles.left.content,
        ],
      },
      right: {
        drawer: [
          placementStyles.right.position,
          placementStyles.right.visibility,
          placementStyles.right.extend,
          placementStyles.right.interactions,
          placementStyles.right.content,
        ],
      },
    },
    visible: {
      true: {
        content: 'flex',
      },
      false: {
        content: 'hidden',
      },
    },
  },
});

export const DrawerMenuStyles = tv({
  slots: {
    menu: 'p-s',
    menuItem: [
      'flex h-[28px] w-[28px] flex-col items-center justify-center',
      'fg-default-dark cursor-pointer p-s outline-none',
      'rounded-medium group-dtk-orientation-horizontal:rounded-small group-dtk-orientation-horizontal:rounded-b-none',
      'group-dtk-orientation-horizontal:border-static-light group-dtk-orientation-horizontal:border-b',
      'group-dtk-orientation-vertical:border group-dtk-orientation-vertical:border-transparent',
      //hover
      'hover:fg-default-light hover:!bg-transparent hover:group-dtk-orientation-horizontal:border-interactive-hover',
      //selected
      'data-[selected=true]:fg-highlight data-[selected=true]:bg-highlight-subtle data-[selected=true]:group-dtk-orientation-horizontal:border-highlight',
      //focused
      'focus:fg-default-light focus:group-dtk-orientation-horizontal:border-interactive-hover',
      //disabled
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:group-dtk-orientation-horizontal:border-interactive-disabled',
    ],
  },
  variants: {
    drawer: {
      bottom: {
        menu: '-translate-y-[var(--drawer-size-icons)] rounded-b-none',
      },
      left: {
        menu: ['left-full rounded-l-none'],
      },
      right: {
        menu: '-left-[var(--drawer-size-icons)] rounded-r-none',
      },
      top: {
        menu: 'bottom-0 translate-y-[var(--drawer-size-icons)] rounded-t-none',
      },
    },
    orientation: {
      horizontal: {
        menu: 'transform-[translateX(-50%)] absolute left-[50%] flex h-[var(--drawer-size-icons)] flex-row rounded-large bg-surface-default',
      },
      vertical: {
        menu: 'absolute flex w-[var(--drawer-size-icons)] flex-col items-center rounded-large bg-surface-default',
      },
    },
    position: {
      start: {},
      middle: {},
      end: {},
    },
  },
  compoundVariants: [
    {
      orientation: 'vertical',
      position: 'start',
      class: {
        menu: '-translate-y-1/8 top-1/8',
      },
    },
    {
      orientation: 'vertical',
      position: 'middle',
      class: {
        menu: '-translate-y-1/2 top-1/2',
      },
    },
    {
      orientation: 'vertical',
      position: 'end',
      class: {
        menu: '-translate-y-7/8 top-7/8',
      },
    },
    {
      orientation: 'vertical',
      drawer: 'left',
      class: {
        menu: 'rounded-l-none',
      },
    },
    {
      orientation: 'vertical',
      drawer: 'right',
      class: {
        menu: 'rounded-r-none',
      },
    },
    {
      orientation: 'horizontal',
      drawer: 'top',
      class: {
        menu: 'rounded-t-none',
      },
    },
    {
      orientation: 'horizontal',
      drawer: 'bottom',
      class: {
        menu: 'rounded-b-none',
      },
    },
  ],
  defaultVariants: {
    position: 'middle',
  },
});
