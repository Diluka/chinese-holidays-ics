import { createCalendar } from './create-calendar.js';

const calendar = await createCalendar();
calendar.saveSync('./calendar.ics');
