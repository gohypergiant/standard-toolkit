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
    '[--drawer-w-left:0]',
    '[--drawer-w-right:0]',
    '[--drawer-h-bottom:0]',
    '[--drawer-h-bottom:0]',
    'data-[top*="overlay"]:[--drawer-main-row-start:1]', //top overlay
    'data-[bottom*="overlay"]:[--drawer-main-row-end:4]', //bottom overlay
    'data-[left*="overlay"]:[--drawer-main-col-start:1]', //left overlay
    'data-[right*="overlay"]:[--drawer-main-col-end:4]', //right overlay
    '[--drawer-size-closed:0]',
    '[--drawer-menu-size:40px]',
    '[--drawer-size-small:200px]',
    '[--drawer-size-medium:min(475px,25%)]',
    '[--drawer-size-large:min(600px,35%)]',

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
    position: 'relative row-start-1 row-end-2 col-start-2 col-end-3',
    visibility: ['z-5', 'group-data-[layout=top]/layout:z-10'],
    layout: [
      '[&[data-layout="wide"]_[data-placement="top"]]:col-start-1 [&[data-layout="wide"]_[data-placement="top"]]:col-end-4',
      '[&[data-layout="top"]_[data-placement="top"]]:col-start-1 [&[data-layout="top"]_[data-placement="top"]]:col-end-4',
      '[&[data-layout="left"]_[data-placement="top"]]:col-start-2 [&[data-layout="left"]_[data-placement="top"]]:col-end-4',
      '[&[data-layout="right"]_[data-placement="top"]]:col-start-1',
    ],
    interactions: 'pointer-events-none [&>*]:pointer-events-auto',
    content: 'group-data-[top-open="false"]/layout:[&>*:not(nav)]:hidden',
  },

  bottom: {
    position: 'relative row-start-3 row-end-4 col-start-2 col-end-3',
    visibility: ['z-5', 'group-data-[layout=bottom]/layout:z-10'],
    layout: [
      '[&[data-layout="wide"]_[data-placement="bottom"]]:col-start-1 [&[data-layout="wide"]_[data-placement="bottom"]]:col-end-4',
      '[&[data-layout="bottom"]_[data-placement="bottom"]]:col-start-1 [&[data-layout="bottom"]_[data-placement="bottom"]]:col-end-4',
      '[&[data-layout="left"]_[data-placement="bottom"]]:col-end-4',
      '[&[data-layout="right"]_[data-placement="bottom"]]:col-start-1',
    ],
    interactions: 'pointer-events-none [&>*]:pointer-events-auto',
    content: 'group-data-[bottom-open="false"]/layout:[&>*:not(nav)]:hidden',
  },

  left: {
    position: 'relative col-start-1 col-end-2 row-start-2 row-end-3',
    visibility: [
      'z-5 ',
      'group-data-[layout=left]/layout:z-10',
      'group-data-[layout=right]/layout:z-1',
    ],
    layout: [
      '[&[data-layout="tall"]_[data-placement="left"]]:row-start-1 [&[data-layout="tall"]_[data-placement="left"]]:row-end-4',
      '[&[data-layout="left"]_[data-placement="left"]]:row-start-1 [&[data-layout="left"]_[data-placement="left"]]:row-end-4',
      '[&[data-layout="top"]_[data-placement="left"]]:row-end-4',
      '[&[data-layout="bottom"]_[data-placement="left"]]:row-start-1',
    ],
    interactions: 'pointer-events-none [&>*]:pointer-events-auto',
    content: 'group-data-[left-open="false"]/layout:[&>*:not(nav)]:hidden',
  },

  right: {
    position: 'relative col-start-3 col-end-4 row-start-2 row-end-3',
    visibility: [
      'z-5',
      'group-data-[layout=right]/layout:z-10',
      'group-data-[layout=left]/layout:z-1',
    ],
    layout: [
      '[&[data-layout="tall"]_[data-placement="right"]]:row-start-1 [&[data-layout="tall"]_[data-placement="right"]]:row-end-4',
      '[&[data-layout="right"]_[data-placement="right"]]:row-start-1 [&[data-layout="right"]_[data-placement="right"]]:row-end-4',
      '[&[data-layout="top"]_[data-placement="right"]]:row-end-4',
      '[&[data-layout="bottom"]_[data-placement="right"]]:row-start-1',
    ],
    interactions: 'pointer-events-none [&>*]:pointer-events-auto',
    content: 'group-data-[right-open="false"]/layout:[&>*:not(nav)]:hidden',
  },
};

/**
 * State-based dynamic properties
 */

