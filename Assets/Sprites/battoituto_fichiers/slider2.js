// Title: tigra slider control
// Description: See the demo at url
// URL: http://www.softcomplex.com/products/tigra_slider_control/
// Version: 1.0.2 (commented source)
// Date: 08/21/2008
// Tech. Support: http://www.softcomplex.com/forum/
// Notes: This script is free. Visit official site for further details.
var slider_mouseDownStatus;
slider_mouseDownStatus=0;

function slider (a_init, a_tpl) {

	this.f_setValue  = f_sliderSetValue;
	this.f_getPos    = f_sliderGetPos;
	
	// register in the global collection	
	if (!window.A_SLIDERS)
		window.A_SLIDERS = [];
	this.n_id = window.A_SLIDERS.length;
	window.A_SLIDERS[this.n_id] = this;

	// save config parameters in the slider object
	var s_key;
	if (a_tpl)
		for (s_key in a_tpl)
			this[s_key] = a_tpl[s_key];
	for (s_key in a_init)
		this[s_key] = a_init[s_key];

	this.n_pix2value = this.n_pathLength / (this.n_maxValue - this.n_minValue);
	if (this.n_value == null)
		this.n_value = this.n_minValue;

	// generate the control's HTML
	// Stephen - added background-size styling to be the same dimensions as n_controlWidth/Height in order to accommodate 2x/retina style background images without any additional changes
/*
	document.write(
		'<div style="width:' + this.n_controlWidth + 'px;height:' + this.n_controlHeight + 'px;border:0; background-image:url(' + this.s_imgControl + ')" id="sl' + this.n_id + 'base">' +
		'<img src="' + this.s_imgSlider + '" width="' + this.n_sliderWidth + '" height="' + this.n_sliderHeight + '" border="0" style="position:relative;left:' + this.n_pathLeft + 'px;top:' + this.n_pathTop + 'px;z-index:' + this.n_zIndex + ';cursor:pointer;visibility:visible;" name="sl' + this.n_id + 'slider" id="sl' + this.n_id + 'slider" onmousedown="return f_sliderMouseDown(' + this.n_id + ')" ontouchstart="return f_sliderMouseDown(' + this.n_id + ')"/></div>'
	);
*/
	document.write(
		'<div style="width:' + this.n_controlWidth + 'px;height:' + this.n_controlHeight + 'px;border:0; background-image:url(' + this.s_imgControl + '); background-size:' + this.n_controlWidth + 'px ' + this.n_controlHeight + 'px;" id="sl' + this.n_id + 'base">' +
		'<img src="' + this.s_imgSlider + '" width="' + this.n_sliderWidth + '" height="' + this.n_sliderHeight + '" border="0" style="position:relative;left:' + this.n_pathLeft + 'px;top:' + this.n_pathTop + 'px;z-index:' + this.n_zIndex + ';cursor:pointer;visibility:visible;" name="sl' + this.n_id + 'slider" id="sl' + this.n_id + 'slider" onmousedown="return f_sliderMouseDown(' + this.n_id + ')" ontouchstart="return f_sliderMouseDown(' + this.n_id + ')"/></div>'
	);
// Making the slider control img initially invisible causes the touch events not to work on Android. Let's just keep it visible at the start.
/*
		'<img src="' + this.s_imgSlider + '" width="' + this.n_sliderWidth + '" height="' + this.n_sliderHeight + '" border="0" style="position:relative;left:' + this.n_pathLeft + 'px;top:' + this.n_pathTop + 'px;z-index:' + this.n_zIndex + ';cursor:pointer;visibility:hdidden;" name="sl' + this.n_id + 'slider" id="sl' + this.n_id + 'slider" onmousedown="return f_sliderMouseDown(' + this.n_id + ')" ontouchstart="return f_sliderMouseDown(' + this.n_id + ')"/></div>'
*/
	this.e_base   = get_element('sl' + this.n_id + 'base');
	this.e_slider = get_element('sl' + this.n_id + 'slider');
	
	// safely hook document/window events
	// Note: Mousemove and Mouseup events are attached globally, while mousedown is attached to each slider controller image
	// Edit: Let's try not to attach these listeners more than once.
	if (!window.sliderEventsAttached) {
	target=document.body;
	//target=window;
	if (target.addEventListener) {
	 target.addEventListener ("mousemove",f_sliderMouseMove,false);
	 target.addEventListener ("mouseup",f_sliderMouseUp,false);
//	 target.addEventListener ("touchmove",f_sliderTouchMove,false);
	 target.addEventListener ("touchmove",f_sliderMouseMove,false);
	 target.addEventListener ("touchend",f_sliderMouseUp,false);
	 target.sliderEventsAttached = 1;
	} else if (target.attachEvent) {
	 target.attachEvent ("onmousemove",f_sliderMouseMove);
	 target.attachEvent ("onmouseup",f_sliderMouseUp);
//	 target.attachEvent ("ontouchmove",f_sliderTouchMove);
	 target.attachEvent ("ontouchmove",f_sliderMouseMove);
	 target.attachEvent ("ontouchend",f_sliderMouseUp);
	 target.sliderEventsAttached = 1;
	} else {
	 target.onmousemove = f_sliderMouseMove;
	 target.onmouseup = f_sliderMouseUp;
	 //target.ontouchmove = f_sliderTouchMove;
	 target.ontouchmove = f_sliderMouseMove;
	 target.ontouchend = f_sliderMouseUp;
	 target.sliderEventsAttached = 1;
	}
	}

/*
	if (!window.f_savedMouseMove && document.onmousemove != f_sliderMouseMove) {
		window.f_savedMouseMove = document.onmousemove;
		document.onmousemove = f_sliderMouseMove;
	}
	if (!window.f_savedMouseUp && document.onmouseup != f_sliderMouseUp) {
		window.f_savedMouseUp = document.onmouseup;
		document.onmouseup = f_sliderMouseUp;
	}
*/
	// preset to the value in the input box if available
	var e_input = this.s_form == null
		? get_element(this.s_name)
		: document.forms[this.s_form]
			? document.forms[this.s_form].elements[this.s_name]
			: null;
	this.f_setValue(e_input && e_input.value != '' ? e_input.value : null, 1);
	this.e_slider.style.visibility = 'visible';
}

