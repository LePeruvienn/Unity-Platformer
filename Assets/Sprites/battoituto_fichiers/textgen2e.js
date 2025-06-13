// Some globals
var _result;
var _filename;
var _datadir;
var _downloadname;
var _animtype;
var _imagewidth,_imageheight,_imagefilesize,_imagefilesizeverbose,_imagecolourdepth,_imagenumcolours;
var _currentsize,_currentsizebutton;
var _oldglowon,_currentglow,_currentglowbutton;
var _oldglossyon,_currentglossy,_currentglossybutton;
var _oldlighton,_currentlight,_currentlightbutton;

var _currentborder,_currentborderbutton;
var _currentfcnum;
var _currentstylelist;
var _cachestyles;
var _top10_stylelist,_new10_stylelist,_your_stylelist,_search_stylelist,_all10_stylelist,_random_stylelist;
var _charsel;
var _multilinesel;
var _multilinepagenum;
var _fontcol=[];
var _pagedots=[];
var _container;
var _topbanner;
var _genfields;
var _fittowidth_slider,_fittowidth1,_fittowidth2;
var _fitdisplay_countdown;
// var old_fit_value; // used in slider2.js to only update display on slider value change
var _thisstyle,_laststyle;
var slider_1,_currentfit;
var _extrabuttons_enabled;
var _numx,_numy;
var _multiline;
var _borderscale;
var _curcolourpage,_curcolourpage2,_curcolourpage3;
var _yourtextbg,_yourtext2bg,_yourtext3bg;
var _yourtext,_yourtext2,_yourtext3;
var _yourtextcleared;
var _savestyletextcleared;
var _stylesettingschanged; // Set when a setting pertaining to a style is changed
var _finishedinit, _finished_csinit;
var _loaded_stylename,_loaded_filename,_loaded_submitter,_loaded_url,_loaded_numhits,_loaded_full_url,_loaded_thumb_url,_loaded_icon_url,_loaded_yourtext_url;
var _loaded_submitter_full;
var _squery;
var _coloptbgloaded=[];
var _pageloadedstyle;
var _loadstyleinprogress;
var _previousresizetime;
var _loggedin;
var _username;
var _loginboxcached,_loginboxHTML,_loginname;
var _proaccount;
var _firstlogin;

//_loggedin=0; // Set in login-status
//_username=""; // Set in login-status instead so that we don't accidentally nullify it here
// _proaccount=0; // set in index.php
_firstlogin=0;
_loginboxcached=0;
_loginboxHTML="";
_loginname="";
_imagewidth=0;
_imageheight=0;
_imagefilesize=0;
_imagefilesizeverbose=0;
_imagecolourdepth=0;
_imagenumcolours=0;
_currentsize="x";
_currentglow="0";
_oldglowon="2"; // The previous state when glow was > 0
_currentglossy="0";
_oldglossyon="1"; // The previous state when glossy was > 0
_currentlight="0";
_oldlighton="1"; // The previous state when light was > 0
_currentborder="1";
_currentfcnum=1; // hack?
_currentfit="500";
_currentstylelist=1;
_cachestyles="none";
_top10_stylelist="none";
_new10_stylelist="none";
_your_stylelist="none";
_search_stylelist="none";
_all10_stylelist="none";
_random_stylelist="none";
_laststyle="font1";
_thisstyle="font1";
_animtype="none";
_extrabuttons_enabled=0;
_numx=8;
_numy=2;
_multiline=1;
_borderscale=0;
_curcolourpage=0;
_curcolourpage2=5;
_curcolourpage3=5;
_yourtextcleared=0;
_savestyletextcleared=0;
//_stylesettingschanged=1; // Set to 0 if page loaded from a particular style, otherwise set to 1
_stylesettingschanged=0; // Set to 0 always since we will either have intro text here or loaded style data
_finishedinit=0;
_finished_csinit=0;
_squery="";
_loadstyleinprogress=0; 
//_loadstyleinprogress=1; // Set this to 1 initially since we are effectively loading a style at page load time

//var mouseDownStatus;
//mouseDownStatus=0;

// Removes ending whitespaces
function RTrim( value ) {
	
	var re = /((\s*\S+)*)\s*/;
	return value.replace(re, "$1");
	
}
// Allow 0-9 A-Z a-z _-?! \' \" +%&/()=#*:,.
function alphanumeric_special(alphane)
{
        var numaric = alphane;
        for(var j=0; j<numaric.length; j++)
        {
          var alphaa = numaric.charAt(j);
          var hh = alphaa.charCodeAt(0);
          //if((hh > 47 && hh<58) || (hh > 64 && hh<91) || (hh > 96 && hh<123) || hh==95)
          if((hh > 47 && hh<58) || (hh > 64 && hh<91) || (hh > 96 && hh<123) || hh==32 || hh==95
	  || hh==45 || hh==63 || hh==33 || hh==39 || hh==34 || hh==43 || hh==37 || hh==38 || hh==47 || hh==40 || hh==41 
	  || hh==61 || hh==35 || hh==42 || hh==58 || hh==44 || hh==46)
          {
          }
          else return false;
        }
 return true;
}

// Convert special characters to HTML equivalents
function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function lsSet(ls_var, ls_val) {
 // Set it in local storage if available
 if(typeof(Storage) !== "undefined") {
  localStorage.setItem(ls_var,ls_val);
 }
}

function AttachResizeHandler() {
 target=window;
 if (target.addEventListener) {
  target.addEventListener ("resize",RecalcBannerBG,false);
 } else if (target.attachEvent) {
  target.attachEvent ("onresize",RecalcBannerBG);
 } else {
  target.onresize = RecalcBannerBG;
 }
//alert("attached");
}

function loadExternalScript(scriptPath, handler) {

	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = scriptPath;
	script.charset = 'utf-8';

//	script.onload = handler;

	head.appendChild(script);

}

function hideAddressBar()
{
  if(!window.location.hash)
  {
      if(document.height < window.outerHeight)
      {
          document.body.style.height = (window.outerHeight + 50) + 'px';
      }

      setTimeout( function(){ window.scrollTo(1, 0); }, 50 );
  }
}

function AddTranslate() {
return;
// Mobile user probably needs to scroll the page anyway so not much point attempting to scroll past address bar
/*
if(!window.pageYOffset){ hideAddressBar(); }
return;
window.addEventListener("orientationchange", hideAddressBar );
*/
 setTimeout("AddTranslate_real();",100);
}

function AddTranslate_real() {
window.scrollTo(0,1);
return;
//window.scrollBy(0,0);
return;
//loadExternalScript("//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit");

//document.getElementById('signin_status').style.display="";
//document.getElementById('goog-te-menu-frame.skiptranslate').style.display="";
var iframes = document.getElementsByTagName('iframe');
    for (var i=0; i<iframes.length; i++)
    {
//      alert("iframe "+iframes[i].className);
      iframes[i].style.display = "";
//      iframes[i].style.cssText = "";
//      iframes[i].style.cssText = "display:none !important"
    }
return;
/*
output='<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>';
document.getElementById('translatebox').innerHTML=output;
*/
}

/*
function AttachOnloadHandler(target,curstyle) {
// setFontColourBGLoaded(curstyle);
 if (target.addEventListener) {
//  target.addEventListener ("load",setFontColourBGLoaded,false);
  target.addEventListener ("load",function() { return setFontColourBGLoaded(curstyle); },false);
 } else if (target.attachEvent) {
//  target.attachEvent ("onload",setFontColourBGLoaded);
  target.attachEvent ("onload",function() { return setFontColourBGLoaded(curstyle); });
 } else {
//  target.onload = setFontColourBGLoaded;
  target.onload = function() { return setFontColourBGLoaded(curstyle); };
 }
}
*/

function DisplayMouseStatus() {
 document.getElementById('multilinepagenum').innerHTML = slider_mouseDownStatus;
 setTimeout("DisplayMouseStatus();",250);
}

function SetMouseDown() {
   mouseDownStatus=1; 
}
function ClearMouseDown() {
   mouseDownStatus=0; 
}

function ClickHandler() {

// target=document.body;
/*
 target=document.getElementById('container');
 if (target.addEventListener) {
  target.addEventListener ("mousedown",SetMouseDown,false);
  target.addEventListener ("mouseup",ClearMouseDown,false);
 } else if (target.attachEvent) {
  target.attachEvent ("onmousedown",SetMouseDown);
  target.attachEvent ("onmouseup",ClearMouseDown);
 } else {
  target.onmousedown = SetMouseDown;
  target.onmouseup = ClearMouseDown;
 }
*/
/*
 document.getElementById('container').onmousedown = function() {
   mouseDownStatus=1; 
//alert("mousedown");
 }
 document.getElementById('container').onmouseup = function() {
   mouseDownStatus=0;
//alert("mouseup");
 }
*/
}

function pageInit() {
//updateBGColour();
}

function ClearYourtext() {
// Only do this for mobile/tablets
if ((_is_mobile==1 || _is_tablet==1) && _yourtextcleared==0) {
//alert("clearing text");
 _yourtext.value="";
 _yourtext2.value="";
 _yourtext3.value="";
 _yourtextcleared=1;
}

}

function ClearSaveStyletext() {

if (_savestyletextcleared==0) {
//alert("clearing text");
 var stylename = document.getElementById('stylename');
// var yourname = document.getElementById('yourname');

 stylename.value="";
// yourname.value="";
 _savestyletextcleared=1;
}

}

function bgPreview() {
 if (_extrabuttons_enabled==0) 
  return;

 if (_animtype=="none")
  preview_url="/preview.php?image="+_datadir+"/"+_filename+".png";
 else
  preview_url="/preview.php?image="+_datadir+"/"+_filename+".gif";

//TINY.box.show({iframe:'http://www.scriptiny.com/',boxid:'frameless',width:750,height:450,fixed:false,maskid:'bluemask',maskopacity:40,closejs:function(){closeJS()}});
//TINY.box.show({iframe:preview_url,boxid:'frameless',width:970,height:450,fixed:false,maskid:'modalmask',maskopacity:30});


// Open modal dialog for mobile or tablet devices, otherwise a new page
if (_is_mobile==1 || _is_tablet==1) {
 document.getElementById('modal-progress').style.display="";
 preview_url="/preview-modal.php?image="+_datadir+"/"+_filename+".png";
 Ajax[0].Request(preview_url, PreviewModalCallback);
} else {
 document.getElementById('modal-progress').style.display="";
 preview_url="/preview-modal-big.php?image="+_datadir+"/"+_filename+".png";
 Ajax[0].Request(preview_url, PreviewModalBigCallback);
/*
 window.open(preview_url,"_blank");
*/
}

// window.location=preview_url;
// window.open(preview_url,"_preview");
}

function post(path, params, target) {
    method = "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target", target);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function GetDownload() {

/* 
 // GET type request
 dl_url="/get-download-image.php?ref1="+_filename+"&ref2="+_downloadname;;
// window.open(dl_url,"_download");
 window.open(dl_url,"_blank");
 //document.getElementById('download_fields').submit();
 //window.location=dl_url;
*/

 // POST type request
 post("https://textcraft.net/get-download-image.php", {ref1:_filename,ref2:_downloadname}, "_blank");

}

function GetCodes() {
 if (_extrabuttons_enabled==0) 
  return;

 if (_animtype=="none")
  codes_url="/host-image.php?result="+_result+"&ref="+_datadir+"/"+_filename+".png";
 else
  codes_url="/host-image.php?result="+_result+"&ref="+_datadir+"/"+_filename+".gif";

// Open modal dialog for mobile or tablet devices, otherwise a new page
if (_is_mobile==1 || _is_tablet==1) {
 document.getElementById('modal-progress').style.display="";
 codes_url="/host-image-modal.php?result="+_result+"&ref="+_datadir+"/"+_filename+".png";
 Ajax[0].Request(codes_url, GetCodesModalCallback);
 return;
}
// window.open(codes_url,"_blank");

 if (_animtype=="none")
  _ref=_datadir+"/"+_filename+".png";
 else
  _ref=_datadir+"/"+_filename+".gif";

 // POST type request
 post("https://textcraft.net/host-image.php", {result:_result,ref:_ref}, "_blank");

// window.location=codes_url;
// window.open(codes_url,"_codes");
}

/*
// Set the form bgcolour
function updateBGColour() {
var bgcolour_sel=_genfields.bgcolour_sel;

// bgcolour_sel dropdown
len = bgcolour_sel.length;
for (i = 0; i <len; i++) {
if (bgcolour_sel[i].selected) {
bgcolour_val = bgcolour_sel[i].value;
}
}

_genfields.bgcolour.value=bgcolour_val;
}
*/

function SwatchColourSelect(swatch,num) {

//alert(_currentglow);
// Return if trying to click on glow swatch and not in glow mode 3
if (num==0 && _currentglow!="3")
return;

// Also return if clicking on a border colour swatch, but with no border size selected
//if ((num==1 || num==2 || num==3) && _currentborder=="0")
//return;

swatch.toggle_color_select();
}

function SetFontStyle2(style,update) {
var new_x1,new_y1,new_x2,new_y2,oldstyle;
var curpage,curselpage,unicode;

//alert("SetFontStyle2 "+style);
StyleChangeSet();

// Set the font style
switch(_multiline) {
 case 0:
 case 1:
  oldstyle=_genfields.font_style.value;
  _genfields.font_style.value=style;
  curpage=_curcolourpage;
  curselpage=_genfields.font_page.value;
  break;
 case 2:
  oldstyle=_genfields.font_style2.value;
  _genfields.font_style2.value=style;
  curpage=_curcolourpage2;
  curselpage=_genfields.font_page2.value;
  break;
 case 3:
  oldstyle=_genfields.font_style3.value;
  _genfields.font_style3.value=style;
  curpage=_curcolourpage3;
  curselpage=_genfields.font_page3.value;
  break;
}
//SelectFontColour(0);

unicode=0;

// Update the selection crosshair
switch(style) {

// Minecrafter..
 case "font1": 
  new_x1=0; new_y1=-2;
  new_x2=174; new_y2=-2;
  break;
 case "font2": 
  new_x1=194; new_y1=0;
  new_x2=283; new_y2=0;
  break;
 case "font3": 
  new_x1=298; new_y1=0;
  new_x2=437; new_y2=0;
  break;
 case "font4": 
  new_x1=452; new_y1=0;
  new_x2=522; new_y2=0;
  break;

// ArcadePix..
 case "font5": 
  new_x1=0; new_y1=30;
  new_x2=116; new_y2=30;
  break;
 case "font6": 
  new_x1=139; new_y1=30;
  new_x2=258; new_y2=30;
  break;
 case "font7": 
  new_x1=277; new_y1=30;
  new_x2=389; new_y2=30;
  break;
 case "font8": 
  new_x1=409; new_y1=30;
  new_x2=522; new_y2=30;
  break;


 // Unicode fonts
 case "font13": 
  new_x1=0; new_y1=-2;
  new_x2=51; new_y2=-2;
  unicode=1;
  break;
 case "font17": 
  new_x1=81; new_y1=-2;
  new_x2=142; new_y2=-2;
  unicode=1;
  break;
 case "font12": 
  new_x1=174; new_y1=-2;
  new_x2=234; new_y2=-2;
  unicode=1;
  break;
 case "font11": 
  new_x1=264; new_y1=-2;
  new_x2=326; new_y2=-2;
  unicode=1;
  break;

 case "font14": 
  new_x1=0; new_y1=28;
  new_x2=67; new_y2=28;
  unicode=1;
  break;
 case "font15": 
  new_x1=91; new_y1=28;
  new_x2=176; new_y2=28;
  unicode=1;
  break;
 case "font9": 
  new_x1=200; new_y1=28;
  new_x2=262; new_y2=28;
  unicode=1;
  break;
// Hack	for Chinese Simplified/Traditional, both go to same selection
 case "font10":
 case "font36":
  new_x1=281; new_y1=28;
  new_x2=328; new_y2=28;
  unicode=1;
  break;


// Umbrage..
 case "font18": 
  new_x1=0; new_y1=60;
  new_x2=96; new_y2=60;
  break;
 case "font19": 
  new_x1=128; new_y1=60;
  new_x2=252; new_y2=60;
  break;
 case "font20": 
  new_x1=281; new_y1=60;
  new_x2=377; new_y2=60;
  break;
 case "font21": 
  new_x1=399; new_y1=60;
  new_x2=522; new_y2=60;
  break;

// K-Arcade..
 case "font22": 
  new_x1=0; new_y1=90;
  new_x2=116; new_y2=90;
  break;
 case "font23": 
  new_x1=143; new_y1=90;
  new_x2=251; new_y2=90;
  break;
 case "font24": 
  new_x1=280; new_y1=90;
  new_x2=376; new_y2=90;
  break;
 case "font25": 
  new_x1=407; new_y1=90;
  new_x2=522; new_y2=90;
  break;

// Helsinki..
 case "font26": 
  new_x1=0; new_y1=120;
  new_x2=82; new_y2=120;
  break;
 case "font27": 
  new_x1=109; new_y1=120;
  new_x2=202; new_y2=120;
  break;
 case "font28": 
  new_x1=229; new_y1=120;
  new_x2=322; new_y2=120;
  break;
 case "font29": 
  new_x1=349; new_y1=120;
  new_x2=427; new_y2=120;
  break;
 case "font30": 
  new_x1=451; new_y1=120;
  new_x2=522; new_y2=120;
  break;

// Pokemon..
 case "font31": 
  new_x1=3; new_y1=150;
  new_x2=88; new_y2=150;
  break;
 case "font32": 
  new_x1=112; new_y1=150;
  new_x2=194; new_y2=150;
  break;
 case "font33": 
  new_x1=215; new_y1=150;
  new_x2=296; new_y2=150;
  break;
 case "font34": 
  new_x1=319; new_y1=150;
  new_x2=381; new_y2=150;
  break;
 case "font35": 
  new_x1=402; new_y1=150;
  new_x2=522; new_y2=150;
  break;

 default:
  new_x1=0; new_y1=-2;
  new_x2=174; new_y2=-2;
  break;
}
if (unicode==1) {
  document.getElementById('fontselleft').style.display="none";
  document.getElementById('fontselright').style.display="none";
  document.getElementById('fontselleft-unicode').style.display="block";
  document.getElementById('fontselright-unicode').style.display="block";

  document.getElementById('fontselleft-unicode').style.left=new_x1+"px";
  document.getElementById('fontselleft-unicode').style.top=new_y1+"px";
  document.getElementById('fontselright-unicode').style.left=new_x2+"px";
  document.getElementById('fontselright-unicode').style.top=new_y2+"px";
} else {
  document.getElementById('fontselleft').style.display="block";
  document.getElementById('fontselright').style.display="block";
  document.getElementById('fontselleft-unicode').style.display="none";
  document.getElementById('fontselright-unicode').style.display="none";

  document.getElementById('fontselleft').style.left=new_x1+"px";
  document.getElementById('fontselleft').style.top=new_y1+"px";
  document.getElementById('fontselright').style.left=new_x2+"px";
  document.getElementById('fontselright').style.top=new_y2+"px";
}
/*
// EDIT: Too complex unfortunately...

 // Also, update the selected font colour/style if moving between two diffeerent types of font colour selections
 // ie. fonts with textures + solid colours, and fonts with only solid colours

 // Solid colour styles
 if (style!="font1" && style!="font3") {
  // If changing from a textured style to a solid style, move the current and selected page back
  if (oldstyle=="font1" || oldstyle=="font3") {
   // Save the current pages and font colour selection so we can restore it if we switch back again
   oldcurselpage=curselpage;
   oldcurpage=curpage;
   oldfontcolor=curpage;

   curselpage-=4;
   // If we had selected one of the textures, then reset selection to first solid colour
   if (curselpage<0) { 
    curselpage=0;
    SelectFontColour(0,0);
   }
   curpage-=4;
   if (curpage<0) curpage=0;
   switch(_multiline) {
   case 0:
   case 1:
    _curcolourpage=curpage;
    _genfields.font_page.value=curselpage;
    break;
   case 2:
    _curcolourpage2=curpage;
    _genfields.font_page2.value=curselpage;
    break;
   case 3:
    _curcolourpage3=curpage;
    _genfields.font_page3.value=curselpage;
    break;
   }
  }
 }
*/

  updateFontColour();

/*
if (update==1)
 ProcessGen();
*/
}

