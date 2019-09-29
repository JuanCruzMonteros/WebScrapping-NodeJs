const request = require('request-promise');
const cheerio = require('cheerio');

const fs = require('fs-extra');
const writeStream = fs.createWriteStream('quotes.csv');

async function init() {
    try {
        const $ = await request({
            uri: 'http://quotes.toscrape.com/',
            transform: body => cheerio.load(body)
        });

        const websiteTitle = $('title');
        console.log('Title: ', websiteTitle.html());

        const webSiteHeading = $('h1')
        console.log('Heading: ', webSiteHeading.text().trim());

        const quote = $('.quote').find('a');
        console.log(quote.html());

        const third_quote = $('.quote').next().next();
        // Parent
        const containerClass = $('.row.header-box');

        writeStream.write('Quote|Author|Tags\n');
        const tags = [];
        $('.quote').each((i, el) => {
            const text = $(el).find('span.text').text().replace(/(^\“|\”$)/g, "");
            const author = $(el).find('span small.author').text();
            const tag = $(el).find('.tags a').html();
            tags.push(tag);
            writeStream.write(`${text}|${author}|${tags}\n`);
        })

        console.log('Done.');

    } catch (e) {
        console.log(e);
    }
}

init();