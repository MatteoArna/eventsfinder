import axios from 'axios';
import cheerio from 'cheerio';
import websites from './websites.json';
import { DateParser } from './DateParser';

export class DataFetcher {
  static pages = [];

  static loadPages() {
    try {
      this.pages = websites.map(website => ({
        name: website.name,
        url: website.url,
        coupon: website.coupon
      }));
    } catch (error) {
      console.error('Error loading pages. The format is not correct.');
    }
  }

  static async fetch() {
    try {
      this.loadPages();

      const currentDate = new Date();
      const nextWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
      const allEvents = [];
      let duplexCounter = 0;
      let counter = 0;

      const fetchPromises = this.pages.map(async page => {
        try {
          const response = await axios.get(page.url);
          const $ = cheerio.load(response.data);

          if (page.name === 'Duplex') {
            const eventElements = $('.row .eventRow');
            eventElements.each((index, element) => {
              const $event = $(element);
              const id = counter++;
              duplexCounter++;
              const name = $event.find('.event_title').text().split(' – ')[0];
              const sdate = $event.find('.event_date .month').text() + ' ' + $event.find('.event_date .date').text();
              const date = DateParser.parseEventDate(sdate, page.name);
              const imageUrl = $event.find('img.img_placeholder').attr('src');
              const link = $event.find('a.event_title_link').attr('href');
              if (duplexCounter >= 3) {
                allEvents.push({
                  id,
                  name,
                  date,
                  location: 'Duplex',
                  image: imageUrl,
                  soldout: 'Available',
                  link,
                  provider: page.name,
                });
              }
            });
          } else if (page.name === 'Epic, Prague') {
            const eventElements = $('.program__item');
            eventElements.each((index, element) => {
              const $event = $(element);
              const id = counter++;
              const name = $event.find('.program__item-heading a').text().trim();
              if (!name) return;
              const sdate = $event.find('time.program__item-datetime a').text().trim();
              const [day, month, year] = sdate.split('/');
              const date = new Date(year.substring(0, 4), month - 1, day);
              let image = $event.find('.program__item-image.m-grey').css('background-image');
              image = image.substring(5, image.length - 1).replace(/\\/g, '');
              image = 'https://www.epicprague.com' + image;
              const link = 'https://www.epicprague.com' + $event.find('.program__item-heading a').attr('href');
              allEvents.push({
                id,
                name,
                date,
                location: 'Epic Prague',
                image,
                soldout: 'Available',
                link,
                provider: page.name
              });
            });
          } else if (page.name === 'ESN') {
            const eventElements = $('.row .event');
            eventElements.each((index, element) => {
              const $element = $(element);
              const id = counter++;
              const name = $element.find('.name').text();

              const dayOfMonth = $element.find('.day-of-month').text();
              const month = $element.find('.month').text();
              const monthMap = {
                January: 0,
                February: 1,
                March: 2,
                April: 3,
                May: 4,
                June: 5,
                July: 6,
                August: 7,
                September: 8,
                October: 9,
                November: 10,
                December: 11
              };
              const year = new Date().getFullYear();
              const today = new Date();
              const date = new Date(year, monthMap[month], dayOfMonth);
              //remove a day from today
              today.setDate(today.getDate() - 1);
              if (today > date) { 
                date.setFullYear(year + 1);
              }

              const backgroundImage = $element.find('.header').attr('style').match(/url\((.*?)\)/)[1];
              const link = $element.find('.description').find('a').last().attr('href');

              if (!name.includes('CANCELLED')) {
                allEvents.push({
                  id,
                  name,
                  date,
                  location: '-',
                  image: backgroundImage,
                  soldout: 'Available',
                  link,
                  provider: page.name
                });
              }
            });
          } else {
            const eventElements = $('.row.event_listing');
            eventElements.each((index, element) => {
              const $event = $(element);
              const id = counter++;
              const name = $event.find('.name').text();
              const date = DateParser.parseEventDate($event.find('.date_and_time').text(), page.name);
              const location = $event.find('.venue').text();
              const image = $event.find('.event_image img').attr('src');
              const soldout = $event.find('.event_details .event_cta').text();
              const provider = page.name;
              const link = 'https://www.tickettailor.com' + $event.find('a').attr('href');

              const today = new Date();
              if (name !== 'ERASMUS CARD - OFFICIAL' && date > today.getDate() - 1) {
                allEvents.push({ id, name, date, location, image, soldout, link, provider, coupon: page.coupon });
              }
            });
          }
        } catch (error) {
          console.error('Error during scraping:', error);
        }
      });

      await Promise.all(fetchPromises);
      console.log('All events fetched');

      const sortedEvents = allEvents.sort((a, b) => a.date - b.date);
      return sortedEvents;
    } catch (error) {
      console.error('Error during web scraping:', error);
      throw error;
    }
  }
}