function setFontColourBGLoaded(curstyle) {
_coloptbgloaded[curstyle]=1;
//alert(curstyle+" was loaded");
// Hide progress indicator
document.getElementById('optionload-progress').style.display="none";
}

function updateFontColour() {
var imgfile;
var curstyle,curpage,curselpage;
var xoff,yoff;

switch(_multiline) {
 case 1:
  curstyle=_genfields.font_style.value;
  curpage=_curcolourpage;
  curselpage=_genfields.font_page.value;
  break;
 case 2:
  curstyle=_genfields.font_style2.value;
  curpage=_curcolourpage2;
  curselpage=_genfields.font_page2.value;
  break;
 case 3:
  curstyle=_genfields.font_style3.value;
  curpage=_curcolourpage3;
  curselpage=_genfields.font_page3.value;
  break;
}

// What the actual f*...? For some bizarre reason, this doesn't work in the switch.
//
// Edit: It's because we hadn't properly converted the multiline value to an integer 
// when it came back from the server previously, so since it was still a string, the switch wasn't 
// catching it (effectively using === operator), but the == below was doing automatic type 
// conversion in the comparison.
if (_multiline==0) {
  curstyle=_genfields.font_style.value;
  curpage=_curcolourpage;
  curselpage=_genfields.font_page.value;
}
//document.getElementById('debug-android').innerHTML=_multiline+","+curstyle+","+_genfields.font_style.value;


base_url="https://static1.textcraft.net/backgrounds/";

// Is the new colour page the same page as the current colour selected?
// If yes, make sure the selection icon overlay is displayed
// If no, hide it
if (curpage==curselpage) {
 _charsel.style.display="";
} else {
 _charsel.style.display="none";
}

imgfile=curstyle+"-bg4.jpg?v=1"; 

/*
// Update the filename ref when the image is updated
if (curstyle=="font1" || curstyle=="font3" || curstyle=="font9")
 imgfile=curstyle+"a-bg3.jpg"; 
*/

// Display progress icon if imgfile not already loaded
if (_coloptbgloaded[curstyle]==0)
 document.getElementById('optionload-progress').style.display="";

// Show the current pagedot
for (i=0;i<8;i++) {
if (i==curpage)
 _pagedots[i].style.backgroundPosition="-9px 0px";
else
 _pagedots[i].style.backgroundPosition="0px 0px";
}

// Set the background and position for each colour style div
i=0;
for(y=0;y<_numy;y++) {
for(x=0;x<_numx;x++) {
//imgfile=textures[curstyle][i]+".jpg"; 

// Update the font colour divs with the new image
_fontcol[i].style.backgroundImage="url("+encodeURI(base_url+imgfile)+")";

// Add an onload handler if this is the first image and this specific bg hasn't been loaded already
if (i==0 && _coloptbgloaded[curstyle]==0) {
 html_output="<img src='"+encodeURI(base_url+imgfile)+"' onload=\"setFontColourBGLoaded('"+curstyle+"')\">";
//alert(html_output);
 document.getElementById('hidden_optionload').innerHTML=html_output;
// AttachOnloadHandler(,curstyle); // won't work for background images..
}

// and the position
xoff=(x*55)+(curpage*55*8); // take into account current colour page.. 8x55 px width
yoff=y*55;
_fontcol[i].style.backgroundPosition="-"+xoff+"px -"+yoff+"px";

i++;
}
}

}

function ProcessGenCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
//  alert("callback done");
//  var currentTime = new Date();
//  console.log("Callback complete at "+(currentTime.getTime()%100000)/1000);

  var response = Ajax[0].request.responseXML.documentElement;
  var _image = response.getElementsByTagName('image');
  _result = response.getElementsByTagName('result')[0].firstChild.data;
  _filename = response.getElementsByTagName('filename')[0].firstChild.data;
  _datadir = response.getElementsByTagName('datadir')[0].firstChild.data;
  _downloadname = response.getElementsByTagName('downloadname')[0].firstChild.data;

  // Edit: We don't actually need to use these two, since we can get the dimensions from Javascript
  // Edit 2: But can be useful for displaying in imagedetails box
  _imagewidth = response.getElementsByTagName('imagewidth')[0].firstChild.data;
  _imageheight = response.getElementsByTagName('imageheight')[0].firstChild.data;
  _imagefilesize = response.getElementsByTagName('imagefilesize')[0].firstChild.data;
  _imagefilesizeverbose = response.getElementsByTagName('imagefilesizeverbose')[0].firstChild.data;
  _imagecolourdepth = response.getElementsByTagName('imagecolourdepth')[0].firstChild.data;
  _imagenumcolours = response.getElementsByTagName('imagenumcolours')[0].firstChild.data;

  _animtype = response.getElementsByTagName('animtype')[0].firstChild.data;
  _result=RTrim(_result);
  _downloadname=RTrim(_downloadname);

  var html_output;
  if (_animtype=="none")
   html_output="<img id='outputimg' src='https://static1.textcraft.net/"+_datadir+"/"+_filename+".png' onload='ShowOutput()'>";
  else
   html_output="<img id='outputimg' src='https://static1.textcraft.net/"+_datadir+"/"+_filename+".gif' onload='ShowOutput()'>";
/*
  var html_output="<img src='"+_datadir+"/"+_filename+".gif' onload='ShowOutput()'>"; 
*/
  document.getElementById('hidden_output').innerHTML=html_output;

  // The image is ready, but may take a while to retrieve if it's a large file
  // Update the image details status if this is the case, with an arbitrary threshold of 0.25 MB image size
  if (_proaccount==1 && _imagefilesize>262144)
//  if (_proaccount==1 && _imagefilesize>524288)
//  if (_proaccount==1 && _imagefilesize>1048576)
//  if (_proaccount==1)
   UpdateImageDetailsStatus("Retrieving image..");

/*
  alert("html_output is "+html_output);
  alert("result is "+_result);
  alert("filename is "+_filename);
*/
  //window.location="ecard-sent.php";
 }
}

function RecalcBannerBG() {
//alert("recalc start");
 var mod_width=_imagewidth;
 if (mod_width<970) mod_width=970;

 newbannerwidth=parseInt(mod_width)+(parseInt(_container.offsetLeft)*2)+8;
 //alert('width is '+mod_width+' container offset is '+_container.offsetLeft+' nbw is '+newbannerwidth);

 _topbanner.style.width=newbannerwidth+"px";

// _topbanner.style.width=screen_totals(0)+'px';
//alert("recalc end");
}

function UpdateImageDetailsStatus(msg) {
 if (_proaccount!=1)
  return;

 document.getElementById('imgdetail-status').innerHTML=msg;
}

// Update the image details box with with the current image details or "n/a"
function UpdateImageDetailsBox(avail) {
 if (_proaccount!=1)
  return;

 if (avail==1) {
  dimensions_text=_imagewidth+"x"+_imageheight+" pixels";
  filesize_text=_imagefilesizeverbose;
  colourdepth_text=_imagecolourdepth;
  numcolours_text=_imagenumcolours;
  details_colour="#bbb";
 } else {
  dimensions_text="n/a";
  filesize_text="n/a";
  colourdepth_text="n/a";
  numcolours_text="n/a";
  details_colour="#666";
 }

 document.getElementById('imgdetail_dimensions').innerHTML=dimensions_text;
 document.getElementById('imgdetail_dimensions').style.color=details_colour;
 document.getElementById('imgdetail_filesize').innerHTML=filesize_text;
 document.getElementById('imgdetail_filesize').style.color=details_colour;
 document.getElementById('imgdetail_colourdepth').innerHTML=colourdepth_text;
 document.getElementById('imgdetail_colourdepth').style.color=details_colour;
// document.getElementById('imgdetail_numcolours').innerHTML=numcolours_text;
// document.getElementById('imgdetail_numcolours').style.color=details_colour;

 // Clear the status
 UpdateImageDetailsStatus("");
}

function ShowOutput(dbimage) {
//  var currentTime = new Date();
//  console.log("ShowOutput() started at "+(currentTime.getTime()%100000)/1000);
var fromdb;
if (typeof dbimage==='undefined')
 fromdb=0;
else 
 fromdb=dbimage;

  var html_output;
  if (fromdb==1)
   html_output="<table height='100%'><tr valign='center'><td><img src='"+_loaded_yourtext_url+"' id='displayimg' style='-webkit-user-select: none;'></td></tr></table>";
  else if (_animtype=="none")
   html_output="<table height='100%'><tr valign='center'><td><img src='https://static1.textcraft.net/"+_datadir+"/"+_filename+".png' id='displayimg' style='-webkit-user-select: none;' ></td></tr></table>";
  else
   html_output="<table height='100%'><tr valign='center'><td><img src='https://static1.textcraft.net/"+_datadir+"/"+_filename+".gif' id='displayimg' style='-webkit-user-select: none;' ></td></tr></table>";

/*
  var html_output="<table height='100%'><tr valign='center'><td><img src='"+_datadir+"/"+_filename+".gif'></td></tr></table>";
*/
//  var mod_height=_imageheight;
  var mod_height=document.getElementById('outputimg').height; // Get height of image direct from javascript
//alert("mod_height is "+mod_height);
  if (mod_height<100) mod_height=100;

  document.getElementById('hidden_output').innerHTML="";
  document.getElementById('output').style.height=(parseInt(mod_height)+18)+"px";
  document.getElementById('output-wrapper').style.height=(parseInt(mod_height)+18)+"px";

  //document.getElementById('fontbox').style.marginTop=(parseInt(mod_height)-118)+43;
  document.getElementById('lower_outerbox').style.marginTop=((parseInt(mod_height)-118)+43-25)+"px";
  document.getElementById('output').innerHTML=html_output;

  // Hide the progress indicator
  document.getElementById('output-overlay').style.display="none";
//  document.getElementById('output-overlay').style.display="none";
  document.body.style.cursor="auto";

  // Adjust top banner width
  RecalcBannerBG();

  // Adjust the position of the output-overlay progress indicator to remain vertically centered over the current text
  if (parseInt(mod_height)<200)
   progress_margin=10;
  else
   progress_margin=(parseInt(mod_height)/2)-50;
  document.getElementById('output-overlay').style.marginTop=progress_margin+"px";


//  alert("image height is "+_imageheight);

// Enable the download, preview and host buttons, and set the values for them, if not showing output from db
// Also update the image details window if txpro
if (fromdb==0) {
var downloadform=document.getElementById('download_fields');
downloadform.filename.value=_filename;
downloadform.downloadname.value=_downloadname;
downloadform.animtype.value=_animtype;

UpdateImageDetailsBox(1);

if (_extrabuttons_enabled==0) {
 _extrabuttons_enabled=1;
 document.getElementById('extrabutton1').style.opacity=1;
 document.getElementById('extrabutton1').style.filter='alpha(opacity=100)';
 document.getElementById('extrabutton1').style.cursor="pointer";
 document.getElementById('extrabutton2').style.opacity=1;
 document.getElementById('extrabutton2').style.filter='alpha(opacity=100)';
 document.getElementById('extrabutton2').style.cursor="pointer";
 document.getElementById('downloadbutton').style.opacity=1;
 document.getElementById('downloadbutton').style.filter='alpha(opacity=100)';
 document.getElementById('downloadbutton').style.cursor="pointer";
}
}
// Disable the buttons if we have loaded something from db
// Should be same opacity as in style.css for extrabutton and downloadbutton
// Also put "n/a" in image details box
else {
  UpdateImageDetailsBox(0);

 _extrabuttons_enabled=0;
 document.getElementById('extrabutton1').style.opacity=.4;
 document.getElementById('extrabutton1').style.filter='alpha(opacity=40)';
 document.getElementById('extrabutton1').style.cursor="";
 document.getElementById('extrabutton2').style.opacity=.4;
 document.getElementById('extrabutton2').style.filter='alpha(opacity=40)';
 document.getElementById('extrabutton2').style.cursor="";
 document.getElementById('downloadbutton').style.opacity=.4;
 document.getElementById('downloadbutton').style.filter='alpha(opacity=40)';
 document.getElementById('downloadbutton').style.cursor="";
}

}

// Register the style as having changed. If it hadn't changed before this, re-display the 
// "Save Style" dialog.
function StyleChangeSet() {
// Don' do anything if we're still setting up the page
if (_finishedinit==0) return;

// Also don't do anything if we are in the process of loading a style
if (_loadstyleinprogress==1) return;

// Not logged in? Don't do anything.
if (_loggedin==0) return;

if (_stylesettingschanged==0) {
 document.getElementById('savestyle-heading').innerHTML="Save this style";
 document.getElementById('savestyle-success').style.display="none";
 document.getElementById('savestyle-controls').style.display="";

 document.getElementById('styledb-loaded').style.display="none";
 document.getElementById('styledb-text').style.display="";
 _stylesettingschanged=1;
}
}

