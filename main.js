/* Author: Jon Tiemann
*/
Array.prototype.shuffle = function() {
  //work on the copy, original unchanged
  var array = this.slice(0);
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};
Array.prototype.getUnique = function(){
  var u = {}, a = [];
  for(var i = 0, l = this.length; i < l; ++i){
    if(u.hasOwnProperty(this[i])) {
      continue;
    }
    a.push(this[i]);
    u[this[i]] = 1;
  }
  return a;
}
Array.prototype.flatten = function flatten(){
  var flat = [];
  for (var i = 0, l = this.length; i < l; i++){
    var type = Object.prototype.toString.call(this[i]).split(' ').pop().split(']').shift().toLowerCase();
    if (type) { flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten.call(this[i]) : this[i]); }
  }
  return flat;
};

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
    deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
      args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        return fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      return fn.apply(context, args);
    }
  };
}

$(document).ready(function() { 
//INIT 
$(game_type).html('<option value="unjumble">Unjumble</option>' +
  '<option value="bigunjumble">theBigUnJumble</option>' +
  '<option value="jumble">Jumble</option>' +
  '<option value="reversee">Reversee</option>')

//EVENTS
go.onclick = function(evt){
  if (game_type.value === "bigunjumble") {
    var arrOfArrOfWords = theory.gb.games.
      filter(function(unit, index){return unit[game_type.value] }).
      map(function(unit){return unit[game_type.value] })[0](word.value)

      word_matches.innerHTML = arrOfArrOfWords.flatten().sort().map(function(unit){
            return '<i>' + unit + '</i>'
          }).
           getUnique().
           join(" ")
  }
  else if (game_type.value === "unjumble") {
    word_matches.innerHTML =  theory.gb.games.
      filter(function(unit, index){return unit[game_type.value] }).
      map(function(unit){return unit[game_type.value] })[0](word.value).sort().
      map(function(word){
        return '<i>' + word + '</i>'
      }).join(" ")
  }
  else {
    word.value = theory.gb.games.
      filter(function(unit, index){return unit[game_type.value] }).
      map(function(unit){return unit[game_type.value] })[0](word.value)
  }
}

regex.onkeyup = throttle(function(evt){
  if (regex.value.match(/[a-zA-Z]/g) && regex.value.match(/[a-zA-Z]/g).length >= 3){  //done: throttle, done: cache searches (ie memoize matchRegex)
      word_matches.innerHTML = theory.gb.
        memoizedMatchRegex(new RegExp(regex.value)).
        map(function(unit){
          return '<i>' + unit + '</i>'
      }).join(" ")
  }
}, 1000)

$('body').on('click', 'i',
   function(evt){
     if (evt.type == 'click'){
       evt.currentTarget.style.fontStyle = "bold"
       //console.log(evt.currentTarget.innerHTML)
       var buildString ='http://en.wiktionary.org/w/api.php?action=parse&page=' + evt.currentTarget.innerHTML + '&format=json&prop=text&callback=?'
       $.getJSON(buildString,
         function(json) {
           if (json.parse){
             $('#wikiInfo').html('<h2>' + evt.currentTarget.innerHTML + '</h2><br/>' + json.parse.text['*']);
             $("#wikiInfo").find("a:not(.references a)").attr("href", function(){
               return "http://en.wiktionary.org/wiki/" + evt.currentTarget.innerHTML +  $(this).attr("href");
               //return $(this).attr("href");
             });
             $("#wikiInfo").find("a").attr("target", "_blank");
           }
           else {
             $('#wikiInfo').html("No Definition at Wiktionary");
           }
         }
       )
     }
   }
)

})