function f_sliderSetValue (n_value, b_noInputCheck) {
	if (n_value == null)
		n_value = this.n_value == null ? this.n_minValue : this.n_value;
	if (isNaN(n_value))
		return false;
	// round to closest multiple if step is specified
	if (this.n_step)
		n_value = Math.round((n_value - this.n_minValue) / this.n_step) * this.n_step + this.n_minValue;
	// smooth out the result
	if (n_value % 1)
		n_value = Math.round(n_value * 1e5) / 1e5;

	if (n_value < this.n_minValue)
		n_value = this.n_minValue;
	if (n_value > this.n_maxValue)
		n_value = this.n_maxValue;

	this.n_value = n_value;

	// move the slider
	if (this.b_vertical)
		this.e_slider.style.top  = (this.n_pathTop + this.n_pathLength - Math.round((n_value - this.n_minValue) * this.n_pix2value)) + 'px';
	else
		this.e_slider.style.left = (this.n_pathLeft + Math.round((n_value - this.n_minValue) * this.n_pix2value)) + 'px';

	// save new value
	var e_input;
	if (this.s_form == null) {
		e_input = get_element(this.s_name);
		if (!e_input)
			return b_noInputCheck ? null : f_sliderError(this.n_id, "Can not find the input with ID='" + this.s_name + "'.");
	}
	else {
		var e_form = document.forms[this.s_form];
		if (!e_form)
			return b_noInputCheck ? null : f_sliderError(this.n_id, "Can not find the form with NAME='" + this.s_form + "'.");
		e_input = e_form.elements[this.s_name];
		if (!e_input)
			return b_noInputCheck ? null : f_sliderError(this.n_id, "Can not find the input with NAME='" + this.s_name + "'.");
	}
	e_input.value = n_value;


	// Check which slider is being updated
        if (this.s_name=="sliderValue" && _genfields.fit_lines.value!="0") {
 	 _genfields.fit_lines.value=n_value; // bit of a hack.. make sure value is set in field
 	 setFitDisplay(n_value);
	}
/*
        if (this.s_name=="sliderValue" && n_value!=old_fit_value) {
 	 setFitDisplay(n_value);
	 old_fit_value=n_value;
	}
        if (this.s_name=="sliderValue2")
 	 setFocussize(n_value);
        if (this.s_name=="sliderValue6")
 	 setFocusSelOpacity(n_value);

	_settingschanged=1;
//alert ("bleh");
*/
}

// get absolute position of the element in the document
function f_sliderGetPos (b_vertical, b_base) {
	var n_pos = 0,
		s_coord = (b_vertical ? 'Top' : 'Left');
	var o_elem = o_elem2 = b_base ? this.e_base : this.e_slider;
	
	while (o_elem) {
		n_pos += o_elem["offset" + s_coord];
		o_elem = o_elem.offsetParent;
	}
	o_elem = o_elem2;

	var n_offset;
	while (o_elem.tagName != "BODY") {
		n_offset = o_elem["scroll" + s_coord];
		if (n_offset)
			n_pos -= o_elem["scroll" + s_coord];
		o_elem = o_elem.parentNode;
	}
	return n_pos;
}

function f_sliderMouseDown (n_id) {
slider_mouseDownStatus=1;
//alert("slider mouse down");
	window.n_activeSliderId = n_id;
	// Slider specific action on mousedown
	if (window.n_activeSliderId != null) {
  	 var o_slider = window.A_SLIDERS[window.n_activeSliderId];
//         alert(o_slider.s_name);

	// Slider specific update when mousedown triggered
         if (o_slider.s_name=="sliderValue" && _genfields.fit_lines.value!="0") {
 	  n_value=_genfields.fit_lines.value;
 //alert("n_value is "+n_value);
   	  setFitDisplay(n_value); 
 	 }
	}

	return false;
}