function StyleLoadSet() {
/*
 document.getElementById('savestyle-heading').innerHTML="Loaded style details";
 document.getElementById('savestyle-success').style.display="none";
 document.getElementById('savestyle-controls').style.display="none";
 document.getElementById('savestyle-loaded').style.display="";
*/
 document.getElementById('styledb-text').style.display="none";
 document.getElementById('styledb-loaded').style.display="";

/*
 _loaded_stylename=stylename;
 _loaded_filename=filename;
 _loaded_submitter=submitter;
 _loaded_url=url;
 _loaded_numhits=numhits;
 _loaded_full_url=full_url;
 _loaded_thumb_url=thumb_url;
*/

 // Preserve the unabbreviated submitter name
 _loaded_submitter_full=_loaded_submitter;

 adj_fontsize="18px";
 if (_loaded_stylename.length>16)
   adj_fontsize="14px";
 if (_loaded_stylename.length>30)
   adj_fontsize="12px";
 if (_loaded_stylename.length>40)
   adj_fontsize="10px";
 if (_loaded_submitter.length>16) {
   _loaded_submitter=_loaded_submitter.substr(0,16);
   _loaded_submitter+="..";
 }

 html_output="";
 html_output+="<div id='loadedstyle-img'>";
 html_output+="<img src='";
 html_output+=_loaded_icon_url;
 html_output+="' style='width:80px; height:70px;'>";
 html_output+="</div>";
 html_output+="<div style='float:left; width:380px; border:0px solid #f00;'>";
 html_output+="<div id='loadedstyle-details1' class='notranslate'>";
 html_output+="<h2 style='font-size:";
 html_output+=adj_fontsize;
 html_output+="'>";
 html_output+=_loaded_stylename;
 html_output+="</h2>";
// html_output+="<div class='clearer' style=\"height:4px\">&nbsp;</div>";
 if (_loaded_submitter!="none") {
//  html_output+="&nbsp;- Submitted by: ";
  html_output+="&nbsp;- By: ";
  html_output+=_loaded_submitter;
 }
 html_output+="&nbsp;- Hits: ";
 html_output+=_loaded_numhits;
 html_output+="</div>";
// html_output+="<div class='clearer' style=\"clear:right\">&nbsp;</div>";
 html_output+="<div class='clearer'>&nbsp;</div>";
 html_output+="<div id='loadedstyle-details2' style='border:0px solid #0ff;'>";

/*
 _url="https://textcraft.net/"+_loaded_filename;
// html_output+="<div style='float:left; margin-left:65px; margin-right:3px;'>";
 html_output+="<div style='float:left; margin-left:35px; margin-right:3px; color:#777' class='notranslate'>";
 html_output+="URL:";
 html_output+="</div>";
 html_output+="<div id='loadedurl-bg' style='float:left; position:relative;'>";
 html_output+="<div style='position:absolute; top:3px; left:4px;'>";
 html_output+="<input type='text' name='text' readonly='readonly' value='";
 html_output+=_url;
 html_output+="' id='loadedurl' onclick='this.select();'>";
 html_output+="</div>";
 html_output+="</div>";
 html_output+="<div class='clearer'>&nbsp;</div>";
*/

 _url="https://textcraft.net/"+_loaded_submitter_full;
 if (_is_mobile==1 || _is_tablet==1) 
  html_output+="<a href='"+_url+"' id='morestyles'>";
 else
  html_output+="<a href='"+_url+"' id='morestyles' target='_blank'>";

 if (_loaded_submitter==_username)
  html_output+="View all of your saved styles";
 else
  html_output+="View all styles by <span class='notranslate'>"+_loaded_submitter+"</span>";

 html_output+="</a>";


 html_output+="</div>"; // end details2
 html_output+="</div>"; // end float left div

 html_output+="<div id='loadedstyle-img' style='margin-left:0px;'>";
 html_output+="<img src='";
 html_output+=_loaded_icon_url;
 html_output+="' style='width:80px; height:70px;'>";
 html_output+="</div>";

 // Output new yourtext

//  alert(html_output);
 document.getElementById('styledb-loaded').innerHTML=html_output;
 _stylesettingschanged=0;
}

function SearchStyles() {
 // Ajax loading anim
 document.getElementById('styledb-searchprogress').style.display="";
 _squery=document.getElementById('searchbox').value;


  var results_div=document.getElementById('styledb-results');

  // Clear search-error div if present
  var error_div=document.getElementById('searcherror');
  if (error_div!=null)
   error_div.innerHTML="";

 var reqstring;
 if (_squery.length==0)
//  reqstring = 'getstyles.php?q=top10&r=all'; // TODO - change
  reqstring = '/getstyles2.php?q=new10';
 else if (_squery.length==1) {
  // Hide progress indicator
  document.getElementById('styledb-searchprogress').style.display="none";

  output="<div id='searcherror' style='width:100%;font-size:1.2em;text-align:center;margin-top:40px;'>";
//  output="<div style='width:100%;font-size:1.2em;text-align:center;margin-top:70px;'>";
  output+="Minimum 2 characters search query length";
  output+="</div>";

  results_div.innerHTML=output;

  return;
 }
 else
  reqstring = '/getstyles2.php?q=search&s='+encodeURIComponent(_squery);

//alert(reqstring);
 _cachestyles="search"; // Cache the last ajax reply for search queries so we can re-display it when search box has focus
 Ajax[1].Request(reqstring, LoadStylesCallback);

}

// Save the style
// Display progress gif in savestyle-progress div
// Ajax call using processgen with savedb flag
// On callback, clear progress area. If call not succesful, write error msg. to progress area
// If call successful, hide the savestyle-controls div and display savestyle-success with URL
function SaveStyle() {

 // Firstly, check syntax of style name and your name fields
 var stylename = document.getElementById('stylename').value;
// var yourname = document.getElementById('yourname').value;
 var yourname = _username;

 if (stylename.length<2) {
    results = "Please choose a name for this style (min. 2 characters)";
    document.getElementById('savestyle-errormsg').innerHTML = results;
    return;
  }

 if (stylename.length>60) {
    results = "Style name is too long (";
    results += stylename.length;
    results += " of max. 60 characters)";
    document.getElementById('savestyle-errormsg').innerHTML = results;
    return;
  }

 if (yourname.length>60) {
    results = "Your name is too long (";
    results += yourname.length;
    results += " of max. 60 characters)";
    document.getElementById('savestyle-errormsg').innerHTML = results;
    return;
  }

  /* Check alphanumeric */
  if (!alphanumeric_special(stylename)) {
    results = "Style name allowed characters a-z 0-9 and _-?!\'\"+%&/()=#*:,.";
    document.getElementById('savestyle-errormsg').innerHTML = results;
    return;
  }

  if (!alphanumeric_special(yourname)) {
    results = "Your name allowed characters a-z 0-9 and _-?!\'\"+%&/()=#*:,.";
    document.getElementById('savestyle-errormsg').innerHTML = results;
    return;
  }

 html_output="<img src='https://static1.textcraft.net/img/small-progress.gif'>";
 document.getElementById('savestyle-progress').innerHTML=html_output;

 // Clear any error message
 document.getElementById('savestyle-errormsg').innerHTML="";
 document.getElementById('savestyle-errormsg').style.border="";

 //alert("savestyle");
 ProcessGen(1);
}

function SaveStyleCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  // Clear progress indicator
  document.getElementById('savestyle-progress').innerHTML="";
  document.body.style.cursor="auto";

  var response = Ajax[0].request.responseXML.documentElement;
  var _image = response.getElementsByTagName('image');
  _result = response.getElementsByTagName('result')[0].firstChild.data;
  _stylename = response.getElementsByTagName('stylename')[0].firstChild.data;
  _saved_filename = response.getElementsByTagName('filename')[0].firstChild.data;

  if (_result=="exists") {
   // Display error message
   html_output="You already have a style with this name.";
   document.getElementById('savestyle-errormsg').innerHTML=html_output;
//   document.getElementById('savestyle-errormsg').style.border="1px solid #722";

  }
  else if (_result=="nologin") {
   // Display error message
   html_output="Not logged in. Try reloading the page and logging in again.";
   document.getElementById('savestyle-errormsg').innerHTML=html_output;
  }
  else if (_result=="maxsaved") {
   // Display error message
   html_output="Maximum number of styles saved. Delete some and try again.";
   document.getElementById('savestyle-errormsg').innerHTML=html_output;
  }
  else if (_result=="ok") {
  // Hide the savestyle-controls div and display savestyle-success with URL
   _url="https://textcraft.net/"+_saved_filename;
//   html_output="<div style='width:245px; float:left; color:#8ae; font-size:.8em; line-height:18px;'>";
   html_output="<div style='width:425px; float:left; color:#8ae; font-size:.8em; line-height:18px; margin-top:7px;'>";
   html_output+="Saved as <div class='notranslate' style='display:inline'>'"+_stylename+"'</div>";
   html_output+="</div>";

   // Your Profile button
   html_output+="<div id='savestyle' style='width:110px; margin-left:7px; margin-top:-1px;'>";
//   html_output+="<a href='/"+_username+"'>";
   // Open in same window if on mobile/tablet, new window if not
   if (_is_mobile==1 || _is_tablet==1) {
    html_output+='<div id="savestylebutton" style="background-position: -220px 0px;" onmouseover="SetProfilePageButtonHigh(this)" onmouseout="SetProfilePageButtonLow(this)" onclick="window.location=\'/\'+_username;">';
   } else {
    html_output+='<div id="savestylebutton" style="background-position: -220px 0px;" onmouseover="SetProfilePageButtonHigh(this)" onmouseout="SetProfilePageButtonLow(this)" onclick="window.open(\'/\'+_username,\'_blank\');">';
   }
   html_output+="<div style='margin-top:8px'>";
   html_output+="Your profile";
   html_output+="</div>";
   html_output+="</div>";
   html_output+="</div>";

/*
   html_output+="<div style='float:left;margin-right:3px;' class='notranslate'>";
   html_output+="URL:";
   html_output+="</div>";
   html_output+="<div id='styleurl-bg' style='float:left; position:relative;'>";
   html_output+="<div style='position:absolute; top:3px; left:4px;'>";
   html_output+="<input type='text' name='text' readonly='readonly' value='";
   html_output+=_url;
   html_output+="' id='styleurl' onclick='this.select();'>";
   html_output+="</div>";
   html_output+="</div>";
*/
   document.getElementById('savestyle-heading').innerHTML="Style saved OK";
   document.getElementById('savestyle-success').innerHTML=html_output;
//   document.getElementById('savestyle-success').style.border="1px solid #722";
   document.getElementById('savestyle-controls').style.display="none";
   document.getElementById('savestyle-success').style.display="";

   // Set the "no settings changed yet" flag. When this changes, it counts as a new style, so we can 
   // re-display the save style dialog box.
   _stylesettingschanged=0;
   _pageloadedstyle=0; // Also ensure to reset this since we are no longer displaying the loaded style infobox
   
   // Invalidate the newest 10 style cache so we can click on it to see our newly saved style
   _new10_stylelist="none";
   _your_stylelist="none";

   // Auto select "your styles" 
   SetStyleListOptSelected(4,1);
  }
 }

}

function FontColourToDisplaypos(font,fontcolour) {
 return textures_displaypos[font][fontcolour];
}
function DisplayposToFontColour(font,displaypos) {
 return textures_displaypos_lookup[font][displaypos];
}

function ProcessGen(savedb) {
//var currentTime = new Date();
//console.log("ProcessGen() start at "+(currentTime.getTime()%100000)/1000);

var font_style = _genfields.font_style.value;
var font_size = _genfields.font_size.value;
var font_colour = parseInt(_genfields.font_colour.value);
var bgcolour = _genfields.color0.value;
var text = _genfields.yourtext.value;
var text2 = _genfields.yourtext2.value;
var text3 = _genfields.yourtext3.value;
var glow_halo = _genfields.glow_halo.value;
var glossy = _genfields.glossy.value;
var lighting = _genfields.lighting.value;
var border_size = _genfields.border_size.value;
var border_colour = _genfields.color1.value;
var perspective_effect = _genfields.perspective_effect.value;
var drop_shadow = _genfields.drop_shadow.value;
var fit_lines = _genfields.fit_lines.value;
var truecolour_images = _genfields.truecolour_images.value;
var non_trans = _genfields.non_trans.checked;
var glitter_border = _genfields.glitter_border.checked;
var anim_type = _genfields.anim_type.value;
var submit_type = _genfields.submittype.value;

// multi-line
var font_style2 = _genfields.font_style2.value;
var font_style3 = _genfields.font_style3.value;
var font_size2 = _genfields.font_size2.value;
var font_size3 = _genfields.font_size3.value;
var font_colour2 = parseInt(_genfields.font_colour2.value);
var font_colour3 = parseInt(_genfields.font_colour3.value);
var border_size2 = _genfields.border_size2.value;
var border_size3 = _genfields.border_size3.value;
var border_colour2 = _genfields.color2.value;
var border_colour3 = _genfields.color3.value;


// Adjust colours for page num
// font_colur etc. should be parseInt'ed beforehand so that the addition is handled numerically
page1=parseInt(_genfields.font_page.value);
//alert(font_style);
//if (font_style!="font1" && font_style!="font3") page1%=3;

page2=parseInt(_genfields.font_page2.value);
//if (font_style2!="font1" && font_style2!="font3") page2%=3;

page3=parseInt(_genfields.font_page3.value);
//if (font_style3!="font1" && font_style3!="font3") page3%=3;

font_colour+=page1*16;
font_colour2+=page2*16;
font_colour3+=page3*16;

// Convert font_colour values to actual value
font_colour=DisplayposToFontColour(font_style,font_colour);
font_colour2=DisplayposToFontColour(font_style2,font_colour2);
font_colour3=DisplayposToFontColour(font_style3,font_colour3);

font_size_val = font_size;
font_size_val2 = font_size2;
font_size_val3 = font_size3;


// If fit_lines is selected, use the fit lines width as the passed value
if (fit_lines!="0")
fit_lines=_genfields.sliderValue.value;

if (savedb==1) {
var stylename = document.getElementById('stylename').value;
//var yourname = document.getElementById('yourname').value;
var yourname = _username;
}
else
 savedb=0;

var reqstring = '/gentext3.php?text='+encodeURIComponent(text);
reqstring += '&text2='+encodeURIComponent(text2);
reqstring += '&text3='+encodeURIComponent(text3);
reqstring += '&font_style='+encodeURIComponent(font_style);
reqstring += '&font_size='+font_size_val;
reqstring += '&font_colour='+font_colour;
reqstring += '&bgcolour='+encodeURIComponent(bgcolour);
reqstring += '&glow_halo='+glow_halo;
reqstring += '&glossy='+glossy;
reqstring += '&lighting='+lighting;
reqstring += '&fit_lines='+fit_lines;
reqstring += '&truecolour_images='+truecolour_images;
reqstring += '&non_trans='+non_trans;
reqstring += '&glitter_border='+glitter_border;
reqstring += '&text_border='+border_size;
reqstring += '&border_colour='+encodeURIComponent(border_colour);
reqstring += '&anim_type='+anim_type;
reqstring += '&submit_type='+submit_type;
reqstring += '&perspective_effect='+perspective_effect;
reqstring += '&drop_shadow='+drop_shadow;
reqstring += '&savedb='+savedb;

// multi-line parameters
reqstring += '&multiline='+_multiline;
reqstring += '&font_style2='+encodeURIComponent(font_style2);
reqstring += '&font_style3='+encodeURIComponent(font_style3);
reqstring += '&font_size2='+font_size_val2;
reqstring += '&font_size3='+font_size_val3;
reqstring += '&font_colour2='+font_colour2;
reqstring += '&font_colour3='+font_colour3;
reqstring += '&text_border2='+border_size2;
reqstring += '&text_border3='+border_size3;
reqstring += '&border_colour2='+encodeURIComponent(border_colour2);
reqstring += '&border_colour3='+encodeURIComponent(border_colour3);

if (savedb==1) {
 reqstring += '&style_name='+encodeURIComponent(stylename);
 reqstring += '&your_name='+encodeURIComponent(yourname);
}
else {
 // Ajax animation
 //var html_output="<img src='ajax-loader2.gif' style='margin:40px 0 0 0'>";
 //document.getElementById('output').innerHTML=html_output;
 document.getElementById('output-overlay').style.display="";
 UpdateImageDetailsBox(0);
 UpdateImageDetailsStatus("Generating text..");
}
//alert("calling "+reqstring);

document.body.style.cursor="progress";
//document.body.style.cursor="wait";

if (savedb==1)
 Ajax[0].Request(reqstring, SaveStyleCallback);
else 
 Ajax[0].Request(reqstring, ProcessGenCallback);
}

// Load the settings for a style via ajax
function LoadStyleSettings(stylename,filename,submitter,url,numhits,full_url,thumb_url,icon_url,yourtext_url) 
{
 // We're assuming that loading the style will be successful by assigning vars here, since we only
 // want to use this data after a style has been loaded anyway.
 _loaded_stylename=unescape(stylename);
 _loaded_filename=filename;
 _loaded_submitter=unescape(submitter);
 _loaded_url=url;
 _loaded_numhits=numhits;
 _loaded_full_url=full_url;
 _loaded_thumb_url=thumb_url;
 _loaded_icon_url=icon_url;
 _loaded_yourtext_url=yourtext_url;

 // Ajax loading anim
 // Change the position for the first call if we have not loaded the page directly from a Url
 // i.e. the welcome text is still in the box
 document.body.style.cursor="progress";
// alert(_pageloadedstyle+","+_stylesettingschanged);

 // There was a style loaded directly from the front page
 if (_pageloadedstyle==1) {
//  document.getElementById('loadsettings-img').style.marginLeft="160px";
//  document.getElementById('loadsettings-img').style.margin="40px 0 0 160px";
   document.getElementById('loadsettings-img').style.margin="0 0 0 282px"; // Note: don't use semi-colons at the end of direct DOM style changes
//alert("1");
 }
 else {
//alert("2");
//  document.getElementById('loadsettings-img').style.marginLeft="200px";
  // Don't change the position if the "Save style" dialog is active (stylesettingschanged=1)
  // This is when we prompt for stylename to save etc. When we're displaying the style saved result,
  // _stylesettingschanged should be reset back to 0 so the progress icon appears at the far right.
  if (_stylesettingschanged!=1) {
//   document.getElementById('loadsettings-img').style.margin="50px 0 0 283px"; // Note: don't use semi-colons at the end of direct DOM style changes
   document.getElementById('loadsettings-img').style.margin="0 0 0 282px"; // Note: don't use semi-colons at the end of direct DOM style changes
  }

 }
 document.getElementById('loadsettings-overlay').style.display="";

 var reqstring = '/getstyles2.php?q=settings&f='+filename+'&u='+submitter+'&h=1';
 Ajax[2].Request(reqstring, LoadStyleSettingsCallback);
}

