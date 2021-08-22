
const { DateTime } = require("luxon");
const handlebars = require("handlebars");

const registerHelpers=async()=>{
    handlebars.registerHelper("if_eq", (a, b, opts) => {
        if (a == b) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      });
      handlebars.registerHelper("eval", (expr, options) => {
        var reg = new RegExp("\\${(\\S+)}", "g");
        var compiled = expr.replace(reg, function (match, pull) {
          return '"' + options.hash[pull] + '"';
        });
        console.log(compiled);
        var evaluated = eval(compiled);
        return evaluated;
      });

      handlebars.registerHelper("date", (date, format, options) => {

        function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }
        let initialDate = '';
          if (date == "now") {
            initialDate = DateTime.fromJSDate(new Date()).setLocale('es');
            initialDate = initialDate.toFormat(format);
            if (format == 'MMMM') 
            {
              initialDate = capitalizeFirstLetter(initialDate)
            }

            return initialDate;
          } else {
            initialDate = DateTime.fromISO(date).setLocale('es');
            initialDate = initialDate.toFormat(format);
            if (format == 'MMMM') 
            {
              initialDate = capitalizeFirstLetter(initialDate)
            }

            return initialDate;
          }
        }
      );
    }

module.exports= registerHelpers;