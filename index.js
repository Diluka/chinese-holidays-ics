import ChineseHolidays from 'chinese-holidays';
import ical from 'ical-generator';
import _ from 'lodash';
import moment from 'moment';
import http from 'http';

const port = +process.env.SERVER_PORT || 3000;

async function createCalendar() {
  const calendar = ical({ name: '中国放假安排', timezone: 'Asia/Shanghai' });
  console.log('正在准备节假日数据...');

  const book = await ChineseHolidays.ready();
  console.log('节假日数据加载完成');

  for (const event of book.events()) {
    console.log(event.name, event.days(), event.isHoliday(), event.isWorkingday());

    const from = _.first(event.days());
    const to = _.last(event.days());

    const ev = calendar.createEvent({
      id: `HD-CN-${+from}`,
      start: moment(from),
      end: moment(to).add(1, 'd'),
      summary: event.name + (event.isWorkingday() ? '补班' : ''),
      allDay: true,
    });

    if (event.isWorkingday()) {
      const description = '明天要上班记得定闹钟';
      ev.description(description);

      event.days().map((o) =>
        ev.createAlarm({
          type: 'display',
          trigger: moment(o).add(-4, 'hours'),
          description,
        }),
      );
    }
  }

  return calendar;
}

(async () => {
  let calendar = await createCalendar();

  setInterval(async () => {
    calendar = await createCalendar();
  }, 24 * 3600 * 1000);

  http
    .createServer((req, res) => calendar.serve(res))
    .listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
})();
