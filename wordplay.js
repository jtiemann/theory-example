module.exports=require('theory')
('gb', function(a){

  (function (wordplay, $) {
  //HELPER FUNCTIONS [NO SIDE EFFECTS] well...except writing to localStorage
  wordplay.getWords = (function(){
    if (localStorage.getItem("dict")) {
      return $(localStorage.getItem("dict")).promise()
    }
    else {
      return $.ajax({
        url: "../dict.txt",
        dataType: 'text'
      }  )
    }
   }());

    var wordArrayNormalizer = function(){
      // ajax called, note different promise object than localStorage version (line 9)?
      if (typeof theory.gb.getWords.complete == 'function') {
        theory.gb.getWords.complete(function(data){
          wordArr = data.responseText.split("\n");
          localStorage.setItem("dict",data.responseText)
          //localStorage.setItem("ed",theory.gb.getWords.responseText)
        })
      }
      //comes from localStorage, note different promise object than ajax?
      else {
        theory.gb.getWords.done(function(data){
          wordArr = data.selector.split("\n");
        })
      }
      return wordArr
    }

  wordplay.matchRegex = function(regex){
      var wordArr,wordArrFiltered;
       //theory.gb.getWords().complete(function(data){wordArr = data.responseText.split("\n")});

        wordArr =  wordArrayNormalizer()
        wordArrFiltered = wordArr.filter(function(unit){return unit.match(regex) })
       return wordArrFiltered;
  }

  wordplay.theJumblerfn = function(word){
    return word.split(" ").map(function(unit){return unit.split("").shuffle().join("");}).join(" ")
  }

  wordplay.reversee = function(word){
    return word.split(" ").map(function(unit){return unit.split("").reverse().join("");}).join(" ")
  }

  //INIT
  wordplay.games = [{"jumble": wordplay.theJumblerfn}, {"reversee": wordplay.reversee}]

  }(a.wordplay = a.wordplay || {}, jQuery))

  return a.wordplay
}, []);