function LoadStyleSettingsCallback() {
 if(Ajax[2].CheckReadyState(Ajax[2].request))
 {
  var response = Ajax[2].request.responseXML.documentElement;
  _result = response.getElementsByTagName('result')[0].firstChild.data;

  if (_result=="none") {
   document.getElementById('loadsettings-overlay').style.display="none";
   document.getElementById('styledb-text').style.display="none";
   document.getElementById('styledb-loaded').style.display="";
   document.body.style.cursor="auto"; // Need to do this here since we don't have a callback to ShowOutput() in this case

   html_output="<span style='color:#f77; font-size:16px; font-weight:bold;'>";
   html_output+="Oops.. this style is unavailable, it may have been recently deleted or renamed."
   html_output+="</span>";

   document.getElementById('styledb-loaded').innerHTML=html_output;
   _stylesettingschanged=0;

   // Indicate that a style has just been loaded
   _pageloadedstyle=1;

  } else if (_result=="ok") {
//   alert("loadsettings callback ok");

  _s_line1 = response.getElementsByTagName('s_line1')[0].firstChild.data;
  _s_line2 = response.getElementsByTagName('s_line2')[0].firstChild.data;
  _s_line3 = response.getElementsByTagName('s_line3')[0].firstChild.data;
  _s_font1 = response.getElementsByTagName('s_font1')[0].firstChild.data;
  _s_font2 = response.getElementsByTagName('s_font2')[0].firstChild.data;
  _s_font3 = response.getElementsByTagName('s_font3')[0].firstChild.data;
  _s_font_colour1 = response.getElementsByTagName('s_font_colour1')[0].firstChild.data;
  _s_font_colour2 = response.getElementsByTagName('s_font_colour2')[0].firstChild.data;
  _s_font_colour3 = response.getElementsByTagName('s_font_colour3')[0].firstChild.data;
  _s_font_size1 = response.getElementsByTagName('s_font_size1')[0].firstChild.data;
  _s_font_size2 = response.getElementsByTagName('s_font_size2')[0].firstChild.data;
  _s_font_size3 = response.getElementsByTagName('s_font_size3')[0].firstChild.data;
  _s_border_size1 = response.getElementsByTagName('s_border_size1')[0].firstChild.data;
  _s_border_size2 = response.getElementsByTagName('s_border_size2')[0].firstChild.data;
  _s_border_size3 = response.getElementsByTagName('s_border_size3')[0].firstChild.data;
  _s_border_colour1 = response.getElementsByTagName('s_border_colour1')[0].firstChild.data;
  _s_border_colour2 = response.getElementsByTagName('s_border_colour2')[0].firstChild.data;
  _s_border_colour3 = response.getElementsByTagName('s_border_colour3')[0].firstChild.data;
  _s_glow_type = response.getElementsByTagName('s_glow_type')[0].firstChild.data;
  _s_glow_colour = response.getElementsByTagName('s_glow_colour')[0].firstChild.data;
  _s_dropshadow = response.getElementsByTagName('s_dropshadow')[0].firstChild.data;
  _s_3d_perspective = response.getElementsByTagName('s_3d_perspective')[0].firstChild.data;
  _s_multiline = response.getElementsByTagName('s_multiline')[0].firstChild.data;
  _s_glossy = response.getElementsByTagName('s_glossy')[0].firstChild.data;
  _s_lighting = response.getElementsByTagName('s_lighting')[0].firstChild.data;

  // Convert font colours to display pos
  _s_font_colour1=FontColourToDisplaypos(_s_font1,_s_font_colour1);
  _s_font_colour2=FontColourToDisplaypos(_s_font2,_s_font_colour2);
  _s_font_colour3=FontColourToDisplaypos(_s_font3,_s_font_colour3);

  // Avoid confusion by converting numeric string values to integers
  _s_multiline=parseInt(_s_multiline);

  // We got the settings for this style back ok. Now load them into the controls.
  _multiline=0;

  // We need this flag to enable a check in StyleChangeSet()
  // We'll unset it in the change callback for the glow swatch cs0_change_update(), since we shouldn't
  // need it after that.
  _loadstyleinprogress=1;

  _curcolourpage=parseInt(_s_font_colour1/16);
 // NOTE: Important not to set _genfields form value at this stage, otherwise the call to 
 // SelectFontColour() won't recognise that we are using a new (changed) page value and skip the request.
//  _genfields.font_page.value=_curcolourpage;
  _s_font_colour1%=16;
//alert("font_colour1 is "+_s_font_colour1);

  SetSizeSelected(_s_font_size1,0);
  SetBorderSelected(_s_border_size1,0);
  SetFontStyle2(_s_font1,0);
  SelectFontColour(_s_font_colour1,0);
  cs1.setrgb("#"+_s_border_colour1); // Set the border colour


  // Do line2 settings if multiline set
  if (_s_multiline>0) {
   _curcolourpage2=parseInt(_s_font_colour2/16);
//   _genfields.font_page2.value=_curcolourpage2;
   _s_font_colour2%=16;
//alert("font_colour1 is "+_s_font_colour2);

   _multiline=2;
   SetSizeSelected(_s_font_size2,0);
   SetBorderSelected(_s_border_size2,0);
   SetFontStyle2(_s_font2,0);
   SelectFontColour(_s_font_colour2,0);
   cs2.setrgb("#"+_s_border_colour2); // Set the border colour
  }

  // Do line3 settings if multiline set
  if (_s_multiline>0) {
   _curcolourpage3=parseInt(_s_font_colour3/16);
//   _genfields.font_page3.value=_curcolourpage3;
   _s_font_colour3%=16;
//alert("font_colour1 is "+_s_font_colour3);

   _multiline=3;
   SetSizeSelected(_s_font_size3,0);
   SetBorderSelected(_s_border_size3,0);
   SetFontStyle2(_s_font3,0);
   SelectFontColour(_s_font_colour3,0);
   cs3.setrgb("#"+_s_border_colour3); // Set the border colour
  }

  // Now reset multiline
  _multiline=_s_multiline;
  if (_multiline>0) 
   _multiline=1;

  // Ensure that the multi button highlighting is set correctly
  if (_multiline==1)
   document.getElementById('multibutton').style.backgroundPosition="-112px 0px";
  else
   document.getElementById('multibutton').style.backgroundPosition="-0px 0px";

  // Update some displays
  updateFontColour();
  UpdateMultiDisplay(1);

  //if (_multiline==0) 
   //UpdateMultiDisplay();

  // Set/unset general options
  SetCheckboxSelected('1',_s_3d_perspective);
  SetCheckboxSelected('2',_s_dropshadow);
  SetCheckboxSelected('3',_s_glow_type);
  SetCheckboxSelected('6',_s_glossy);
  SetCheckboxSelected('7',_s_lighting);

  // ..and the glow colour
  cs0.setrgb("#"+_s_glow_colour);

  // Load the "Your text here.." sample
  // This is an excerpt from the similar action in ProcessGenCallback
  // Note: Don't load the 'your text here' or style info box if not finished init since we already displayed these at page load time.
  // Also, if we have got to here we can consider init finished, so changes to colour swatches etc. will trigger
  // the code in StyleChangeSet() to prompt for saving a new style. 
 if (_finishedinit==1) {
  html_output="<img id='outputimg' src='"+_loaded_yourtext_url+"' onload='ShowOutput(1)'>";
  document.getElementById('hidden_output').innerHTML=html_output;
  document.getElementById('output-overlay').style.display=""; // Display ajax progress
  document.body.style.cursor="progress";

  // Display the loaded style settings in the savestyle-loaded div
  // Edit: Make this an onload trigger so that there's no flicker when displaying the style icons
  html_output="<img src='"+_loaded_icon_url+"' onload='StyleLoadSet()'>";
//  alert(html_output);
  document.getElementById('hidden_output2').innerHTML=html_output;

/*
  // Edit 2: Using innerHTML to preload the image doesn't work so great in Chrome.
  // Edit 3: Actually it doesn't make a difference either way.
  var cache_image = new Image();
  cache_image.onload = function() { // always fires the event.
   StyleLoadSet();
  };
  cache_image.src = _loaded_icon_url;
*/
//  StyleLoadSet();
 }
 else {
  // Register that we're finished initialising. StyleChangeSet() will now be effective when a setting is changed.
  _finishedinit=1;
  document.body.style.cursor="auto"; // Need to do this here since we don't have a callback to ShowOutput() in this case
 }

  // Hide the progress indicator
  document.getElementById('loadsettings-overlay').style.display="none";
//  document.body.style.cursor="auto"; // Will be reset in ShowOutput()

  // Indicate that a style has just been loaded
  _pageloadedstyle=1;

  }
 }
}


// Load the most popular styles via ajax
function LoadTop10() {
 var reqstring;

 reqstring = '/getstyles2.php?q=top10&r=thismonth';

 // First check if result is cached already
 if (_top10_stylelist!="none") {
  var output="";
  var results_div=document.getElementById('styledb-results');

  output=DisplayStylelist(_top10_stylelist);
  results_div.innerHTML=output;
 }
 else {
  // Ajax loading anim
  document.getElementById('styledb-searchprogress').style.display="";

  _cachestyles="top10";
  Ajax[1].Request(reqstring, LoadStylesCallback);
 }
}

// Load random popular styles via ajax
function LoadRandomStyles() {
 var reqstring;

 reqstring = '/getstyles2.php?q=random';

/*
 // First check if result is cached already
 if (_random_stylelist!="none") {
  var output="";
  var results_div=document.getElementById('styledb-results');

  output=DisplayStylelist(_random_stylelist);
  results_div.innerHTML=output;
 }
 else {
*/
  // Ajax loading anim
  document.getElementById('styledb-searchprogress').style.display="";

  _cachestyles="random";
  Ajax[1].Request(reqstring, LoadStylesCallback);
// }
}

// Load the most popular styles via ajax
function LoadAll10() {
 var reqstring;

 reqstring = '/getstyles2.php?q=top10&r=all';

 // First check if result is cached already
 if (_all10_stylelist!="none") {
  var output="";
  var results_div=document.getElementById('styledb-results');

  output=DisplayStylelist(_all10_stylelist);
  results_div.innerHTML=output;
 }
 else {
  // Ajax loading anim
  document.getElementById('styledb-searchprogress').style.display="";

  _cachestyles="all10";
  Ajax[1].Request(reqstring, LoadStylesCallback);
 }
}

function LoadNew10() {
 var reqstring = '/getstyles2.php?q=new10';

 // First check if result is cached already
 if (_new10_stylelist!="none") {
  var output="";
  var results_div=document.getElementById('styledb-results');

  output=DisplayStylelist(_new10_stylelist);
  results_div.innerHTML=output;
 }
 else {
  // Ajax loading anim
  document.getElementById('styledb-searchprogress').style.display="";

  _cachestyles="new10";
  Ajax[1].Request(reqstring, LoadStylesCallback);
 }
}

// Loads styles in the featured styles box
function LoadFeaturedStyles() {
// var reqstring = '/getstyles2.php?q=featured';
 var reqstring = '/getstyles2.php?q=top10&r=thismonth&start=10';

 Ajax[3].Request(reqstring, LoadFeaturedStylesCallback);
}

function LoadYourStyles() {
 var reqstring = '/getstyles2.php?q=user&u='+encodeURIComponent(_username);

 // First check if result is cached already
 if (_your_stylelist!="none") {
  var output="";
  var results_div=document.getElementById('styledb-results');

  output=DisplayStylelist(_your_stylelist);
  results_div.innerHTML=output;
 }
 else {
  // Ajax loading anim
  document.getElementById('styledb-searchprogress').style.display="";

  _cachestyles="yourstyles";
  Ajax[1].Request(reqstring, LoadStylesCallback);
 }
}


// Display the results of the last search query if there was one
function DisplayLastSearch() {
 if (_search_stylelist!="none") {
  var output="";
  var results_div=document.getElementById('styledb-results');

  output=DisplayStylelist(_search_stylelist);
  results_div.innerHTML=output;

  // Make the search box highlighted only if we have displayed the previous results
  // Pass 0 to action param so we don't redo the search
  SetStyleListOptSelected(3,0);
 }
}

function screen_totals(d) {
var b=document.body, e=document.documentElement;
return d?Math.max(Math.max(b.scrollHeight,e.scrollHeight),Math.max(b.clientHeight,e.clientHeight)):Math.max(Math.max(b.scrollWidth,e.scrollWidth),Math.max(b.clientWidth,e.clientWidth))
}

function SetContainerOpacity() {
//_container.style.opacity=.30;
//document.body.style.opacity=.30;
 document.getElementById('modal-mask').style.height=screen_totals(1)+'px'; 
 document.getElementById('modal-mask').style.width=screen_totals(0)+'px'

 document.getElementById('modal-mask').style.visibility="visible";
}
function ClearContainerOpacity() {
//_container.style.opacity=1;
//document.body.style.opacity=1;
 document.getElementById('modal-mask').style.visibility="hidden";
}


function FirstLoginCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  var response = Ajax[0].request.responseText;
  SetContainerOpacity();
  var left_pos=135+_container.offsetLeft;

//  TINY.box.show({html:response,top:120,left:135,fixed:false,animate:false,mask:false,boxid:'modalframe',closejs:function(){ClearContainerOpacity();}});
  TINY.box.show({html:response,top:145,left:left_pos,fixed:false,animate:false,mask:false,boxid:'modalframe',closejs:function(){ClearContainerOpacity();}});
 }
}

function PreviewModalCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  var response = Ajax[0].request.responseText;
//  var modal_div=document.getElementById('modal-results');
//  modal_div.innerHTML=output;

//  TINY.box.show({html:response,boxid:'modalframe',width:540,height:400,fixed:false,maskid:'modalmask',maskopacity:50});
//  TINY.box.show({html:response,left:40,fixed:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
 document.getElementById('modal-progress').style.display="none";

 SetContainerOpacity();

 // Absolute positioning relative to top of screen is increased if we're showing a banner ad at the top
 if (_showad==1)
//  TINY.box.show({html:response,top:180,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
//  TINY.box.show({html:response,top:210,left:135,fixed:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
  TINY.box.show({html:response,top:210,left:135,fixed:false,animate:false,mask:false,boxid:'modalframe',closejs:function(){ClearContainerOpacity();}});
 else
//  TINY.box.show({html:response,top:90,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
//  TINY.box.show({html:response,top:120,left:135,fixed:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
  TINY.box.show({html:response,top:120,left:135,fixed:false,animate:false,mask:false,boxid:'modalframe',closejs:function(){ClearContainerOpacity();}});
 }
}

function PreviewModalBigCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  var response = Ajax[0].request.responseText;
//  var modal_div=document.getElementById('modal-results');
//  modal_div.innerHTML=output;

//  TINY.box.show({html:response,boxid:'modalframe',width:540,height:400,fixed:false,maskid:'modalmask',maskopacity:50});
//  TINY.box.show({html:response,left:40,fixed:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
 document.getElementById('modal-progress').style.display="none";

 SetContainerOpacity();
// var left_pos=65+_container.offsetLeft;
 var left_pos=2+_container.offsetLeft;

 // Absolute positioning relative to top of screen is increased if we're showing a banner ad at the top
 if (_showad==1)
//  TINY.box.show({html:response,top:180,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
//  TINY.box.show({html:response,top:210,left:135,fixed:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
  TINY.box.show({html:response,top:160,left:left_pos,fixed:false,animate:false,mask:false,boxid:'modalframe',closejs:function(){ClearContainerOpacity();}});
 else
//  TINY.box.show({html:response,top:90,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
//  TINY.box.show({html:response,top:120,left:135,fixed:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
  TINY.box.show({html:response,top:70,left:left_pos,fixed:false,animate:false,mask:false,boxid:'modalframe',closejs:function(){ClearContainerOpacity();}});
 }
}

function AndroidInstallModalCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  var response = Ajax[0].request.responseText;

  document.getElementById('modal-progress').style.display="none";
  SetContainerOpacity();

  // Absolute positioning relative to top of screen is increased if we're showing a banner ad at the top
  if (_showad==1)
//   TINY.box.show({html:response,top:1010,left:135,fixed:false,animate:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
   TINY.box.show({html:response,top:1010,left:135,fixed:false,animate:false,mask:false,boxid:'modalframe',closejs:function(){ClearContainerOpacity();}});
  else
//   TINY.box.show({html:response,top:920,left:135,fixed:false,animate:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
   TINY.box.show({html:response,top:920,left:135,fixed:false,animate:false,mask:false,boxid:'modalframe',closejs:function(){ClearContainerOpacity();}});
 }
}

function DownloadModalCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  var response = Ajax[0].request.responseText;

  document.getElementById('modal-progress').style.display="none";
  SetContainerOpacity();

  // Absolute positioning relative to top of screen is increased if we're showing a banner ad at the top
  if (_showad==1)
//   TINY.box.show({html:response,top:210,left:135,fixed:false,animate:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
   TINY.box.show({html:response,top:210,left:135,fixed:false,animate:false,mask:false,boxid:'modalframe',closejs:function(){ClearContainerOpacity();}});
  else
//   TINY.box.show({html:response,top:120,left:135,fixed:false,animate:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});
   TINY.box.show({html:response,top:120,left:135,fixed:false,animate:false,mask:false,boxid:'modalframe',closejs:function(){ClearContainerOpacity();}});
 }
}

function GetCodesModalCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  var response = Ajax[0].request.responseText;
//alert("Response is: "+response);
//  var modal_div=document.getElementById('modal-results');
//  modal_div.innerHTML=output;

 // Extract the javascript to run on load of modal box
 // We do this since any retrieved Javascript from the Ajax call isn't executed when we open the modal box or otherwise insert it
 // into a div or innerhtml. So we need to extract it from the Ajax response, then use the modal box onload handler to run it when
 // (just after) the modal box opens.
 //
 // Note: There might be problems with old versions of Netscape(?) using this approach, since they might actually execute the script in the modal box
 // just due to the fact that the script is contained there. So ideally we need to strip out (or comment out) the script before we pass it to 
 // the modal box function. But realistically, if no current browser actually does this then we're fine.
 //
 // This specific match only works if there is only a single script block, we're not looping through the response and concatenating script blocks.
 var re = /<script\b[\s\S]*?>([\s\S]*?)<\/script>/ig;
 var match;
 match = re.exec(response);
 jstags=match[1];
 
 // Comment out the JS after we extracted it
 // This only works if there are no comments in the script itself.
 new_response1=response.replace("<script type='text/javascript'>","<!--");
 new_response2=new_response1.replace("</script>","-->");

 document.getElementById('modal-progress').style.display="none";
 SetContainerOpacity();

//  TINY.box.show({html:response,boxid:'modalframe',width:540,height:400,fixed:false,maskid:'modalmask',maskopacity:50});
//  TINY.box.show({html:response,left:40,fixed:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50});

 // Absolute positioning relative to top of screen is increased if we're showing a banner ad at the top
 // Note that the 
 if (_showad==1)
//  TINY.box.show({html:new_response2,top:180,boxid:'modalframe',maskid:'modalmask',maskopacity:50,openjs:function(){eval(jstags)}});
//  TINY.box.show({html:new_response2,top:210,left:197,fixed:false,animate:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50,openjs:function(){eval(jstags)}});
  TINY.box.show({html:new_response2,top:210,left:197,fixed:false,animate:false,mask:false,boxid:'modalframe',openjs:function(){eval(jstags)},closejs:function(){ClearContainerOpacity();}});
 else
//  TINY.box.show({html:new_response2,top:90,boxid:'modalframe',maskid:'modalmask',maskopacity:50,openjs:function(){eval(jstags)}});
//  TINY.box.show({html:new_response2,top:120,left:197,fixed:false,animate:false,boxid:'modalframe',maskid:'modalmask',maskopacity:50,openjs:function(){eval(jstags)}});
  TINY.box.show({html:new_response2,top:120,left:197,fixed:false,animate:false,mask:false,boxid:'modalframe',openjs:function(){eval(jstags)},closejs:function(){ClearContainerOpacity();}});
 }

/*
 // Now run the extracted Javascript
var re = /<script\b[\s\S]*?>([\s\S]*?)<\/script>/ig;
var match;
while (match = re.exec(response)) {
alert(match[1]);
eval(match[1]);
}
*/

}

function LoadFeaturedStylesCallback() {
 if(Ajax[3].CheckReadyState(Ajax[3].request))
 {
  var response = Ajax[3].request.responseXML.documentElement;
  _result = response.getElementsByTagName('result')[0].firstChild.data;

  if (_result=="ok") {

   // Parse and display results
   var stylelist = response.getElementsByTagName('style');
   var output;

   output=DisplayFeaturedStylelist(stylelist);

   var results_div=document.getElementById('featured-style-results');
   results_div.innerHTML=output;
  }
 }
}

function LoadStylesCallback() {
 if(Ajax[1].CheckReadyState(Ajax[1].request))
 {
  // Clear progress indicator
  document.getElementById('styledb-searchprogress').style.display="none";

  var response = Ajax[1].request.responseXML.documentElement;
  _result = response.getElementsByTagName('result')[0].firstChild.data;

  if (_result=="ok") {

   // Parse and display results
   var stylelist = response.getElementsByTagName('style');
   var output="";

   // No results
   if (stylelist.length==0) {
    output="<div id='searcherror' style='width:100%;font-size:1.2em;text-align:center;margin-top:40px;'>";
//    output="<div style='width:100%;font-size:1.3em;text-align:center;margin-top:70px;'>";

    // Display a different message if user doesn't have any saved styles
    if (_cachestyles=="yourstyles") {
     output+="You don't have any saved styles yet";
    } else {
     var _squery_strip = _squery.replace(/(<([^>]+)>)/ig,"");
     output+="No matching results for '";
     output+=_squery_strip;
     output+="'";
    }

    output+="</div>";

    // Clear any previously cached results
    _search_stylelist="none";
   }
   else {
   // Cache results for future use
   if (_cachestyles=="top10")
	_top10_stylelist=stylelist;
   else if (_cachestyles=="new10")
	_new10_stylelist=stylelist;
   else if (_cachestyles=="yourstyles")
	_your_stylelist=stylelist;
   else if (_cachestyles=="search")
	_search_stylelist=stylelist;
   else if (_cachestyles=="all10")
	_all10_stylelist=stylelist;
   else if (_cachestyles=="random")
	_random_stylelist=stylelist;

   output=DisplayStylelist(stylelist);
   }

   var results_div=document.getElementById('styledb-results');
   results_div.innerHTML=output;
  }

 // Clear the search query var
 // Note: Important to do it here and not at the very end because the callback may be called more than once before
 // it's in the ready state.
 _squery="";
 }

}

// DisplayFeaturedStylelist is a simplified version of DisplayStyleList
function DisplayFeaturedStylelist(stylelist) 
{   
   var output="";

   var numitems=stylelist.length;
   if (numitems>9) numitems=9;

   // Display style list results
   for (var i=0;i<numitems;i++)
   {
    _stylename = stylelist[i].getElementsByTagName('stylename')[0].firstChild.data;
    _stylefilename = stylelist[i].getElementsByTagName('filename')[0].firstChild.data;
    _submitter = stylelist[i].getElementsByTagName('submitter')[0].firstChild.data;
    _url = stylelist[i].getElementsByTagName('url')[0].firstChild.data;
    _numhits = stylelist[i].getElementsByTagName('numhits')[0].firstChild.data;
    _full_url=_url+".png";
    _thumb_url=_url+"-thumb.png";
    _icon_url=_url+"-icon.png";
    _yourtext_url=_url+"-yourtext.png?v=1";

    styleid=i;

     output+="<div class='styleresult notranslate' ";

    //output+=" onclick='SetStyleResultTouch("+styleid+"); LoadStyleSettings(\"";
    output+=" onclick='LoadStyleSettings(\"";
    output+=escape(_stylename); // Stylename may have weird characters in it, needs to be escape before used as a param
//    output+=escapeHtml(_stylename);
    output+="\",\"";
    output+=_stylefilename;
    output+="\",\"";
    output+=escape(_submitter);
    output+="\",\"";
    output+=_url;
    output+="\",\"";
    output+=_numhits;
    output+="\",\"";
    output+=_full_url;
    output+="\",\"";
    output+=_thumb_url;
    output+="\",\"";
    output+=_icon_url;
    output+="\",\"";
    output+=_yourtext_url;
    output+="\")' ";
/*
    output+="onmouseover='SetStyleResultHigh(\"";
    output+=styleid;
    output+="\")' onmouseout='SetStyleResultLow(\"";
    output+=styleid;
    output+="\")'>";
*/
    output+=">";

    // Output a thumbnail
    output+="<div style='height:60px'>";
    output+="<img src='";
    output+=_thumb_url;
    output+="'>";

    output+="</div>";

    output+="<div class='clearer'></div>";
    output+="<div class='stylestats-basic' id='stylestats-";
    output+=styleid;
    output+="'>";

    adj_fontsize="14px";
    adj_lineheight="16px";
    adj_margin="3px";
    adj_margin2="2px";
    if (_stylename.length>10) {
     adj_fontsize="12px";
     adj_lineheight="13px";
     adj_margin="4px";
 //    adj_margin="5px";
     adj_margin2="1px";
    }
    if (_stylename.length>35) {
     adj_fontsize="10px";
     adj_lineheight="11px";
     adj_margin="4px";
     adj_margin2="1px";
     _stylename=_stylename.substr(0,32);
     _stylename+="..";
    }

    output+="<div id='loadedstyle-";
    output+=styleid;
    output+="' style='vertical-align:top; width:86px; height:27px; overflow:hidden; border:0px solid #f00; font-size:";
    output+=adj_fontsize;
    output+="; line-height:";
    output+=adj_lineheight;
    output+="; margin-top:";
    output+=adj_margin;
    output+=";'>";

    output+=_stylename;
    output+="</div>";

    output+="<div class='clearer'></div>";

    output+="</div>";
    output+="</div>";
   }
return output;
}

function DisplayStylelist(stylelist) 
{   
   var output="";

   // Display style list results
   for (var i=0;i<stylelist.length;i++)
   {
    _stylename = stylelist[i].getElementsByTagName('stylename')[0].firstChild.data;
    _stylefilename = stylelist[i].getElementsByTagName('filename')[0].firstChild.data;
    _submitter = stylelist[i].getElementsByTagName('submitter')[0].firstChild.data;
    _url = stylelist[i].getElementsByTagName('url')[0].firstChild.data;
    _numhits = stylelist[i].getElementsByTagName('numhits')[0].firstChild.data;

    // Get the score if it was a search query
//    alert(_squery);

    if (_squery!="") {
     _score = stylelist[i].getElementsByTagName('score')[0].firstChild.data;
    }
    _full_url=_url+".png";
    _thumb_url=_url+"-thumb.png";
    _icon_url=_url+"-icon.png";
    _yourtext_url=_url+"-yourtext.png?v=1";

    //styleid="loadedstyle-"+i;
    styleid=i;
    //alert(styleid);

    // Note: URL doesn't include extension so that we can create thumbnail filename from it also
//     output+="<div class='styleresult notranslate'>";
     output+="<div class='styleresult notranslate' ";

    output+=" onclick='SetStyleResultTouch("+styleid+"); LoadStyleSettings(\"";
    output+=escape(_stylename); // Stylename may have weird characters in it, needs to be escape before used as a param
//    output+=escapeHtml(_stylename);
    output+="\",\"";
    output+=_stylefilename;
    output+="\",\"";
    output+=escape(_submitter);
    output+="\",\"";
    output+=_url;
    output+="\",\"";
    output+=_numhits;
    output+="\",\"";
    output+=_full_url;
    output+="\",\"";
    output+=_thumb_url;
    output+="\",\"";
    output+=_icon_url;
    output+="\",\"";
    output+=_yourtext_url;
    output+="\")' ";
    output+="onmouseover='SetStyleResultHigh(\"";
    output+=styleid;
    output+="\")' onmouseout='SetStyleResultLow(\"";
    output+=styleid;
    output+="\")'>";

//    output+="<div class='styleresult' onmouseover='SetStyleResultHigh(this)' onmouseout='SetStyleResultLow(this)'>";

    // Output a thumbnail
    output+="<div style='height:60px'>";
    output+="<img src='";
    output+=_thumb_url;
    output+="'>";
/*
    // Output a clickable thumbnail
    output+="' onclick='LoadStyleSettings(\"";
    output+=escape(_stylename); // Stylename may have weird characters in it, needs to be escape before used as a param
//    output+=escapeHtml(_stylename);
    output+="\",\"";
    output+=_stylefilename;
    output+="\",\"";
    output+=escape(_submitter);
    output+="\",\"";
    output+=_url;
    output+="\",\"";
    output+=_numhits;
    output+="\",\"";
    output+=_full_url;
    output+="\",\"";
    output+=_thumb_url;
    output+="\",\"";
    output+=_icon_url;
    output+="\",\"";
    output+=_yourtext_url;
    output+="\")' style='cursor:pointer; margin-left:4px;' ";
    output+="onmouseover='SetStyleResultHigh(\"";
    output+=styleid;
    output+="\")' onmouseout='SetStyleResultLow(\"";
    output+=styleid;
    output+="\")'>";
*/
    output+="</div>";

    output+="<div class='clearer'></div>";
//    output+="<div class='stylestats'>";
    output+="<div class='stylestats' id='stylestats-";
    output+=styleid;
    output+="'>";

//    adj_fontsize="1.4em";
    adj_fontsize="14px";
    adj_lineheight="16px";
    adj_margin="3px";
    adj_margin2="2px";
/*
    if (_stylename.length>10) {
//     adj_fontsize="1.1em";
     adj_fontsize="11px";
     adj_lineheight="12px";
    }
*/
    if (_stylename.length>10) {
//     adj_fontsize="1.1em";
     adj_fontsize="10px";
     adj_lineheight="11px";
     adj_margin="4px";
     adj_margin2="1px";
    }
    if (_stylename.length>35) {
//     adj_fontsize=".8em";
     adj_fontsize="10px";
     adj_lineheight="11px";
     adj_margin="4px";
     adj_margin2="1px";
     _stylename=_stylename.substr(0,32);
     _stylename+="..";
    }

    output+="<div id='loadedstyle-";
    output+=styleid;
    output+="' style='vertical-align:top; width:86px; height:23px; overflow:hidden; border:0px solid #f00; font-size:";
    output+=adj_fontsize;
    output+="; line-height:";
    output+=adj_lineheight;
    output+="; margin-top:";
    output+=adj_margin;
    output+=";'>";

/*
    if (_stylename.length>9) {
     output+=_stylename.substr(0,9);
     output+="..";
    }
    else
     output+=_stylename;
*/
    output+=_stylename;
    output+="</div>";

    output+="<div class='clearer'></div>";


    adj_fontsize="1.1em";
    if (_submitter.length>10)
     adj_fontsize="1.0em";
    if (_submitter.length>15)
     adj_fontsize=".90em";

    output+="<div style='color:#98a; height:11px; line-height:11px; overflow:hidden; font-size:";
    output+=adj_fontsize;
    output+="; margin-top:";
    output+=adj_margin2;
    output+=";'>";
    output+="by: ";
    output+=_submitter;
    output+="</div>";

    output+="<div class='clearer'></div>";
    output+="<div style='color:#696990; margin-top:0px; height:13px; line-height:13px; overflow:hidden; font-size:1.1em;'>";
    output+="hits: ";
    output+=_numhits;

/*
    // For testing
    if (_squery!="") {
     output+=",";
     output+=_score;
    }
*/
    output+="</div>";

    output+="</div>";
    output+="</div>";
   }
return output;
}

// Set checkbox script
function SetCheckboxHigh(formval) {
var formvar;

// Get the form value we're refering to
switch(formval) {
case "1": // 3d perspective
 formvar = _genfields.perspective_effect;
 break;
case "2": // drop shadow
 formvar = _genfields.drop_shadow;
 break;
case "3": // glow
 formvar = _genfields.glow_halo;
 break;
case "4": // fit lines
 formvar = _genfields.fit_lines;
 break;
case "5": // 24-bit
 formvar = _genfields.truecolour_images;
 break;
case "6": // glossy
 formvar = _genfields.glossy;
 break;
case "7": // lighting
 formvar = _genfields.lighting;
 break;
}

 // Return if checkbox already set
 if (formvar.value!=0) return;

 element=document.getElementById("checkbox"+formval);
 element.style.backgroundPosition="-66px 0px";
}

function SetCheckboxLow(formval) {
var formvar;

// Get the form value we're refering to
switch(formval) {
case "1": // 3d perspective
 formvar = _genfields.perspective_effect;
 break;
case "2": // drop shadow
 formvar = _genfields.drop_shadow;
 break;
case "3": // glow
 formvar = _genfields.glow_halo;
 break;
case "4": // fit lines
 formvar = _genfields.fit_lines;
 break;
case "5": // 24-bit
 formvar = _genfields.truecolour_images;
 break;
case "6": // glossy
 formvar = _genfields.glossy;
 break;
case "7": // lighting
 formvar = _genfields.lighting;
 break;
}

 // Return if checkbox already set
 if (formvar.value!=0) return;

 element=document.getElementById("checkbox"+formval);
 element.style.backgroundPosition="0px 0px";
}


