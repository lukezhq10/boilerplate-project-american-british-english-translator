'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let { text, locale } = req.body;
      if (locale == 'american-to-british') {
        let translation = translator.toBritishEnglish(text);
        let highlightedTranslation = translator.highlight(translation, true);
        console.log('text:', text);
        console.log('translation:', translation);
        console.log('highlightedTranslation:', highlightedTranslation);
        
        return res.json({
          text: text,
          translation: highlightedTranslation
        });
      }

      if (locale == 'british-to-american') {
        let translation = translator.toAmericanEnglish(text);
        let highlightedTranslation = translator.highlight(translation, false);
        console.log('text:', text);
        console.log('translation:', translation);
        console.log('highlightedTranslation:', highlightedTranslation);

        return res.json({
          text: text,
          translation: highlightedTranslation
        });
      }

    });
};
