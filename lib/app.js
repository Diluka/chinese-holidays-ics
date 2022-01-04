import http from 'http';

import { createCalendar } from './create-calendar.js';

const port = +process.env.SERVER_PORT || 3000;

let calendar = await createCalendar();

setInterval(async () => {
  calendar = await createCalendar();
}, 24 * 3600 * 1000);

http
  .createServer((req, res) => calendar.serve(res))
  .listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