//function SetCheckboxSelected(element,formval) {
function SetCheckboxSelected(formval,option) {
var formvar,update,swatchimg,swatchdisplay;
var optionset;

if (typeof option==='undefined')
 optionset=0;
else {
 optionset=1;
//alert("Option was passed as "+option);
/*
if (optionset==1 && option>=1)
alert("turning on "+formval);
else
alert("turning off "+formval);
*/
}

update=0;
// Auto update when selection options on a tablet due to extra screen size - we can see changes in the output unlike on some laptops
// Make sure to only do this after finished init and not when load style is in progress, otherwise we will be updating the text when loading 
// in specific style settings either on page load or when selecting them on the page.
if (_finishedinit==1 && _loadstyleinprogress==0 && (_is_tablet==1 || _is_ios==1 || _is_android==1))
 update=1;

element=document.getElementById("checkbox"+formval);

// Get the form value we're refering to
switch(formval) {
case "1": // 3d perspective
 formvar = _genfields.perspective_effect;
 StyleChangeSet();
 break;
case "2": // drop shadow
 formvar = _genfields.drop_shadow;
 StyleChangeSet();
 break;
case "3": // glow
 formvar = _genfields.glow_halo;
 StyleChangeSet();
 break;
case "4": // fit lines
 formvar = _genfields.fit_lines;
 break;
case "5": // 24-bit
 formvar = _genfields.truecolour_images;
 break;
case "6": // glossy
 formvar = _genfields.glossy;
 StyleChangeSet();
 break;
case "7": // lighting
 formvar = _genfields.lighting;
 StyleChangeSet();
 break;
}

// Don't do anything if aksed to switch off already off glow
if (optionset==1 && option==0 && formval=="3" && formvar.value=="0")
 return;

// Don't do anything if aksed to switch off already off glossy
if (optionset==1 && option==0 && formval=="6" && formvar.value=="0")
 return;

// Don't do anything if aksed to switch off already off lighting
if (optionset==1 && option==0 && formval=="7" && formvar.value=="0")
 return;


// Switch on if off, and vice versa
// OR if option param is set to 1, then set this checkbox on
//alert(formval+", "+formvar.value);
if ((optionset==0 && formvar.value=="0") || (optionset==1 && option>=1)) {
//alert("switch on");

// Special case for setting glow value, fit lines value, glossy and lighting values
if (formval=="3") {
// formvar.value=_currentglow;

 // If turning on glow from optionset, set _oldglowon value to be option, also update the highlighted background
 if (optionset==1) {
  _oldglowon=option;
  
  // Turning on first glow button
  if (option==2) {
   document.getElementById('optionwidth4_default').style.backgroundPosition="-104px 0px";
   document.getElementById('optionwidth4').style.backgroundPosition="0px 0px";
   _currentglowbutton=document.getElementById('optionwidth4_default');
  }
  // Or the second
  else if (option==3) {
   document.getElementById('optionwidth4_default').style.backgroundPosition="0px 0px";
   document.getElementById('optionwidth4').style.backgroundPosition="-104px 0px";
   _currentglowbutton=document.getElementById('optionwidth4');
  }
 }

 formvar.value=_oldglowon; // Reset the form value to whatever it was the last time the button was checked
 _currentglow=_oldglowon;
 document.getElementById('optionwidth4_default').style.cursor="pointer";
 document.getElementById('optionwidth4').style.cursor="pointer";

 // Highlight the colour swatch again if now in glow mode 3
 swatchimg=document.getElementById('color0_img');
 swatchdisplay=document.getElementById('color0_display');
 if (_currentglow=="3") {
  swatchimg.src="https://static1.textcraft.net/img/colorpick/color_select_icon2a.png";
  swatchimg.style.cursor="pointer";
  swatchdisplay.style.cursor="pointer";
 }
 else {
  swatchimg.src="https://static1.textcraft.net/img/colorpick/color_select_icon2a-dark.png";
  swatchimg.style.cursor="";
  swatchdisplay.style.cursor="";
 }
} // end special case for glow
// Special case for glossy
else if (formval=="6") {

 // If turning on glossy from optionset, set _oldglossyon value to be option, also update the highlighted background
 if (optionset==1) {
  
  // Turn on the selected glossy button
  document.getElementById('glossybutton-'+option).style.backgroundPosition="-64px 0px";
  document.getElementById('glossybutton-'+_oldglossyon).style.backgroundPosition="0px 0px";

  _currentglossybutton=document.getElementById('glossybutton-'+option);
  _oldglossyon=option;
 }

 formvar.value=_oldglossyon; // Reset the form value to whatever it was the last time the button was checked
 _currentglossy=_oldglossyon;

 document.getElementById('glossybutton-1').style.cursor="pointer";
 document.getElementById('glossybutton-2').style.cursor="pointer";

} // end special case for glossy
// Special case for lighting
else if (formval=="7") {

 // If turning on lighting from optionset, set _oldlighton value to be option, also update the highlighted background
 if (optionset==1) {
  
  // Turn on the selected lighting button
  document.getElementById('lightbutton-'+option).style.backgroundPosition="-64px 0px";
  document.getElementById('lightbutton-'+_oldlighton).style.backgroundPosition="0px 0px";

  _currentlightbutton=document.getElementById('lightbutton-'+option);
  _oldlighton=option;
 }

 formvar.value=_oldlighton; // Reset the form value to whatever it was the last time the button was checked
 _currentlight=_oldlighton;

 document.getElementById('lightbutton-1').style.cursor="pointer";
 document.getElementById('lightbutton-2').style.cursor="pointer";
 document.getElementById('lightbutton-3').style.cursor="pointer";
 document.getElementById('lightbutton-4').style.cursor="pointer";
 document.getElementById('lightbutton-5').style.cursor="pointer";
 document.getElementById('lightbutton-6').style.cursor="pointer";

} // end special case for lighting
else if (formval=="4") {
 formvar.value=_currentfit;
 update=0; // don't update just yet if turning on fit to width checkbox
}
else 
 formvar.value="1";

 element.style.backgroundPosition="-33px 0px";

// Turn off checkbox option
} else {

 // Special case for glossy
 if (formval=="6") {
  _oldglossyon=formvar.value; // save the current state if we turn off the glow checkbox
  _currentglossy=0;
  document.getElementById('glossybutton-1').style.cursor="";
  document.getElementById('glossybutton-2').style.cursor="";
 } 
 // Special case for lighting
 else if (formval=="7") {
  _oldlighton=formvar.value; // save the current state if we turn off the glow checkbox
  _currentlight=0;
  document.getElementById('lightbutton-1').style.cursor="";
  document.getElementById('lightbutton-2').style.cursor="";
  document.getElementById('lightbutton-3').style.cursor="";
  document.getElementById('lightbutton-4').style.cursor="";
  document.getElementById('lightbutton-5').style.cursor="";
  document.getElementById('lightbutton-6').style.cursor="";
 } 
 // Special case for glow
 else if (formval=="3") {
  _oldglowon=formvar.value; // save the current state if we turn off the glow checkbox
  _currentglow=0;
  document.getElementById('optionwidth4_default').style.cursor="";
  document.getElementById('optionwidth4').style.cursor="";

  // Unhighlight the swatch
  swatchimg=document.getElementById('color0_img');
  swatchdisplay=document.getElementById('color0_display');
  swatchimg.src="https://static1.textcraft.net/img/colorpick/color_select_icon2a-dark.png";
  swatchimg.style.cursor="";
  swatchdisplay.style.cursor="";
 }
 formvar.value="0";

 element.style.backgroundPosition="0px 0px";
}

if (update==1)
 ProcessGen();
}


function SetStyleListOptHigh(element,num) {
 if (_currentstylelist==num) return;
 element.style.color="#ddd";
}
function SetStyleListOptLow(element,num) {
 if (_currentstylelist==num) return;
 element.style.color="#999";
}
function SetStyleListOptSelected(num,action) {
 // Return if clicked on most popular, currently on most popular, and most popular cache is also set
 if (num==1 && _currentstylelist==num && _top10_stylelist!="none")
  return;

 // Return if clicked on newest, currently on newest, and newest cache is also set
 if (num==2 && _currentstylelist==num && _new10_stylelist!="none")
  return;

 // Return if clicked on your styles, currently on your styles, and your stles cache is also set
 if (num==4 && _currentstylelist==num && _your_stylelist!="none")
  return;

 // Return if clicked on all time most popular, currently on all time most popular, and all time most popular cache is also set
 if (num==5 && _currentstylelist==num && _all10_stylelist!="none")
  return;

 // Note: Don't return if clicked on random and already on random

 _currentstylelist=num;
 document.getElementById('dbopt1').style.color='#999';
 document.getElementById('dbopt2').style.color='#999';
 document.getElementById('dbopt3').style.color='#999';
 document.getElementById('dbopt4').style.color='#999';
 document.getElementById('dbopt5').style.color='#999';
 document.getElementById('dbopt6').style.color='#999';
 document.getElementById('dbopt'+num).style.color='#969';

if (action==1) {
 if (num==1) LoadTop10();
 else if (num==2) LoadNew10();
 else if (num==3) SearchStyles();
 else if (num==4) LoadYourStyles();
 else if (num==5) LoadAll10();
 else if (num==6) LoadRandomStyles();
}
}

// Set login button high/low
function SetLoginButtonHigh(element) {
 element.style.backgroundPosition="-81px 0px";
}
function SetLoginButtonLow(element) {
 element.style.backgroundPosition="0px 0px";
}

// Set profile page button high/low
function SetProfilePageButtonHigh(element) {
 element.style.backgroundPosition="-330px 0px";
}
function SetProfilePageButtonLow(element) {
 element.style.backgroundPosition="-220px 0px";
}

// Set save/search style buttons high/low
function SetSaveStyleButtonHigh(element) {
 element.style.backgroundPosition="-110px 0px";
}
function SetSaveStyleButtonLow(element) {
 element.style.backgroundPosition="0px 0px";
}

function SetStyleResultHigh(id) {
 if (_is_mobile==1 || _is_tablet==1) 
  return;

 document.getElementById("loadedstyle-"+id).style.color='#fff';
 document.getElementById("stylestats-"+id).style.backgroundPosition='-91px 0px';

// element.style.color='#fff';
// element.style.opacity=1;
// element.style.filter='alpha(opacity=100)';
}
function SetStyleResultLow(id) {
 document.getElementById("loadedstyle-"+id).style.color='#bbb';
 document.getElementById("stylestats-"+id).style.backgroundPosition='0px 0px';

// element.style.color='#bbb';
// element.style.opacity=.90;
// element.style.filter='alpha(opacity=90)';
}

function SetStyleResultTouch(id) {
if (_is_mobile==1 || _is_tablet==1) {
 // Same highlight action as SetStyleResultHigh
 document.getElementById("loadedstyle-"+id).style.color='#fff';
 document.getElementById("stylestats-"+id).style.backgroundPosition='-91px 0px';

// setTimeout(function() { SetStyleResultLow(id); },280);
 setTimeout(function() { SetStyleResultLow(id); },320);
}
}

function SetSearchboxButtonHigh(element) {
if (_is_mobile==1 || _is_tablet==1) return;
 element.style.backgroundPosition="-66px 0px";
}
function SetSearchboxButtonLow(element) {
 element.style.backgroundPosition="0px 0px";
}
function SetSearchboxButtonSelected(element) {
if (_is_mobile==1 || _is_tablet==1) {
 element.style.backgroundPosition="-66px 0px";
 setTimeout(function() { SetSearchboxButtonLow(element); },500);
}
SetStyleListOptSelected(3,1);
}

// Set create/download buttons script
function SetCreateButtonHigh(element) {
 if (_is_mobile==1 || _is_tablet==1) 
  return;

 element.style.backgroundPosition="-110px 0px";
}
function SetCreateButtonLow(element) {
 element.style.backgroundPosition="0px 0px";
}

function SetCreateSelected(element) {
if (_is_mobile==1 || _is_tablet==1) {
 element.style.backgroundPosition="-110px 0px";
 setTimeout(function() { SetCreateButtonLow(element); },500);
}
ProcessGen();
}

function SetTxproButtonHigh(element) {
 if (_is_mobile==1 || _is_tablet==1) 
  return;

 element.style.backgroundPosition="-110px 0px";
}
function SetTxproButtonLow(element) {
 element.style.backgroundPosition="0px 0px";
}

function SetDownloadButtonHigh(element) {
if (_extrabuttons_enabled==0) return;
if (_is_mobile==1 || _is_tablet==1) return;
 element.style.backgroundPosition="-136px 0px";
}
function SetDownloadButtonLow(element) {
if (_extrabuttons_enabled==0) return;
 element.style.backgroundPosition="0px 0px";
}

function SetExtraButtonHigh(element) {
if (_extrabuttons_enabled==0) return;
if (_is_mobile==1 || _is_tablet==1) return;
 element.style.backgroundPosition="-99px 0px";
}
function SetExtraButtonLow(element) {
if (_extrabuttons_enabled==0) return;
 element.style.backgroundPosition="0px 0px";
}

function SetDownloadSelected(element) {
if (_extrabuttons_enabled==0) return;

if (_is_mobile==1 || _is_tablet==1) {
 element.style.backgroundPosition="-136px 0px";
 setTimeout(function() { SetDownloadButtonLow(element); },500);

 // Special action for iOS
 if (_is_ios==1) {
  document.getElementById('modal-progress').style.display="";
  download_url="/download-modal.php?image="+_datadir+"/"+_filename+".png";
  Ajax[0].Request(download_url, DownloadModalCallback);
  return;
 }

}
//document.getElementById('download_fields').submit();
// Edit: Go to download page on non-iOS
GetDownload();
}

function SetUploadSelected(element) {
if (_is_mobile==1 || _is_tablet==1) {
 element.style.backgroundPosition="-99px 0px";
 setTimeout(function() { SetExtraButtonLow(element); },500);
}
GetCodes();
}

function SetViewSelected(element) {
if (_is_mobile==1 || _is_tablet==1) {
 element.style.backgroundPosition="-99px 0px";
 setTimeout(function() { SetExtraButtonLow(element); },500);
}
bgPreview();
}


function SetSizeAdHigh(element) {
 element.style.backgroundPosition="-263px 0px";

 var text_element;
 text_element=document.getElementById('textsize-ad');
 text_element.style.backgroundPosition="0px -22px";
}
function SetSizeAdLow(element) {
 element.style.backgroundPosition="0px 0px";

 var text_element;
 text_element=document.getElementById('textsize-ad');
 text_element.style.backgroundPosition="0px 0px";
}

function SetSizeAdSelected(element) {
 SetSizeAdHigh(element);
 setTimeout(function() { SetSizeAdLow(element); },320);
}

function SetTxproAdHigh(element) {
 element.style.backgroundPosition="0px -52px";
}
function SetTxproAdLow(element) {
 element.style.backgroundPosition="0px 0px";
}
function SetTxproAdSelected(element) {
 //SetSizeAdHigh(element);
 setTimeout(function() { SetTxproAdLow(element); },320);
}

// Set Size script
function SetSizeHigh(element,size) {
 if (_currentsize==size) return;
 element.style.backgroundPosition="-86px 0px";

 // Highlight the text by moving background position x component
 var text_element,x_pos,y_pos;
 text_element=document.getElementById('textsize-'+size);

 // We need to preserve the old y position, so extract it from the current value using split()
 x_pos="-50px";
 y_pos=text_element.style.backgroundPosition.split(' ')[1];
 text_element.style.backgroundPosition=x_pos+" "+y_pos;
}
function SetSizeLow(element,size) {
 if (_currentsize==size) return;
 element.style.backgroundPosition="0px 0px";

 // Un-highlight the text by resetting background position x component
 var text_element,x_pos,y_pos;
 text_element=document.getElementById('textsize-'+size);

 // We need to preserve the old y position, so extract it from the current value using split()
 x_pos="0px";
 y_pos=text_element.style.backgroundPosition.split(' ')[1];
 text_element.style.backgroundPosition=x_pos+" "+y_pos;
}
function SetSizeSelected(size,update) {
// if (_currentsize==size) return;
StyleChangeSet();

// If we try to set a larger size when using a non-pro account, limit it to the largest
// non-pro size. This can happen when loading style settings for example.
if ((size=="x3" || size=="x4" || size=="x5") && _proaccount!=1)
 size="x2";

// Get the relevant button from the size value
var element,sizecat,oldsizecat;

switch(size) {
case "t": element=document.getElementById('sizebutton-t'); sizecat=1; break;
case "s": element=document.getElementById('sizebutton-s'); sizecat=2; break;
case "m": element=document.getElementById('sizebutton-m'); sizecat=3; break;
case "l": element=document.getElementById('sizebutton-l'); sizecat=4; break;
case "x": element=document.getElementById('sizebutton-x'); sizecat=5; break;
case "x2": element=document.getElementById('sizebutton-x2'); sizecat=6; break;
case "x3": element=document.getElementById('sizebutton-x3'); sizecat=7; break;
case "x4": element=document.getElementById('sizebutton-x4'); sizecat=8; break;
case "x5": element=document.getElementById('sizebutton-x5'); sizecat=9; break;
}
 _currentsizebutton.style.backgroundPosition="0px 0px";
 element.style.backgroundPosition="-172px 0px";
 _currentsize=size;
 _currentsizebutton=element;

switch(_multiline) {
 case 0:
 case 1:
  oldsize=_genfields.font_size.value;
  _genfields.font_size.value=size;
  break;
 case 2:
  oldsize=_genfields.font_size2.value;
  _genfields.font_size2.value=size;
  break;
 case 3:
  oldsize=_genfields.font_size3.value;
  _genfields.font_size3.value=size;
  break;
}

// Count "tiny" and "mini" and "small" as the same size so we don't get large border 
// size jumps when going from tiny to extra for example
switch(oldsize) {
case "t": oldsizecat=3; break;
case "s": oldsizecat=3; break;
case "m": oldsizecat=3; break;
case "l": oldsizecat=4; break;
case "x": oldsizecat=5; break;
case "x2": oldsizecat=6; break;
case "x3": oldsizecat=7; break;
case "x4": oldsizecat=8; break;
case "x5": oldsizecat=9; break;
}

// If border scale is set, we also want to update the border size when changing text size
// How to do this...
// First we need to convert the current size and old size into numeric categories, sizecat and oldsizecat
//
// Now, if the size cat increases by 1, increase the border size by 1 category also
//
// In all cases, if the increase or decrease of border size would make the border size go out of bounds of available
// sizes, then limit it to the max. or min. border size respectively. 
//
// EDIT: Only do this when update is already active
if (_borderscale==1 && sizecat!=oldsizecat && update==1) {
 sizediff=sizecat-oldsizecat;

 // Get the current border size
switch(_multiline) {
 case 0:
 case 1:
  oldbordersize=_genfields.border_size.value;
  break;
 case 2:
  oldbordersize=_genfields.border_size2.value;
  break;
 case 3:
  oldbordersize=_genfields.border_size3.value;
  break;
}

// We have the border size, but we need to convert it into a "category" also
switch(oldbordersize) {
 case "1": oldbordersizecat=1; break;
 case "2": oldbordersizecat=2; break;
 case "3": oldbordersizecat=3; break;
 case "5": oldbordersizecat=4; break;
 case "8": oldbordersizecat=5; break;
 case "13": oldbordersizecat=6; break;
 case "18": oldbordersizecat=7; break;
 case "24": oldbordersizecat=8; break;
}

// alert("text size difference is "+sizediff+", old border size is "+oldbordersize+", old border size cat is "+oldbordersizecat);

// Only make adjustments if current border is greater than 1 (i.e. "none")
if (oldbordersizecat!=1) {

 // Update the border size
 bordersizecat=oldbordersizecat+sizediff;

 // Have we gone beyond border limits?
 if (bordersizecat<2)
  bordersizecat=2; // We don't want to set it to "none"

 if (bordersizecat>5 && _proaccount!=1)
  bordersizecat=5;
 else if (bordersizecat>8 && _proaccount==1)
  bordersizecat=8;

// alert("new border size cat is "+bordersizecat);
// alert("_proaccount is "+_proaccount);

 // Convert the new bordersizecat back to the non-category border size value
 switch(bordersizecat) {
  case 1: newbordersize="1"; break;
  case 2: newbordersize="2"; break;
  case 3: newbordersize="3"; break;
  case 4: newbordersize="5"; break;
  case 5: newbordersize="8"; break;
  case 6: newbordersize="13"; break;
  case 7: newbordersize="18"; break;
  case 8: newbordersize="24"; break;
 }

 // Set the new border size
 SetBorderSelected(newbordersize,0);
/*
 switch(_multiline) {
  case 0:
  case 1:
   break;
  case 2:
   break;
  case 3:
   break;
 }
*/

 // Force update
 //update=1;
 } 
}

if (update==1)
 ProcessGen();
}


