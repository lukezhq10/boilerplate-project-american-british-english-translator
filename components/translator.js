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
        return this.translate(text, dict, false);
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

    translate(text, dict, toBritish = true) {
        // loop through dict keys for spaces and hyphen cases and put key/values into another dict
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

        let lowercaseText = text.toLowerCase();
        // replace words with spaces
        for (let key in wordsWithSpace) {
            let regex = new RegExp(key, 'gi');
            if (regex.test(lowercaseText)) {
                text = text.replace(regex, wordsWithSpace[key]);
            }
        }
        
        // replace words with hyphens
        for (let key in wordsWithHyphen) {
            let regex = new RegExp(key, 'gi');
            if (regex.test(lowercaseText)) {
                text = text.replace(regex, wordsWithHyphen[key]);
            }
        }

        // translate titles
        // for british -> american titles, don't want Mrs to be read as 'Mr'+'s' - need diff regex
        if (toBritish === false) {
            const britishToAmericanTitles = this.swap_dictionary(americanToBritishTitles);
            let titles = {...britishToAmericanTitles};
            for (let key in titles) {
                let regex = new RegExp('\\b' + key + '\\b', 'gi');
                if (regex.test(lowercaseText)) {
                    let matches = lowercaseText.match(regex);
                    for (let match of matches) {
                        let capitalizedMatch = match.charAt(0).toUpperCase() + match.slice(1);
                        let capitalizedReplacement = titles[key].charAt(0).toUpperCase() + titles[key].slice(1);
                        text = text.replace(capitalizedMatch, capitalizedReplacement);
                    }
                }
            }
        } else {
            for (let key in titles) {
                let regex = new RegExp(key, 'gi');
                if (regex.test(lowercaseText)) {
                    let matches = lowercaseText.match(regex);
                    for (let match of matches) {
                        let capitalizedMatch = match.charAt(0).toUpperCase() + match.slice(1);
                        let capitalizedReplacement = titles[key].charAt(0).toUpperCase() + titles[key].slice(1);
                        text = text.replace(capitalizedMatch, capitalizedReplacement);
                    }
                }
            }
        }
        
        // replace single words
        // loop through words and check if it's in singleWords -> if yes, replace with singleWords[word]
        let words = text.split(" ");
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

        // translate time
        if (toBritish === false) {
            translation = this.convertTime(translation, false);
        } else {
            translation = this.convertTime(translation, true);
        };

        return translation;
    }

    highlight(translation, toBritish = true) {
        if (toBritish === true) {
            let dict = {...americanOnly, ...americanToBritishSpelling};
            let titles = {...americanToBritishTitles};

            // highlight translated words
            for (let key in dict) {
                let regex = new RegExp(this.translate(key, dict, true), 'gi');
                translation = translation.replace(regex, `<span class="highlight">${dict[key]}</span>`);
            }

            // highlight translated titles
            for (let key in titles) {
                let regex = new RegExp(this.translate(key, titles, true), 'gi');
                if (regex.test(translation)) {
                    let matches = translation.match(regex);
                    for (let match of matches) {
                        let capitalizedMatch = match.charAt(0).toUpperCase() + match.slice(1);
                        let capitalizedReplacement = titles[key].charAt(0).toUpperCase() + titles[key].slice(1);
                        translation = translation.replace(capitalizedMatch, `<span class="highlight">${capitalizedReplacement} </span>`);
                    }
                }
            }

            // highlight translated time
            let regex = /\b(\d{1,2})\.(\d{2})\b/g;
            if (regex.test(translation)) {
                translation = translation.replace(regex, `<span class="highlight">${"$1.$2"} </span>` )
            }

            console.log('highlight function:', translation);
            return translation;
        } 
        
        if (!toBritish) {
            const britishToAmericanSpelling = this.swap_dictionary(americanToBritishSpelling);
            const britishToAmericanTitles = this.swap_dictionary(americanToBritishTitles);
            let dict = {...britishOnly, ...britishToAmericanSpelling};
            let titles = {...britishToAmericanTitles};
            console.log(titles);

            // highlight translated words
            for (let key in dict) {
                let regex = new RegExp(this.translate(key, dict, true), 'gi');
                translation = translation.replace(regex, `<span class="highlight">${dict[key]}</span>`);
            }

            // highlight translated titles
            for (let key in titles) {
                let regex = new RegExp('\\b' + key + '\\b', 'gi');
                console.log(regex);
                if (regex.test(translation)) {
                    let matches = translation.match(regex);
                    console.log(matches);
                    for (let match of matches) {
                        translation = translation.replace(regex, `<span class="highlight">${match}</span>`);
                    }
                }
            }

            // highlight translated time
            let regex = /\b(\d{1,2}):(\d{2})\b/g;
            if (regex.test(translation)) {
                translation = translation.replace(regex, `<span class="highlight">${"$1:$2"} </span>` )
            }
            console.log('highlight function:', translation);
            return translation;
        };
    };

};

module.exports = Translator;