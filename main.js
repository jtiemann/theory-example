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

$(document).ready(function() { 
//INIT 
$(game_type).html('<option value="jumble">Jumble</option><option value="reversee">Reversee</option>')

  // a generic delay before calling a function
  function genericDelay(fn, ms) {
    var timer;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(fn, ms || 500);
    }
  };

//EVENTS
go.onclick = function(evt){
  //alert("I will now jumble " + evt.currentTarget.value)
  word.value = theory.gb.games.
    filter(function(unit, index){return unit[game_type.value] }).
    map(function(unit){return unit[game_type.value] })[0](word.value)
  //evt.currentTarget.value = evt.currentTarget.value.split(" ").map(function(unit){return unit.split("").shuffle().join("");}).join(" ")
}

regex.onkeyup = function(evt){
  if (regex.value.match(/[a-zA-Z]/g).length >= 3){  //todo: debounce
      word_matches.innerHTML = theory.gb.
        matchRegex(new RegExp(regex.value)).
        map(function(unit){
          return '<i>' + unit + '</i>'
      }).join(" ")
  }
}

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

       })
     }}
     )

})