function f_sliderMouseUp (e_event, b_watching) {
//alert("slider mouseup");

// Is it a real mouseup? Update the mousedown status if it's not a "watching" call (ie. just updating the slider 
// value without making the slider inactive)
if (b_watching!=1)
 slider_mouseDownStatus=0;

	if (window.n_activeSliderId != null) {
		var o_slider = window.A_SLIDERS[window.n_activeSliderId];
		o_slider.f_setValue(o_slider.n_minValue + (o_slider.b_vertical
			? (o_slider.n_pathLength - parseInt(o_slider.e_slider.style.top) + o_slider.n_pathTop)
			: (parseInt(o_slider.e_slider.style.left) - o_slider.n_pathLeft)) / o_slider.n_pix2value);
		if (b_watching)	return;
		window.n_activeSliderId = null;
	}
/*
	if (window.f_savedMouseUp)
		return window.f_savedMouseUp(e_event);
*/
}

function f_sliderMouseMove (e_event) {
	var touchdown;
	touchdown=0;

	if (!e_event && window.event) e_event = window.event;

	// save mouse/touch coordinates
	// EDIT: Not sure why n_mouseX etc is stored in window., since they're only used in this function
	// to calc. new slider position
	if (e_event) {
	 if(e_event.touches) {
	  if(e_event.touches.length == 1) { // Only deal with one finger
	    var touch = e_event.touches[0]; // Get the information for finger #1
	    window.n_mouseX=touch.pageX;
	    window.n_mouseY=touch.pageY;
	    touchdown=1;
	  }
	 }
	 else {
		window.n_mouseX = e_event.clientX + f_scrollLeft();
		window.n_mouseY = e_event.clientY + f_scrollTop();
	 }
	}

	// check if in drag mode
	// SG - can only have one active slider at a time? So this will process when there is any slider active
	if (window.n_activeSliderId != null) {
		var o_slider = window.A_SLIDERS[window.n_activeSliderId];

		// Checks for checkbox enabled/disabled for a specific slider
	        if (o_slider.s_name=="sliderValue" && _genfields.fit_lines.value=="0")
		 return;
		//	alert(_genfields.fit_lines.value);
		//	alert(this.s_name);


		var n_pxOffset;
		if (o_slider.b_vertical) {
			var n_sliderTop = window.n_mouseY - o_slider.n_sliderHeight / 2 - o_slider.f_getPos(1, 1) - 3;
			// limit the slider movement
			if (n_sliderTop < o_slider.n_pathTop)
				n_sliderTop = o_slider.n_pathTop;
			var n_pxMax = o_slider.n_pathTop + o_slider.n_pathLength;
			if (n_sliderTop > n_pxMax)
				n_sliderTop = n_pxMax;
			o_slider.e_slider.style.top = n_sliderTop + 'px';
			n_pxOffset = o_slider.n_pathLength - n_sliderTop + o_slider.n_pathTop;
		}
		else {
			var n_sliderLeft = window.n_mouseX - o_slider.n_sliderWidth / 2 - o_slider.f_getPos(0, 1) - 3;
			// limit the slider movement
			if (n_sliderLeft < o_slider.n_pathLeft)
				n_sliderLeft = o_slider.n_pathLeft;
			var n_pxMax = o_slider.n_pathLeft + o_slider.n_pathLength;
			if (n_sliderLeft > n_pxMax)
				n_sliderLeft = n_pxMax;
			o_slider.e_slider.style.left = n_sliderLeft + 'px';
			n_pxOffset = n_sliderLeft - o_slider.n_pathLeft;
		}

	        // Prevents viewport scrolling when dragging this element and should also ensure touchend fires in Android
	        // Note: We only want to do this if there is a slider active, otherwise we will be causing a preventdefault
	        // when scrolling/touching any part of the screen which would not be good.
	        if (touchdown==1) {
   	         e_event.preventDefault();
		}

		// If b_watch is set, simulate a mouseup so as to update the info box associated with the 
		// slider while moving
		if (o_slider.b_watch)
			 f_sliderMouseUp(e_event, 1);

		return false;
	}
	
/*
	if (window.f_savedMouseMove)
		return window.f_savedMouseMove(e_event);
*/
}

// get the scroller positions of the page
function f_scrollLeft() {
	return f_filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}
function f_scrollTop() {
	return f_filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}
function f_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

function f_sliderError (n_id, s_message) {
	alert("Slider #" + n_id + " Error:\n" + s_message);
	window.n_activeSliderId = null;
}

get_element = document.all ?
	function (s_id) { return document.all[s_id] } :
	function (s_id) { return document.getElementById(s_id) };

