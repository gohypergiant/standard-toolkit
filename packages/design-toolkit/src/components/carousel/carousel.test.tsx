/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// TODO: Redo entire file.
// import { uuid } from '@accelint/core';
// import userEvent from '@testing-library/user-event';
// import { Carousel } from './index';
// import type { CarouselData, CarouselProps } from './types';

// // TODO: could add this to fixtures file
// const TEST_ITEMS = [
//   {
//     dataType: 'image',
//     dataUrl: 'https://example.com/image1.jpg',
//     fileName: 'image1.jpg',
//     title: 'Image 1',
//     thumbnailUrl: 'https://example.com/thumbnail1.jpg',
//     uuid: uuid(),
//   },
//   {
//     dataType: 'image',
//     dataUrl: 'https://example.com/image2.jpg',
//     fileName: 'image2.jpg',
//     title: 'Image 2',
//     thumbnailUrl: 'https://example.com/thumbnail2.jpg',
//     uuid: uuid(),
//   },
// ] as CarouselData[];

// TODO: Rewrite these with new format.
// describe('Carousel', () => {
//   const defaultProps: CarouselProps = {
//     items: TEST_ITEMS,
//   };

//   it('renders the carousel with the correct number of items', () => {
//     render(<Carousel items={...defaultProps} />);
//     const carouselItems = screen.getAllByTestId('carousel-item');
//     expect(carouselItems.length).toBe(defaultProps.items.length);
//   });

//   it('renders the correct item as the current item', () => {
//     render(<Carousel {...defaultProps} />);
//     const currentItem = screen.getByTestId('carousel-item-0');
//     expect(currentItem).toHaveTextContent(defaultProps.items[0].title);
//   });

//   it('updates the current item when the next button is clicked', () => {
//     render(<Carousel {...defaultProps} />);
//     const nextButton = screen.getByTestId('carousel-next-button');
//     const currentItem = screen.getByTestId('carousel-item-0');
//     userEvent.click(nextButton);
//     expect(currentItem).toHaveTextContent(defaultProps.items[1].title);
//   });

//   it('updates the current item when the previous button is clicked', () => {
//     render(<Carousel {...defaultProps} />);
//     const nextButton = screen.getByTestId('carousel-next-button');
//     const previousButton = screen.getByTestId('carousel-previous-button');
//     const currentItem = screen.getByTestId('carousel-item-0');
//     userEvent.click(nextButton);
//     userEvent.click(previousButton);
//     expect(currentItem).toHaveTextContent(defaultProps.items[0].title);
//   });
// });
