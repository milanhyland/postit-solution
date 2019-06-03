var chapters = [];
var captions = [];
var caption = -1;
var matches = [];
var query = "";
var cycle = -1;

var transcript = document.getElementById('transcript');
var search = document.getElementById('search');
var match = document.getElementById('match');
var capRoll = 0;
//var firstTimeLoad = 1;

// Setup JW Player


// Load chapters / captions
// jwplayer().on('ready', function(){
//   var r = new XMLHttpRequest();
//   r.onreadystatechange = function() {
//     if (r.readyState == 4 && r.status == 200) {
//       var t = r.responseText.split("\n\n");
//       t.shift();
//       for(var i=0; i<t.length; i++) {
//         var c = parse(t[i]);
//         chapters.push(c);
//       }
//       loadCaptions();
//     }
//   };
//   loadCaptions();
// });

//
// function findCaption(item, index){
//
//   if(item.default){
//    // console.log(item.file)
//     return item.file;
//   }
//   console.log(item.file)
// }


 function abcd(){
  //jwplayer().getPlaylist()[jwplayer().getPlaylistIndex()].tracks.forEach(findCaption)
  var item= jwplayer().getPlaylist()[jwplayer().getPlaylistIndex()].tracks;
  var i;
  for (i = 0; i < item.length; i++) {
    if(item[i].default){
      // console.log(item.file)
      return item[i].file;
    }
  }
}



var toggleCaptionRoll =  function() {
  //console.log(capRoll);// = 'hidden';
  if(capRoll==1) {
   // console.log(capRoll);
    document.getElementsByClassName('sidebar')[0].style.visibility = 'hidden';
    capRoll=0;
  }
  else{
   // console.log( capRoll);
    document.getElementsByClassName('sidebar')[0].style.visibility = '';
    capRoll=1;
  }


}

jwplayer().addButton(
    "interactive-transcripts/assets/download.png",
    "Hide Caption Roll",
    toggleCaptionRoll,
    "download"
);







jwplayer().on('captionsChanged', function(){
  console.log('caption changed');
  loadCaptions("false");
});


//
//
// function hideCaptionRoll(){
//   //
//   console.log(capRoll);// = 'hidden';
//   if(capRoll==1) {
//     console.log(capRoll);
//     document.getElementsByClassName('sidebar')[0].style.visibility = 'hidden';
//
//   }
//   else{
//     console.log( capRoll);
//     document.getElementsByClassName('sidebar')[0].style.visibility = '';
//   }
//   foo=1;
//
//   //CapRoll=(( foo && !capRoll ) || ( !foo && capRoll ));
//
//
//     window.location.href = "interactive-transcripts/assets/state-html5-video.pdf";
//
// };

// function a(){
//  console.log( abcd())
// }

function loadCaptions(firstTimeLoad ){

  console.log('load caption called');
  var r = new XMLHttpRequest();
  r.onreadystatechange = function() {
    if (r.readyState == 4 && r.status == 200) {
      var t = r.responseText.split("\n\n");
      t.shift();
      var h = "<p>";
      var s = 0;
      for(var i=0; i<t.length; i++) {
        var c = parse(t[i]);
        if(s < chapters.length && c.begin > chapters[s].begin) {
          h += "</p><h4>"+chapters[s].text+"</h4><p>";
          s++;
        }
        h += "<span id='caption"+i+"'>"+c.text+"</span>";
        captions.push(c);
      }
      transcript.innerHTML = h + "</p>";
    }
  };

  if (jwplayer().getCurrentCaptions() == 0 && firstTimeLoad== "false") {
    return;
  }
  if(jwplayer().getCurrentCaptions() == 0 && firstTimeLoad == "true"){
    console.log("firsttimeload in")
    console.log(abcd()+ "in firsttimeload")
    r.open('GET', abcd() , true);
  }
  else {
    console.log("firsttimeload else part")
    r.open('GET', jwplayer().getPlaylist()[jwplayer().getPlaylistIndex()].tracks[jwplayer().getCurrentCaptions() - 1].file, true);
  }
    r.send();
};



function parse(d) {
    var a = d.split("\n");
    var i = a[1].indexOf(' --> ');
    var t = a[2];
    if (a[3]) {  t += " " + a[3]; }
    t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return {
      begin: seconds(a[1].substr(0,i)),
      btext: a[1].substr(3,i-7),
      end: seconds(a[1].substr(i+5)),
      text: t
    }
};
function seconds(s) {
  var a = s.split(':');
  var r = Number(a[a.length-1]) + Number(a[a.length-2]) * 60;
  if(a.length > 2) { r+= Number(a[a.length-3]) * 3600; }
  return r;
};



// Highlight current caption and chapter
// jwplayer().on('time', function(e){
//  // console.log('abcd');
//   var p = e.position;
//   for(var j=0; j<captions.length; j++) {
//     if(captions[j].begin < p && captions[j].end > p) {
//       if(j != caption) {
//         var c = document.getElementById('caption'+j);
//         if(caption > -1) {
//           document.getElementById('caption'+caption).className = "";
//         }
//         c.className = "current";
//         if(query == "") {
//           transcript.scrollTop = c.offsetTop - transcript.offsetTop - 40;
//         }
//         caption = j;
//       }
//       break;
//     }
//   }
// });



// Hook up interactivity
transcript.addEventListener("click",function(e) {
  if(e.target.id.indexOf("caption") == 0) { 
    var i = Number(e.target.id.replace("caption",""));
    jwplayer().seek(captions[i].begin);
  }
});
search.addEventListener('focus',function(e){
  setTimeout(function(){search.select();},100);
});
search.addEventListener('keydown',function(e) {
  if(e.keyCode == 27) {
    resetSearch();
  } else if (e.keyCode == 13) {
    var q = this.value.toLowerCase();
    if(q.length > 0) {
      if (q == query) {
        if(cycle >= matches.length - 1) {
          cycleSearch(0);
        } else { 
          cycleSearch(cycle + 1);
        }
      } else {
        resetSearch();
        searchTranscript(q);
      }
    } else {
      resetSearch();
    }
  }
});



// Execute search
function searchTranscript(q) {
  matches = [];
  query = q;
  for(var i=0; i<captions.length; i++) {
    var m = captions[i].text.toLowerCase().indexOf(q);
    if( m > -1) {
      document.getElementById('caption'+i).innerHTML = 
        captions[i].text.substr(0,m) + "<em>" + 
        captions[i].text.substr(m,q.length) + "</em>" + 
        captions[i].text.substr(m+q.length);
      matches.push(i);
    }
  }
  if(matches.length) {
    cycleSearch(0);
  } else {
    resetSearch();
  }
};
function cycleSearch(i) {
  if(cycle > -1) {
    var o = document.getElementById('caption'+matches[cycle]);
    o.getElementsByTagName("em")[0].className = "";
  }
  var c = document.getElementById('caption'+matches[i]);
  c.getElementsByTagName("em")[0].className = "current";
  match.innerHTML = (i+1) + " of " + matches.length;
  transcript.scrollTop = c.offsetTop - transcript.offsetTop - 40;
  cycle = i;
};
function resetSearch() {
  if(matches.length) {
    for(var i=0; i<captions.length; i++) {
      document.getElementById('caption'+i).innerHTML = captions[i].text;
    }
  }
  query = "";
  matches = [];
  match.innerHTML = "0 of 0";
  cycle = -1;
  transcript.scrollTop = 0;
};