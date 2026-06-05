'use client';
import 'client-only';
import { ScatterplotLayer } from '@deck.gl/layers'

export function ExampleLayer() {
    return (
        <layer  layer={new ScatterplotLayer({
            data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scatterplot/manhattan.json',
            getRadius: 5,
            radiusUnits: 'pixels',
            getFillColor: [255,255,255],
            getPosition: d => [d[0], d[1], 0],
        })}/>
    )
}