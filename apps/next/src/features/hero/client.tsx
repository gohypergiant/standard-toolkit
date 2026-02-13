'use client';
import { Hero, HeroSubtitle, HeroTitle } from '@accelint/design-toolkit';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

function PropCombos() {
  return PROP_COMBOS.map((props, k) => (
    <BentoItem key={k}>
      <Hero {...props}>
        <HeroTitle>John Doe</HeroTitle>
        <HeroSubtitle>Software Engineer</HeroSubtitle>
        <HeroSubtitle>San Francisco, CA</HeroSubtitle>
      </Hero>
    </BentoItem>
  ));
}

export function HeroClientExample() {
  return <PropCombos />;
}