// Set Glow script
function SetGlowHigh(element,glow) {
 if (_currentglow=="0" ||_currentglow==glow) return;
 element.style.backgroundPosition="-52px 0px";
}
function SetGlowLow(element,glow) {
 if (_currentglow=="0" ||_currentglow==glow) return;
 element.style.backgroundPosition="0px 0px";
}
function SetGlowSelected(element,glow) {
var swatchimg,swatchdisplay;
 if (_currentglow=="0" || _currentglow==glow) return;

 _currentglowbutton.style.backgroundPosition="0px 0px";
 element.style.backgroundPosition="-104px 0px";
 _currentglow=glow;
 _oldglowon=glow; 
 _currentglowbutton=element;
 document.getElementById('glow_halo').value=glow;

 // Highlight the colour swatch again if now in glow mode 3
 swatchimg=document.getElementById('color0_img');
 swatchdisplay=document.getElementById('color0_display');
 if (_currentglow=="3") {
  swatchimg.src="https://static1.textcraft.net/img/colorpick/color_select_icon2a.png";
  swatchimg.style.cursor="pointer";
  swatchdisplay.style.cursor="pointer";
 }
 else {
  swatchimg.src="https://static1.textcraft.net/img/colorpick/color_select_icon2a-dark.png";
  swatchimg.style.cursor="";
  swatchdisplay.style.cursor="";
 }

// ProcessGen();
}

// Set Glossy script
function SetGlossyHigh(element,glossy) {
 if (_currentglossy=="0" ||_currentglossy==glossy) return;
 element.style.backgroundPosition="-32px 0px";
}
function SetGlossyLow(element,glossy) {
 if (_currentglossy=="0" ||_currentglossy==glossy) return;
 element.style.backgroundPosition="0px 0px";
}
function SetGlossySelected(element,glossy) {
 if (_currentglossy=="0" || _currentglossy==glossy) return;

 _currentglossybutton.style.backgroundPosition="0px 0px";
 element.style.backgroundPosition="-64px 0px";
 _currentglossy=glossy;
 _oldglossyon=glossy; 
 _currentglossybutton=element;
 document.getElementById('glossy').value=glossy;

// ProcessGen();
}

// Set Light script
function SetLightHigh(element,light) {
 if (_currentlight=="0" ||_currentlight==light) return;
 element.style.backgroundPosition="-32px 0px";
}
function SetLightLow(element,light) {
 if (_currentlight=="0" ||_currentlight==light) return;
 element.style.backgroundPosition="0px 0px";
}
function SetLightSelected(element,light) {
 if (_currentlight=="0" || _currentlight==light) return;

 _currentlightbutton.style.backgroundPosition="0px 0px";
 element.style.backgroundPosition="-64px 0px";
 _currentlight=light;
 _oldlighton=light; 
 _currentlightbutton=element;
 document.getElementById('lighting').value=light;

// ProcessGen();
}

// Set Border script
function SetBorderHigh(element,border) {
 if (_currentborder==border) return;
 element.style.backgroundPosition="-344px 0px";
// element.style.backgroundPosition="-86px 0px";

 // Highlight the text by moving background position x component
 var text_element,x_pos,y_pos;
 text_element=document.getElementById('bordersize-'+border);

 // We need to preserve the old y position, so extract it from the current value using split()
 x_pos="-50px";
 y_pos=text_element.style.backgroundPosition.split(' ')[1];
 text_element.style.backgroundPosition=x_pos+" "+y_pos;
}
function SetBorderLow(element,border) {
 if (_currentborder==border) return;
 element.style.backgroundPosition="-258px 0px";
// element.style.backgroundPosition="0px 0px";

 // Un-highlight the text by resetting background position x component
 var text_element,x_pos,y_pos;
 text_element=document.getElementById('bordersize-'+border);

 // We need to preserve the old y position, so extract it from the current value using split()
 x_pos="0px";
 y_pos=text_element.style.backgroundPosition.split(' ')[1];
 text_element.style.backgroundPosition=x_pos+" "+y_pos;
}

function SetBorderSelected(border,update) {
var element,swatchimg,swatchdisplay;

//alert("SetBorder Selected "+border);
// if (_currentborder==border) return;
StyleChangeSet();

// If we try to set a larger size when using a non-pro account, limit it to the largest
// non-pro size. This can happen when loading style settings for example.
if ((border=="13" || border=="18" || border=="24") && _proaccount!=1)
 border="8";

//alert ("border selected is "+border);
// Get the relevant button from the border value
switch(border) {
case "1": element=document.getElementById('borderbutton-1'); break;
case "2": element=document.getElementById('borderbutton-2'); break;
case "3": element=document.getElementById('borderbutton-3'); break;
case "5": element=document.getElementById('borderbutton-5'); break;
case "8": element=document.getElementById('borderbutton-8'); break;
case "13": element=document.getElementById('borderbutton-13'); break;
case "18": element=document.getElementById('borderbutton-18'); break;
case "24": element=document.getElementById('borderbutton-24'); break;
//case "5": element=document.getElementById('borderbutton-5'); break;
}

 _currentborderbutton.style.backgroundPosition="-258px 0px";
 element.style.backgroundPosition="-430px 0px";
/*
 _currentborderbutton.style.backgroundPosition="0px 0px";
 element.style.backgroundPosition="-258px 0px";
*/
 _currentborder=border;
 _currentborderbutton=element;

switch(_multiline) {
 case 0:
  swatchimg=document.getElementById('color1_img');
  swatchdisplay=document.getElementById('color1_display');
  _genfields.border_size.value=border;
  break;
 case 1:
  swatchimg=document.getElementById('color1_img');
  swatchdisplay=document.getElementById('color1_display');
  _genfields.border_size.value=border;
  break;
 case 2:
  swatchimg=document.getElementById('color2_img');
  swatchdisplay=document.getElementById('color2_display');
  _genfields.border_size2.value=border;
  break;
 case 3:
  swatchimg=document.getElementById('color3_img');
  swatchdisplay=document.getElementById('color3_display');
  _genfields.border_size3.value=border;
  break;
}
 // Highlight or grey out relevant colour swatch
 if(border=="0") {
/*
  // Edit: Leave border colour swatches on
  swatchimg.src="https://static1.textcraft.net/img/colorpick/color_select_icon2a-dark.png";
  swatchimg.style.cursor="";
  swatchdisplay.style.cursor="";
*/
 }
 else {
  swatchimg.src="https://static1.textcraft.net/img/colorpick/color_select_icon2a.png";
  swatchimg.style.cursor="pointer";
  swatchdisplay.style.cursor="pointer";
 }


if (update==1)
 ProcessGen();
}

function UpdateMultiDisplay(line, focus) {
if (focus==1)
 ClearYourtext();

if (_multiline==0) {
 _multilinesel.style.backgroundPosition="0px 0px";
/*
 _yourtextbg.style.backgroundPosition="0px 0px";
 _yourtext2bg.style.backgroundPosition="-225px 0px";
 _yourtext3bg.style.backgroundPosition="-225px 0px";
 _yourtext.style.backgroundColor="#ccc";
 _yourtext2.style.backgroundColor="#8a8a8a";
 _yourtext3.style.backgroundColor="#8a8a8a";
*/
 document.getElementById('colorswatch1').style.display="";
 document.getElementById('colorswatch2').style.display="none";
 document.getElementById('colorswatch3').style.display="none";
 _multilinepagenum.innerHTML="";

 // We want to update the input box background highlight even when multiline is off
 switch(line) {
  case 1:
   _yourtextbg.style.backgroundPosition="0px 0px";
   _yourtext2bg.style.backgroundPosition="-226px 0px";
   _yourtext3bg.style.backgroundPosition="-226px 0px";
   _yourtext.style.backgroundColor="#ccc";
   _yourtext2.style.backgroundColor="#8a8a8a";
   _yourtext3.style.backgroundColor="#8a8a8a";
   _yourtext.style.borderColor="#ccc";
   _yourtext2.style.borderColor="#8a8a8a";
   _yourtext3.style.borderColor="#8a8a8a";
  break;
  case 2:
   _yourtextbg.style.backgroundPosition="-341px 0px";
   _yourtext2bg.style.backgroundPosition="0px 0px";
   _yourtext3bg.style.backgroundPosition="-226px 0px";
   _yourtext.style.backgroundColor="#8a8a8a";
   _yourtext2.style.backgroundColor="#ccc";
   _yourtext3.style.backgroundColor="#8a8a8a";
   _yourtext.style.borderColor="#8a8a8a";
   _yourtext2.style.borderColor="#ccc";
   _yourtext3.style.borderColor="#8a8a8a";
  break;
  case 3:
   _yourtextbg.style.backgroundPosition="-341px 0px";
   _yourtext2bg.style.backgroundPosition="-226px 0px";
   _yourtext3bg.style.backgroundPosition="0px 0px";
   _yourtext.style.backgroundColor="#8a8a8a";
   _yourtext2.style.backgroundColor="#8a8a8a";
   _yourtext3.style.backgroundColor="#ccc";
   _yourtext.style.borderColor="#8a8a8a";
   _yourtext2.style.borderColor="#8a8a8a";
   _yourtext3.style.borderColor="#ccc";
  break;
 }
} else {
//document.write("updatemulti2..");
_multiline=line;

// When switching from line to line, we need to update line selection graphic,
// and switch between 3 versions of:
// font size button
// border size button
// border colour swatch
// font style selection
// font colour selection & page
//
// Don't update the text whle switching between lines.
switch(_multiline) {
case 1:
// _multilinesel.style.backgroundPosition="-14px 0px";
 _multilinesel.style.backgroundPosition="-15px 0px";
 _yourtextbg.style.backgroundPosition="0px 0px";
 _yourtext2bg.style.backgroundPosition="-226px 0px";
 _yourtext3bg.style.backgroundPosition="-226px 0px";
 _yourtext.style.backgroundColor="#ccc";
 _yourtext2.style.backgroundColor="#8a8a8a";
 _yourtext3.style.backgroundColor="#8a8a8a";
 _yourtext.style.borderColor="#ccc";
 _yourtext2.style.borderColor="#8a8a8a";
 _yourtext3.style.borderColor="#8a8a8a";
 _curcolourpage=_genfields.font_page.value;
 SetSizeSelected(_genfields.font_size.value,0);
 SetBorderSelected(_genfields.border_size.value,0);
 SetFontStyle2(_genfields.font_style.value,0);
 SelectFontColour(_genfields.font_colour.value,0);
 document.getElementById('colorswatch1').style.display="";
 document.getElementById('colorswatch2').style.display="none";
 document.getElementById('colorswatch3').style.display="none";
 _multilinepagenum.innerHTML="1";
break;
case 2:
// _multilinesel.style.backgroundPosition="-28px 0px";
 _multilinesel.style.backgroundPosition="-30px 0px";
 _yourtextbg.style.backgroundPosition="-341px 0px";
 _yourtext2bg.style.backgroundPosition="0px 0px";
 _yourtext3bg.style.backgroundPosition="-226px 0px";
 _yourtext.style.backgroundColor="#8a8a8a";
 _yourtext2.style.backgroundColor="#ccc";
 _yourtext3.style.backgroundColor="#8a8a8a";
 _yourtext.style.borderColor="#8a8a8a";
 _yourtext2.style.borderColor="#ccc";
 _yourtext3.style.borderColor="#8a8a8a";
 _curcolourpage2=_genfields.font_page2.value;
 SetSizeSelected(_genfields.font_size2.value,0);
 SetBorderSelected(_genfields.border_size2.value,0);
 SetFontStyle2(_genfields.font_style2.value,0);
 SelectFontColour(_genfields.font_colour2.value,0);
 document.getElementById('colorswatch1').style.display="none";
 document.getElementById('colorswatch2').style.display="";
 document.getElementById('colorswatch3').style.display="none";
 _multilinepagenum.innerHTML="2";
break;
case 3:
// _multilinesel.style.backgroundPosition="-42px 0px";
 _multilinesel.style.backgroundPosition="-45px 0px";
 _yourtextbg.style.backgroundPosition="-341px 0px";
 _yourtext2bg.style.backgroundPosition="-226px 0px";
 _yourtext3bg.style.backgroundPosition="0px 0px";
 _yourtext.style.backgroundColor="#8a8a8a";
 _yourtext2.style.backgroundColor="#8a8a8a";
 _yourtext3.style.backgroundColor="#ccc";
 _yourtext.style.borderColor="#8a8a8a";
 _yourtext2.style.borderColor="#8a8a8a";
 _yourtext3.style.borderColor="#ccc";
 _curcolourpage3=_genfields.font_page3.value;
 SetSizeSelected(_genfields.font_size3.value,0);
 SetBorderSelected(_genfields.border_size3.value,0);
 SetFontStyle2(_genfields.font_style3.value,0);
 SelectFontColour(_genfields.font_colour3.value,0);
 document.getElementById('colorswatch1').style.display="none";
 document.getElementById('colorswatch2').style.display="none";
 document.getElementById('colorswatch3').style.display="";
 _multilinepagenum.innerHTML="3";
break;
}

}

}

// Set Multi-line selection script
function SetMultiButtonHigh(element) {
 if (_multiline>0)
  element.style.backgroundPosition="-168px 0px";
 else
  element.style.backgroundPosition="-56px 0px";
}
function SetMultiButtonLow(element) {
 if (_multiline>0)
  element.style.backgroundPosition="-112px 0px";
 else
  element.style.backgroundPosition="0px 0px";
}
function SetMultiSelected(element) {
 if (_multiline>0) {

  // Set style back to that of first line before turning it off
  if (_multiline>1) 
   UpdateMultiDisplay(1);

  // Ok, back to normal, we can switch it off now
  element.style.backgroundPosition="0px 0px";
  _multiline=0;
  UpdateMultiDisplay();
 } else {
  element.style.backgroundPosition="-112px 0px";
  _multiline=1;
  UpdateMultiDisplay(1);
}
 // Update if there's text in lines 2 or 3
 if (_genfields.yourtext2.value.length>0 || _genfields.yourtext3.value.length>0)
  ProcessGen();

}

// Set border scaling button
function SetBorderscaleButtonHigh(element) {
 if (_borderscale>0) return;
 element.style.backgroundPosition="-56px 0px";
}
function SetBorderscaleButtonLow(element) {
 if (_borderscale>0) return;
 element.style.backgroundPosition="0px 0px";
}
function SetBorderscaleSelected() {
 if (_proaccount!=1) return;

 bs_button=document.getElementById('borderscalebutton');

 // Turning on or off borderscale, don't need to do anything special
 // border scale logic is applied at SetSizeSelected()
 if (_borderscale>0) {
  bs_button.style.backgroundPosition="0px 0px";
  _borderscale=0;
 } else {
  bs_button.style.backgroundPosition="-112px 0px";
  _borderscale=1;
 }

 // Save button state in HTML5 local storage
 lsSet("borderscale",_borderscale);

}

