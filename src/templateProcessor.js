const handlebars = require("handlebars");
const TemplatesCache = require("./templatesCache");
const { DateTime } = require("luxon");

class TemplateProcessor {
  constructor() {
    this.templatesCache = new TemplatesCache();
    this.registerHelpers();
  }

  async build(template, context) {
    var t = this.templatesCache.get(template);

    if (!t) {
      await this.registerPartials(t);
    }

    var hb = handlebars.compile(t);

    return hb(context);
  }
  
  // ############################ Partials ############################ 

  async registerPartials(template) {
    template.match(/{{>\s*[\w\.]+\s*}}/g).map((x) => {
      var partialName = x.match(/[\w\.]+/)[0];
      handlebars.registerPartial(
        partialName,
        this.templatesCache.get(partialName)
      );
    });
  }
  // ############################ Helpers ############################ 

  async registerHelpers() {
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
      handlebars.registerHelper(
        "date",
        (date, format, options) => {
          if (date == "now") {
            return DateTime.fromJSDate(new Date()).toFormat(format);
          } else {
            return DateTime.fromISO(date).toFormat(format);
          }
        }
      );

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
    
}

module.exports = TemplateProcessor;
