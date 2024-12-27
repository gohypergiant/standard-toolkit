import { applyThemeVars,
  assignPartialVars,
  semanticColorVars,
  sliderStateVars,
  sliderColorVars,
  type ThemeContext
} from "@accelint/design-system/vanilla";
import { style } from "@vanilla-extract/css";


export const Slider: ThemeContext['Slider'] = {
  slider: {
  //   slider: style(
  //     applyThemeVars<SliderState>(sliderStateVars, [
  //       {
  //         vars: assignPartialVars(
  //           { color: sliderColorVars },
  //           {
  //             color: {
  //               slider: {
  //                 background: semanticColorVars.background.surface.overlay,
  //                 border: semanticColorVars.border.static.exterior,
  //               },
  //               thumb: {
  //                 background: semanticColorVars.background.surface.overlay,
  //                 border: semanticColorVars.border.static.exterior,
  //               },
  //               track: {
  //                 background: semanticColorVars.background.surface.overlay,
  //                 border: semanticColorVars.border.static.exterior,
  //               },
  //             },
  //           },
  //         ),
  //       },
  //     ]),
  //   ),
  // },
    thumb: { 
      slider: style(
      applyThemeVars(sliderStateVars, [
        {
          vars: assignPartialVars(
            { color: sliderColorVars },
            {
              color: {
                thumb: {
                  background: semanticColorVars.background.highlight.bold,
                },
              },
            },
          ),
        },
      ])),
    },
  },
};