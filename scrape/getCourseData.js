const rp = require('request-promise');
const cheerio = require('cheerio');
const find = require('cheerio-eq');

const getCourseData = (url) => {
  const options = {
    uri: url,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  return rp(options)
    .then(($) => {
      // $ contains dom & html information

      var type = "ERROR??",
          name = "???";


      if($('h4').html()) {
        type = $('h4').html().replace( /(^.*\(|\).*$)/g, '' );
        name = $('h4').html().split('(')[0];
      } else {
        // type = $('html').html();
      }

      var restrictions = [];

      find($, 'table:eq(3) tbody tr:eq(4) td:eq(0) ol li').each(function() {
        restrictions.push($(this).text())
      })

      console.log()
      return {
        link: url,
        type: type, // eg lecture, lab, discussion
        name: name, // name of section
        term: find($, 'table:eq(1) tr:eq(1) td:eq(0)').html(),
        instructor: find($, 'table:eq(2) tr:eq(0) td:eq(1) a').html(),
        days: find($, 'table:eq(1) tr:eq(1) td:eq(1)').html(),
        time: find($, 'table:eq(1) tr:eq(1) td:eq(2)').html() + "-" + find($, 'table:eq(1) tr:eq(1) td:eq(3)').html(),
        building: find($, 'table:eq(1) tr:eq(1) td:eq(4)').html(),
        registered: find($, 'table:eq(3) tbody tr:eq(1) td:eq(1) strong').html(),
        freeNonRestricted: find($, 'table:eq(3) tbody tr:eq(2) td:eq(1) strong').html(),
        restricted: find($, 'table:eq(3) tbody tr:eq(3) td:eq(1) strong').html(),
        restrictions: restrictions
      };
      // return $('html').html()
    })
    .catch((err) => {
      return err;
    });
}

module.exports = getCourseData;