// Set font colour page arrows
function SetArrowHigh(element,pos) {
 if (_is_mobile==1 || _is_tablet==1) 
  return;

 element.style.backgroundPosition="-45px 0px";
}
function SetArrowLow(element,pos) {
 element.style.backgroundPosition="0px 0px";
}
function SetArrow(element,pos) {
var curstyle,numpanels;

if (_is_mobile==1 || _is_tablet==1) {
 element.style.backgroundPosition="-45px 0px";
// setTimeout(function() { SetArrowLow(element,pos); },500);
 setTimeout(function() { SetArrowLow(element,pos); },280);
}

switch(_multiline) {
 case 0:
 case 1:
  curstyle=_genfields.font_style.value;
  numpanels=parseInt(_numcolours[curstyle]/16);
  if (parseInt(_numcolours[curstyle]%16)==0) numpanels--;

  if (pos=="left") {
   _curcolourpage--;
   if (_curcolourpage==-1)
    _curcolourpage=numpanels; // last page of colours for theis font style
  } else {
   _curcolourpage++;
   // have we gone past the last page for this font style?
   if (_curcolourpage==numpanels+1) 
    _curcolourpage=0;
  }
  break;
 case 2:
  curstyle=_genfields.font_style2.value;
  numpanels=parseInt(_numcolours[curstyle]/16);
  if (parseInt(_numcolours[curstyle]%16)==0) numpanels--;

  if (pos=="left") {
   _curcolourpage2--;
   if (_curcolourpage2==-1)
    _curcolourpage2=numpanels; // last page of colours for theis font style
  } else {
   _curcolourpage2++;
   // have we gone past the last page for this font style?
   if (_curcolourpage2==numpanels+1) 
    _curcolourpage2=0;
  }
  break;
 case 3:
  curstyle=_genfields.font_style3.value;
  numpanels=parseInt(_numcolours[curstyle]/16);
  if (parseInt(_numcolours[curstyle]%16)==0) numpanels--;

  if (pos=="left") {
   _curcolourpage3--;
   if (_curcolourpage3==-1)
    _curcolourpage3=numpanels; // last page of colours for theis font style
  } else {
  _curcolourpage3++;
   //have we gone past the last page for this font style?
   if (_curcolourpage3==numpanels+1) 
    _curcolourpage3=0;
  }
  break;
}
/*
alert("curstyle is "+curstyle);
alert("_numcolours[curstyle] is "+_numcolours[curstyle]);
*/

// Update the display
updateFontColour();
}

function SelectFontColour(num,update) {
var fc,oldfc;
var new_x1,new_y1;
//oldfcnum=_genfields.font_colour.value;

//alert("SelectFontColour "+num);

//alert("num is "+num+", oldfcnum is "+oldfcnum);

// Check if we are clicking on current selected and on same page
if (num==_currentfcnum) {
switch(_multiline) {
 case 0:
 case 1:
//  if (num==_currentfcnum && _genfields.font_page.value==_curcolourpage) return;
  if (_genfields.font_page.value==_curcolourpage) return;
  break;
 case 2:
  if (_genfields.font_page2.value==_curcolourpage2) return;
  break;
 case 3:
  if (_genfields.font_page3.value==_curcolourpage3) return;
  break;
}
}
//alert("continues");
StyleChangeSet();

// Make sure the selection overlay is visible
_charsel.style.display="";

fc=_fontcol[num];
oldfc=_fontcol[_currentfcnum];


switch(_multiline) {
 case 0:
 case 1:
  _genfields.font_colour.value=num;
  _genfields.font_page.value=_curcolourpage;
  break;
 case 2:
  _genfields.font_colour2.value=num;
  _genfields.font_page2.value=_curcolourpage2;
  break;
 case 3:
  _genfields.font_colour3.value=num;
  _genfields.font_page3.value=_curcolourpage3;
  break;
}

// Update the font colour selection icon position
new_x1=(parseInt((num%16)%8)*55)-3;
new_y1=parseInt((num%16)/8)*56;

_charsel.style.left=new_x1+"px";
_charsel.style.top=new_y1+"px";

/*
oldfc.style.border="0px solid #000";
//oldfc.style.borderBottom="1px solid #000";

//fc.style.borderTop="2px solid #fff";
fc.style.border="2px solid #a7c";
//fc.style.borderBottom="1px solid #b6b";
*/

_currentfcnum=num;

if (update==1)
 ProcessGen();
}

function setFitDisplay(val) {
var newmargin,newwidth;

if (_fittowidth_slider==null) return;
//alert("setfitdisplay");
// Calc the new margin and width of the slider based on the value supplied
// Default left margin is 459
newmargin=459-(val/2);
newwidth=val;
_currentfit=val;
_fittowidth1.style.marginLeft=newmargin+"px";
_fittowidth2.style.width=newwidth+"px";

//_fittowidth_slider.style.display="";
_fittowidth_slider.style.visibility="visible";

// No timeout if mouse button is still held down
if (slider_mouseDownStatus==1) {
// alert("mouse still down");
 return;
}
//alert("init clear fitdisplay");

// Mouse is now up. Clear any previous timeout
if (_fitdisplay_countdown) 
 clearTimeout(_fitdisplay_countdown);

//_fitdisplay_countdown=setTimeout("ClearFitDisplay();",750);
_fitdisplay_countdown=setTimeout("ClearFitDisplay();",1250);
}

function ClearFitDisplay() {
// _fittowidth_slider.style.display="none";
 _fittowidth_slider.style.visibility="hidden";
}


function SetUsernameFocus() {
  // Set the focus to username input if no loginname present, otherwise set focus to password input
 if (_loginname=="")
  document.getElementById('username').focus();
 else
  document.getElementById('password').focus();
}

function LoginModalCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  var response = Ajax[0].request.responseText;

 //document.getElementById('modal-progress').style.display="none";

 SetContainerOpacity();

 var left_pos=593+_container.offsetLeft;

 // Absolute positioning relative to top of screen is increased if we're showing a banner ad at the top
 if (_showad==1)
  TINY.box.show({html:response,top:155,left:left_pos,fixed:false,animate:false,mask:false,boxid:'modalframe',openjs:function(){SetUsernameFocus();},closejs:function(){ClearContainerOpacity();}});
 else
  TINY.box.show({html:response,top:65,left:left_pos,fixed:false,animate:false,mask:false,boxid:'modalframe',openjs:function(){SetUsernameFocus();},closejs:function(){ClearContainerOpacity();}});
 }
}

// Display the login modal box, perhaps with a pre-supplied loginname
function DisplayLogin(loginname) {
//alert(_finished_csinit+","+_loginboxcached);
 // Return if not finished init
 if (_finished_csinit!=1 || _loginboxcached==1) return;

 //document.getElementById('modal-progress').style.display="";
 if (typeof loginname==='undefined') {
  login_url="/login-front.php";
  _loginname="";
 }
 else {
  login_url="/login-front.php?login="+encodeURIComponent(loginname);
  _loginname=loginname;
 }

 // Cache is ready, display the cached HTML
 if (_loginboxcached==2) {
  SetContainerOpacity();
  var left_pos=593+_container.offsetLeft;

  // Absolute positioning relative to top of screen is increased if we're showing a banner ad at the top
  if (_showad==1)
   TINY.box.show({html:_loginboxHTML,top:155,left:left_pos,fixed:false,animate:false,mask:false,boxid:'modalframe',openjs:function(){SetUsernameFocus();},closejs:function(){ClearContainerOpacity();}});
  else
   TINY.box.show({html:_loginboxHTML,top:65,left:left_pos,fixed:false,animate:false,mask:false,boxid:'modalframe',openjs:function(){SetUsernameFocus();},closejs:function(){ClearContainerOpacity();}});

  _loginboxcached=0;
 } else
  Ajax[0].Request(login_url, LoginModalCallback);
}

function CacheLogin() {
  login_url="/login-front.php";
  Ajax[0].Request(login_url, CacheLoginModalCallback);
}

function CacheLoginModalCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  var response = Ajax[0].request.responseText;

  _loginboxHTML=response;
  _loginboxcached=2; // Indicate that cached response is ready
 }
}


// Handle login via Ajax POST
function LoginStatusCallback() {
/*
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  var response = Ajax[0].request.responseText;
alert("Login process response was: "+response);
 }
*/
 if(AjaxPost.CheckReadyState(AjaxPost.request))
 {
  var response = AjaxPost.request.responseText;
  var status_text="";
  var status_colour="#bbb";
  var status_html="";

//alert("Login process response was: "+response);

  // Handle login response
  switch(response) {
   case "ok":
    status_text="Login OK";
    status_colour="#30ff30";
    //LoginSuccess();
    _firstlogin=0;
    setTimeout("LoginSuccess();",1000);
   break;
   case "ok-first":
    status_text="Login OK";
    status_colour="#30ff30";
    //LoginSuccess();
    _firstlogin=1;
    setTimeout("LoginSuccess();",1000);
   break;
   case "ok-pro":
    status_text="Login OK";
    status_colour="#30ff30";
    //LoginSuccess();
    _proaccount=1;
    _firstlogin=0;
    setTimeout("LoginSuccess();",1000);
   break;
   case "login-error":
    status_text="Login failed, try again";
    status_colour="#ff3030";

    // Reload the captcha box for new captcha
    if (window.frames["captchaframe"])
     document.getElementById('captchaframe').contentWindow.location.reload();
   break;
   case "start-captcha":
//    status_text="Login failed, please try again";
    status_text="Login failed - start captcha";
    status_colour="#ff3030";

    // Display captcha box
    DisplayCaptchaBox();
   break;
   case "captcha-error":
    status_text="Captcha failed, try again";
    status_colour="#ff3030";

    // Reload the captcha box for new captcha
    if (window.frames["captchaframe"])
     document.getElementById('captchaframe').contentWindow.location.reload();
   break;
   case "not-activated":
    status_text="Not activated yet - <a href='/resend-activation.php' style='color:#ff50a0'>resend email?</a>";
    status_colour="#ff3080";
   break;
   case "password-change":
    status_text="Password change";
    window.location="/password_change.php";
   break;
   default:
   break;
  }
  status_html="<span style='color:"+status_colour;
  status_html+="'>";
  status_html+=status_text;
  status_html+="</span>";
  document.getElementById('login-status').innerHTML=status_html;

 }
}

function ClearLoginStatus() {
  document.getElementById('login-status').innerHTML="";
}

function ProcessLogin() {
var login_process_url, login_process_params, l_username, l_password, l_remember;

 login_process_url="/getaccess.php";
 l_username=document.getElementById('login_form').username.value;
 l_password=document.getElementById('login_form').password.value;
 l_remember=document.getElementById('login_form').remember.checked;

 login_process_params = 'username='+encodeURIComponent(l_username);
 login_process_params += '&password='+encodeURIComponent(l_password);
 login_process_params += '&remember='+l_remember;

 // If captcha iframe is present...
 if (window.frames["captchaframe"]) {
  l_captcha_challenge=window.frames["captchaframe"].document.getElementById('recaptcha_challenge_field').value;
  l_captcha_response=window.frames["captchaframe"].document.getElementById('recaptcha_response_field').value;
  login_process_params += '&recaptcha_challenge_field='+encodeURIComponent(l_captcha_challenge);
  login_process_params += '&recaptcha_response_field='+encodeURIComponent(l_captcha_response);
 }
//alert(login_process_params);
 AjaxPost.Request(login_process_url, login_process_params, LoginStatusCallback);
// Ajax[0].Request(login_process_url, LoginStatusCallback);
}
/*
function CaptchaBoxCallback() {
 if(Ajax[0].CheckReadyState(Ajax[0].request))
 {
  var response = Ajax[0].request.responseText;

  // We need to manually increase the height of the modal box when adding content to it
  document.getElementById('modalframe').style.height="408px";
  document.getElementById('captcha-box').innerHTML=response;
 }
}
*/

function DisplayCaptchaBox() {
/*
var captcha_url;

 captcha_url="/captcha-front.php";
 Ajax[0].Request(captcha_url, CaptchaBoxCallback);
*/


 output="<iframe src='/captcha-front.php' width='325' height='140' name='captchaframe' id='captchaframe' frameborder='0' scrolling='no'></iframe>";
 document.getElementById('captcha-box').innerHTML=output;

 // We need to manually increase the height of the modal box when adding content to it
 document.getElementById('modalframe').style.height="370px";

}

/*
function Logout() {
 _loggedin=0;
 _username="";
 document.getElementById('yourstyles').style.visibility="hidden";
}
*/

function ShowProLogo() {
  document.getElementById('logo-box').style.display="none";
  document.getElementById('logo-box-pro').style.display="";

  // Adjust other elements to fit
  document.getElementById('top-box').style.height="80px";
  document.getElementById('top-box').style.backgroundPosition="0px -151px";
}

function HideProLogo() {
  document.getElementById('logo-box-pro').style.display="none";
  document.getElementById('logo-box').style.display="";

  // Adjust other elements to fit
  document.getElementById('top-box').style.height="90px";
  document.getElementById('top-box').style.backgroundPosition="0px -31px";
}

function LoginSuccess() {
 _loggedin=1;
 TINY.box.hide();

 // New behaviour - just reload the entire page for pro accounts, since programmatically hiding google ads is against their ToS
 if (_proaccount==1) {
  window.location.reload(true);
  return;
 }

 // Reload the login status iframe to reflect logged in status
 document.getElementById('login-status-iframe').contentWindow.location.reload();

 // Display yourstyles
 document.getElementById('yourstyles').style.display="";

 // Display pro sizes if necessary
 if (_proaccount==1) {

  // Switch Logo
  logo_html="<img src='https://static1.textcraft.net/img/txpro-logo.png' onload=\"ShowProLogo()\">";
  document.getElementById('logo-box-pro').innerHTML=logo_html;


  // Hide ads
  //document.getElementById('leaderboard-mid').style.display="";

  // Left side controls
  document.getElementById('pro-size').style.display="";
  document.getElementById('pro-border').style.display="";
  document.getElementById('linestyle-box').style.height="473px";
  document.getElementById('linestyle-box').style.backgroundPosition="-580px 0px";
  document.getElementById('multilinepagenum').style.top="435px";

  // Right side box
  document.getElementById('input-box').style.height="727px";
  document.getElementById('input-box').style.backgroundPosition="-380px 0px";
  document.getElementById('borderscale-bg').style.display="";

  document.getElementById('download-note').style.height="42px";
  document.getElementById('largerect-main').style.marginTop="1px";

  document.getElementById('txpro-block').style.display="none";
  document.getElementById('txpro-block-pro').style.display="";

  // Enable Border scale button if it's currently off, and the local storage variable is not explicitly set to off
  ls_borderscale=-1;
  if(typeof(Storage) !== "undefined")
   ls_borderscale=localStorage.getItem("borderscale");

// alert(_borderscale+","+ls_borderscale);
  if (_borderscale==0 && ls_borderscale!=0)
   SetBorderscaleSelected();
 }

 // Load the first login info box if first login
 if (_firstlogin==1) {
  firstlogin_url="/firstlogin.php";
  //alert(firstlogin_url);
  Ajax[0].Request(firstlogin_url, FirstLoginCallback);

  _firstlogin=0;
 }
}


function checkUnicode(element, linenum) {
var result,found;
var num_unicode;
var unicode_regex=[],unicode_name=[];

// Icelandic, Igbo, Turkish, Vietnamese, Yoruba use extended latin
// Chinese and Japanese are part of the same CJK unicode range and can't be distinguished easily
// Korean AC00-D7AF and maybe 1100-11FF
// Note: We should place Korean before CJK since it's a subset of CJK range and we want to match it first if identified
// So place CJK at the end
// EDIT: Actually Hiragana and Katakana can be distinguished as Japanese (3040-30FF), so check for those as well as Korean before doing main CJK
// EDIT 2: Let's just change "CJK" to "Chinese" since we are detecting some Korean and Japanese beforehand
num_unicode=8;
unicode_name=["Arabic","Cyrillic","Greek","Hebrew","Devanagari","Japanese","Korean","Chinese"];
unicode_style=["font12","font15","font14","font17","font13","font9","font11","font10"];
unicode_regex=["[\u0600-\u06FF]","[\u0400-\u052F]","[\u0370-\u03FF]","[\u0590-\u05FF]","[\u0900-\u097F]","[\u3000-\u30FF]","[\uAC00-\uD7AF]","[\u3000-\u9FFF]"];

// First check if there is any unicode char, if not, return
result=element.value.match(/[^\u0000-\u00ff]/);

if (!result) {
 return;
}

// document.getElementById('unicode-msg').innerHTML="Found unicode";

// We have unicode, but what is it?
// Loop through the recognised language charsets
found=-1;
for(i=0;i<num_unicode;i++) {

// Check to see if it matchs current lang
regexp=new RegExp(unicode_regex[i]);
result=element.value.match(regexp);

// If we got a match then break
if (result) {
 found=i;
 break;
}

}

// If we found a match then display message and change font selection (if not already set to a supporting font)
if (found!=-1) {

// document.getElementById('unicode-msg').innerHTML="Found unicode "+i;

 // Should we change the font?
 // First get the current font for this line
// curstyle=document.getElementById('gen_fields').font_style.value;
 if (linenum==1)
  curstyle=_genfields.font_style.value;
 else if (linenum==2)
  curstyle=_genfields.font_style2.value;
 else if (linenum==3)
  curstyle=_genfields.font_style3.value;

// document.getElementById('unicode-msg').innerHTML="Checking "+curstyle+" against "+unicode_name[found].toLowerCase();

 // Does the current style support our chars? (decide by searching for the language name in the style name)
 // If so, do nothing
 if (curstyle.indexOf(unicode_style[found].toLowerCase())!=-1)
  return;

 // Ok the current style doesn't support the detect language, let's change it
 mesg="Font selection changed to "+unicode_name[found];
 document.getElementById('unicode-msg').innerHTML=mesg;

 // Change to the language name
 stylename=unicode_name[found];
 style=unicode_style[found];

// document.getElementById('gen_fields').font_style.value=style;
// updateFontColour();
 SetFontStyle2(style,0);

 mesg="Font selection changed to "+stylename;
 document.getElementById('unicode-msg').innerHTML=mesg;

 setTimeout(function(){ ClearUnicodeMsg(); }, 4000);
}

}

function ClearUnicodeMsg() {
 document.getElementById('unicode-msg').innerHTML="";
}

