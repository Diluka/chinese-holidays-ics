import ChineseHolidays from 'chinese-holidays';
import ical from 'ical-generator';
import _ from 'lodash';
import moment from 'moment';
import http from 'http';

async function createCalendar() {
  const calendar = ical({ name: '中国节假日', timezone: 'Asia/Shanghai' });
  console.log('正在准备节假日数据...');

  const book = await ChineseHolidays.ready();
  console.log('节假日数据加载完成');

  for (const event of book.events()) {
    console.log(event.name, event.days(), event.isHoliday(), event.isWorkingday());

    calendar.createEvent({
      id: `HD-CN-${+_.first(event.days())}`,
      start: moment(_.first(event.days())).startOf('d'),
      end: moment(_.last(event.days())).endOf('d'),
      summary: event.name + (event.isWorkingday() ? '补班' : ''),
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

  return calendar;
}

(async () => {
  let calendar = await createCalendar();

  setInterval(async () => {
    calendar = await createCalendar();
  }, 24 * 3600 * 1000);

  http
    .createServer((req, res) => calendar.serve(res))
    .listen(3000, () => {
      console.log('Server running at http://localhost:3000/');
    });
})();
