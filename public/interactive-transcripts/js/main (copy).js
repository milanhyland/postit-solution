var chapters = [];
var captions = [];
var caption = -1;
var matches = [];
var query = "";
var cycle = -1;

var transcript = document.getElementById('transcript');
var search = document.getElementById('search');
var match = document.getElementById('match');

var check10="true"
var tempJson= [
  {
    "label": "Are you Okay?",
    "type": "textbox"
  },
  {
    "label": "Hey buddy, wassup?",
    "type": "textbox"
  },
  {
    "label": "Nice day noh!",
    "type": "textbox"
  },
  {
    "label": "What's your plan man!",
    "type": "textbox"
  }
  ]
// Setup JW Player
jwplayer("player").setup({
    file: '//content.jwplatform.com/manifests/3p683El7.m3u8',
    image: '//content.jwplatform.com/thumbs/3p683El7-640.jpg',
    tracks: [
      { file: "assets/chapters.vtt", kind: "chapters" },
      { file: "assets/captions.vtt", kind: "captions" },
      { file: "assets/captions2.vtt", kind: "captions" },
      { file: "//content.jwplatform.com/strips/3p683El7-120.vtt", kind: "thumbnails" }

    ],
    displaytitle: false,
    width: 640,
    height: 360
});


jwplayer().addButton(
    "assets/download.png",
    "Download Slides",
    function() {
      window.location.href = "assets/state-html5-video.pdf";
    },
    "download"
);

jwplayer().addButton(
    "assets/search.png",
    "Remove Caption",
    function() {
      window.location.href = "assets/state-html5-video.pdf";
    },
    "download2"
);


// Load chapters / captions
jwplayer().on('ready', function(){
  var r = new XMLHttpRequest();
  r.onreadystatechange = function() {
    if (r.readyState == 4 && r.status == 200) {
      var t = r.responseText.split("\n\n");
      t.shift();
      for(var i=0; i<t.length; i++) {
        var c = parse(t[i]);
        chapters.push(c);
      }
      loadCaptions();
    }
  };
  loadCaptions();
});

jwplayer().on('captionsChanged', function(){
  console.log('caption changed');
  loadCaptions();
});
function loadCaptions(){
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
  r.open('GET',jwplayer().getCaptionsList()[jwplayer().getCurrentCaptions()].id,true);
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
function closeNewDiv(){
  document.getElementById("showSomething").style.display="none";
  jwplayer().play();

  for(i=0;i<tempJson.length;i++){
    x=tempJson[i];
    //  console.log(x.label);

    console.log (document.getElementById(x.label).value);

  }

}
function populateNewDiv(){
  // var iDiv = document.createElement('div');
  // iDiv.id = 'block';

  //iDiv.className = 'block';

// Create the inner div before appending to the body
 // var innerDiv = document.createElement('div');
  //innerDiv.className = 'block-2';

// The variable iDiv is still good... Just append to it.
  //iDiv.appendChild(innerDiv);

// Then append the whole thing onto the body
var x;
  var iDiv;
  var iDivMain = document.createElement('div');
  var str='';
  for(i=0;i<tempJson.length;i++){
    x=tempJson[i];
  //  console.log(x.label);
    iDiv = document.createElement('div');
    //iDiv.id = x.label;
    str=' <p>'+x.label+' </p>';
    if (x.type== "textbox") {
      var input = document.createElement("textarea");
      input.name= "right here"
      input.id=x.label;
          // str=str+'<textarea id= '+x.label+'>'+
          //     'right here'+
          //     '</textarea>';
      iDiv.appendChild(input);
    }
    iDiv.innerHTML= str+iDiv.innerHTML;
    iDivMain.appendChild(iDiv);
  }
  str='<button onclick=closeNewDiv()>Close This Div</button>';
  document.getElementById("showSomething").innerHTML = iDivMain.innerHTML+str;
}

// Highlight current caption and chapter
jwplayer().on('time', function(e){
 //console.log( document.getElementById("showSomething").style);
 if( Math.floor(jwplayer().getPosition()) == 2 & check10 =="true"){
   console.log(Math.floor(jwplayer().getPosition()) +'abcd in getpostion on time');
   jwplayer().pause();
   //alert("Hello Saumit Da! Video is Paused!!");
   populateNewDiv();
   document.getElementById("showSomething").style.display="";
   //document.getElementById("player").style.display="none";
   check10="false"

 }
  var p = e.position;
  for(var j=0; j<captions.length; j++) {
    if(captions[j].begin < p && captions[j].end > p) {
      if(j != caption) {
        var c = document.getElementById('caption'+j);
        if(caption > -1) {
          document.getElementById('caption'+caption).className = "";
        }
        c.className = "current";
        if(query == "") {
          transcript.scrollTop = c.offsetTop - transcript.offsetTop - 40;
        }
        caption = j;
      }
      break; 
    }
  }
});



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