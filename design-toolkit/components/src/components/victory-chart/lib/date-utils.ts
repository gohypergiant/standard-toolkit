// __private-exports
/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

export const HOURS_IN_A_DAY = 24;
export const MS_IN_AN_HOUR = 1000 * 60 * 60;

const regexTimeReplacement = /T|:\d\d.\d+Z$/gi;
const rTimeString = /\s\d\d:.*$/;

/**
 * Adds specified hours to a date
 * @param hours - Number of hours to add
 * @param date - Base date
 * @returns New date with added hours
 */
export const addHours = (hours: number, date: Date) =>
  new Date(date.valueOf() + hours * MS_IN_AN_HOUR);

/**
 * Formats date to ISO string without time components
 * @param date - Date to format
 */
export const dateFormat = (date: Date) =>
  date.toISOString().replace(regexTimeReplacement, ' ').trim();

/**
 * Returns day and date in UTC format
 * @param date - Date to format
 */
export const dayAndDate = (date: Date) =>
  date.toUTCString().split(' ').slice(0, 4).join(' ');

/**
 * Returns full date string without time
 * @param date - Date to format
 */
export const fullDateString = (date: Date) =>
  date.toUTCString().replace(rTimeString, '');

/**
 * Extracts time string from date
 * @param date - Date to process
 * @returns Time string in HH:MM format or undefined
 */
export const getTimeString = (date: Date) =>
  (date.toUTCString().match(/\d+:\d\d/) ?? [])[0];