const stateProperties = {
  //Main content grid positioning
  mainContent: [
    'data-[bottom*="overlay"]:[--drawer-main-row-end:4]',
    'data-[bottom*="push"]:[--drawer-main-row-end:3]',
    'data-[top*="overlay"]:[--drawer-main-row-start:1]',
    'data-[top*="push"]:[--drawer-main-row-start:2]',
    'data-[left*="overlay"]:[--drawer-main-col-start:1]',
    'data-[left*="push"]:[--drawer-main-col-start:2]',
    'data-[right*="overlay"]:[--drawer-main-col-end:4]',
    'data-[right*="push"]:[--drawer-main-col-end:3]',
  ],

  //Drawer size mappings
  sizing: [
    //Top drawer
    'data-[top-open="false"]:[--drawer-h-top:var(--drawer-size-closed)]',
    'data-[top*="small"]:[--drawer-h-top:var(--drawer-size-small)]',
    'data-[top*="medium"]:[--drawer-h-top:var(--drawer-size-medium)]',
    'data-[top*="large"]:[--drawer-h-top:var(--drawer-size-large)]',

    //Bottom drawer
    'data-[bottom-open="false"]:[--drawer-h-bottom:var(--drawer-size-closed)]',
    'data-[bottom*="small"]:[--drawer-h-bottom:var(--drawer-size-small)]',
    'data-[bottom*="medium"]:[--drawer-h-bottom:var(--drawer-size-medium)]',
    'data-[bottom*="large"]:[--drawer-h-bottom:var(--drawer-size-large)]',

    //Left drawer
    'data-[left-open="false"]:[--drawer-w-left:var(--drawer-size-closed)]',
    'data-[left*="small"]:[--drawer-w-left:var(--drawer-size-small)]',
    'data-[left*="medium"]:[--drawer-w-left:var(--drawer-size-medium)]',
    'data-[left*="large"]:[--drawer-w-left:var(--drawer-size-large)]',

    //Right drawer
    'data-[right-open="false"]:[--drawer-w-right:var(--drawer-size-closed)]',
    'data-[right*="small"]:[--drawer-w-right:var(--drawer-size-small)]',
    'data-[right*="medium"]:[--drawer-w-right:var(--drawer-size-medium)]',
    'data-[right*="large"]:[--drawer-w-right:var(--drawer-size-large)]',
  ],
};

export const DrawerStyles = tv({
  slots: {
    root: [
      ...gridBase.properties,
      ...gridBase.container,
      ...stateProperties.mainContent,
      ...stateProperties.sizing,
      placementStyles.top.layout,
      placementStyles.bottom.layout,
      placementStyles.left.layout,
      placementStyles.right.layout,
    ],
    main: 'relative z-1 col-[var(--drawer-main-cols)] row-[var(--drawer-main-rows)]',
    drawer: [
      'bg-surface-default text-body-m',
      'data-[open="false"]:[&>*:not(nav)]:hidden',
      'data-[mode="overlay"]:block',
      'data-[mode="push"]:block',
      'data-[size="menu-size"]:block',
      'data-[size="small"]:block',
      'data-[size="medium"]:block',
      'data-[size="large"]:block',
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
          placementStyles.top.interactions,
          placementStyles.top.content,
        ],
      },
      bottom: {
        drawer: [
          placementStyles.bottom.position,
          placementStyles.bottom.visibility,
          placementStyles.bottom.interactions,
          placementStyles.bottom.content,
        ],
      },
      left: {
        drawer: [
          placementStyles.left.position,
          placementStyles.left.visibility,
          placementStyles.left.interactions,
          placementStyles.left.content,
        ],
      },
      right: {
        drawer: [
          placementStyles.right.position,
          placementStyles.right.visibility,
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
      'selected:fg-highlight selected:bg-highlight-subtle selected:group-dtk-orientation-horizontal:border-highlight',
      //focused
      'focus:fg-default-light focus:group-dtk-orientation-horizontal:border-interactive-hover',
      //disabled
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:group-dtk-orientation-horizontal:border-interactive-disabled',
    ],
  },
  variants: {
    drawer: {
      bottom: {
        menu: '-translate-y-[var(--drawer-menu-size)] rounded-b-none',
      },
      left: {
        menu: ['left-full rounded-l-none'],
      },
      right: {
        menu: '-left-[var(--drawer-menu-size)] rounded-r-none',
      },
      top: {
        menu: 'bottom-0 translate-y-[var(--drawer-menu-size)] rounded-t-none',
      },
    },
    orientation: {
      horizontal: {
        menu: 'transform-[translateX(-50%)] absolute left-[50%] flex h-[var(--drawer-menu-size)] flex-row rounded-large bg-surface-default',
      },
      vertical: {
        menu: 'absolute flex w-[var(--drawer-menu-size)] flex-col items-center rounded-large bg-surface-default',
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
