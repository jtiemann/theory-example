module.exports = require('theory')
('gb', function(a) {

  (function(wordplay, $) {
    var keyPrefix = +new Date + '',
      gWordArr = [],
      initWordArray = function() {
        if (gWordArr.length > 0) return;
        // ajax called, note different promise object than localStorage version (line 9)?
        if (typeof theory.gb.getWords.complete == 'function') {
          theory.gb.getWords.complete(function(data) {
            wordArr = data.responseText.split("\n");
            localStorage.setItem("dict", data.responseText)
            //localStorage.setItem("ed",theory.gb.getWords.responseText)
          })
        }
        //comes from localStorage, note different promise object than ajax?
        else {
          theory.gb.getWords.done(function(data) {
            wordArr = data.selector.split("\n");
          })
        }
        return gWordArr = wordArr
      },
      matchRegex = function(regex) {
        var wordArrFiltered;
        initWordArray()
        wordArrFiltered = gWordArr.filter(function(unit) {
          return unit.match(regex)
        })
        return wordArrFiltered;
      },
      memoize = function(func, resolver) {
        var memoized = function() {
          var cache = memoized.cache,
          key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];
//         console.log(cache[key]
//           ? "cache hit"
//           : "cache miss")
          return cache[key]
            ? cache[key]
            : (cache[key] = func.apply(this, arguments));
        }
        memoized.cache = {};
        return memoized;
      },
      anagramRegexGenerator = function (input) {
        //http://stackoverflow.com/questions/7458319/is-it-possible-to-generate-a-compact-regular-expression-for-an-anagram-of-an-a
      var lookaheadPart = '';
      var matchingPart = '^';
      var positiveLookaheadPrefix='(?=';
      var positiveLookaheadSuffix=')';
      var inputCharacterFrequencyMap = {}
      for ( var i = 0; i< input.length; i++ )
      {
        if (!inputCharacterFrequencyMap[input[i]]) {
          inputCharacterFrequencyMap[input[i]] = 1
        } else {
          ++inputCharacterFrequencyMap[input[i]];
        }
      }
      for ( var j in inputCharacterFrequencyMap) {
        lookaheadPart += positiveLookaheadPrefix;
        for (var k = 0; k< inputCharacterFrequencyMap[j]; k++) {
          lookaheadPart += '.*';
          if (j == ' ') {
            lookaheadPart += '\\s';
          } else {
            lookaheadPart += j;
          }
          matchingPart += '.';
        }
        lookaheadPart += positiveLookaheadSuffix;
      }
      matchingPart += '$';
      return lookaheadPart + matchingPart;
      },
      combinations = function(set) {
        //https://gist.github.com/jpillora/4435759
      return (function acc(xs, set) {
        var x = xs[0];
        if(typeof x === "undefined")
          return set;
        for(var i = 0, l = set.length; i < l; ++i)
          set.push(set[i].concat(x));
        return acc(xs.slice(1), set);
      })(set, [[]]).slice(1);
    };

    //HELPER FUNCTIONS [NO SIDE EFFECTS] well...except writing to localStorage
    wordplay.getWords = (function() {
      if (localStorage.getItem("dict")) {
        return $(localStorage.getItem("dict")).promise()
      }
      else {
        return $.ajax({
          url: "../dict.txt",
          dataType: 'text'
        })
      }
    }());

    wordplay.memoizedMatchRegex = memoize(matchRegex)

    wordplay.theJumblerfn = function(word) {
      return word.split(" ").map(function(unit) {
        return unit.split("").shuffle().join("");
      }).join(" ")
    }

    wordplay.theUnjumblerfn = function(word) {
      initWordArray()
      var rx = new RegExp(anagramRegexGenerator(word));
      return gWordArr.filter(function(unit){return rx.test(unit)}).join(" ")
    }

    wordplay.wordArrOfCombinations = function(word){
      return combinations(word).
        filter(function(unit, index){return unit.length>3}).
        map(function(unit){return unit.reduce(function(word, letter){return word.concat(letter)},"") })
    }

    wordplay.theBigUnjumblerfn = function(word) {
      initWordArray()
      return wordplay.
        wordArrOfCombinations(word).
        reduce(function(sum,unit){
          var rx = new RegExp(anagramRegexGenerator(unit));
          return sum += gWordArr.
                          filter(function(gWord){return rx.test(gWord)}).
                          join(" ") + " "
         },"")
    }
    wordplay.reversee = function(word) {
      return word.split(" ").map(function(unit) {
        return unit.split("").reverse().join("");
      }).join(" ")
    }

    //INIT
    wordplay.games = [
      {"jumble": wordplay.theJumblerfn},
      {"unjumble": wordplay.theUnjumblerfn},
      {"bigunjumble": wordplay.theBigUnjumblerfn},


      {"reversee": wordplay.reversee}
    ]

  }(a.wordplay = a.wordplay || {}, jQuery))

  return a.wordplay
}, []);
