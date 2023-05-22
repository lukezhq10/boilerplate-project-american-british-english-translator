const e = require('cors');
const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    swap_dictionary(dict) {
        let swapped_dict = {};
        for (let key in dict) {
            let value = dict[key];
            swapped_dict[value] = key;
        }
        return swapped_dict
    }
    
    toBritishEnglish(text) {
        let dict = {...americanOnly, ...americanToBritishSpelling};
        return this.translate(text, dict);
    }

    toAmericanEnglish(text) {
        const britishToAmericanSpelling = this.swap_dictionary(americanToBritishSpelling);
        let dict = {...britishOnly, ...britishToAmericanSpelling};
        return this.translate(text, dict);
    }

    convertTime(string, toBritish = true) {
        let americanRegex = /\b(\d{1,2}):(\d{2})\b/g;
        let britishRegex = /\b(\d{1,2})\.(\d{2})\b/g;

        if (toBritish) {
            if (americanRegex.test(string)) {
                let britishTime = string.replace(americanRegex, "$1.$2");
                return britishTime;
            }
        } else {
            if (britishRegex.test(string)) {
                let americanTime = string.replace(britishRegex, "$1:$2");
                return americanTime;
            }
        }
        return string;
    }

    translate(text, dict) {
        // loop through dict keys for spaces and hyphen cases and put key/values into another dict
        let words = text.split(" ");
        let singleWords = {}; 
        let wordsWithSpace = {};
        let wordsWithHyphen = {};
        let titles = {...americanToBritishTitles};

        for (let key in dict) {
            if (key.includes(" ")) {
                wordsWithSpace[key] = dict[key];
            }
            if (key.includes("-")) {
                wordsWithHyphen[key] = dict[key];
            }
            else {
                singleWords[key] = dict[key];
            }
        };

        // replace single words
        // loop through words and check if it's in singleWords -> if yes, replace with singleWords[word]
        
        for (let i = 0; i < words.length; i++) {
            let word = words[i];
            let lowercaseWord = word.toLowerCase();
            let hasPeriod = false;
            // remove the last character if it's a period to query the dict with it
            if (word.endsWith(".")) {
                word = word.slice(0, -1);
                lowercaseWord = lowercaseWord.slice(0, -1);
                hasPeriod = true;
            }

            if (Object.keys(singleWords).includes(lowercaseWord)) {
                let translatedWord = singleWords[lowercaseWord];
                // if word in original text is capitalized, return capitalized word
                if (word.charAt(0).toUpperCase() === word.charAt(0)) {
                    translatedWord = translatedWord.charAt(0).toUpperCase() + translatedWord.slice(1);
                }
                // if word in original text ended with a period, add back the period            
                words[i] = hasPeriod ? translatedWord + "." : translatedWord;
            }
            
        };

        let translation = words.join(" ");
        let lowercaseTranslation = translation.toLowerCase();

        // replace words with spaces
        for (let key in wordsWithSpace) {
            let regex = new RegExp(key, 'gi');
            if (regex.test(lowercaseTranslation)) {
                translation = translation.replace(regex, wordsWithSpace[key]);
            }
        }
        
        // replace words with hyphens
        for (let key in wordsWithHyphen) {
            let regex = new RegExp(key, 'gi');
            if (regex.test(lowercaseTranslation)) {
                translation = translation.replace(regex, wordsWithHyphen[key]);
            }
        }

        // translate titles
        for (let key in titles) {
            let regex = new RegExp(key, 'gi');
            if (regex.test(lowercaseTranslation)) {
                let matches = translation.match(regex);
                for (let match of matches) {
                    let capitalizedMatch = match.charAt(0).toUpperCase() + match.slice(1);
                    let capitalizedReplacement = titles[key].charAt(0).toUpperCase() + titles[key].slice(1);
                    translation = translation.replace(capitalizedMatch, capitalizedReplacement);
                }
            }
        }

        // translate time
        translation = this.convertTime(translation, true);

        return translation;
    }

    
}

module.exports = Translator;