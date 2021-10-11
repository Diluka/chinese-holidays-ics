import ChineseHolidays from 'chinese-holidays';
import ical from 'ical-generator';
import _ from 'lodash';
import moment from 'moment';
import http from 'http';

(async () => {
  const calendar = ical({ name: '中国节假日', timezone: 'Asia/Shanghai' });

  await ChineseHolidays.ready((book, err) => {
    if (err) {
      throw err;
    }

    for (const event of book.events()) {
      console.log(
        event.name,
        event.days(),
        event.isHoliday(),
        event.isWorkingday(),
      );

      calendar.createEvent({
        id: `HD-CN-${+_.first(event.days())}`,
        start: moment(_.first(event.days())).startOf('d'),
        end: moment(_.last(event.days())).endOf('d'),
        summary: event.name + (event.isWorkingday() ? ' - 补班' : ''),
        allDay: true,
        alarms: event.isWorkingday()
          ? event.days().map((o) => ({
              type: 'display',
              trigger: moment(o).add(-4, 'hours'),
              description: '明天要上班记得定闹钟',
            }))
          : undefined,
      });
    }
  });

  http
    .createServer((req, res) => calendar.serve(res))
    .listen(3000, '127.0.0.1', () => {
      console.log('Server running at http://127.0.0.1:3000/');
    });
})();
