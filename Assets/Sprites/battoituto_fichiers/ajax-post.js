var AjaxPost = new Object();

AjaxPost.Request = function(url, params, callbackMethod)
{
	AjaxPost.request = AjaxPost.createRequestObject();
	AjaxPost.request.onreadystatechange = callbackMethod;
	AjaxPost.request.open("POST", url, true);
	AjaxPost.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	AjaxPost.request.send(params);
	//AjaxPost.request.open("GET", url, true);
	//AjaxPost.request.send(null);
	//alert(url);
}

AjaxPost.createRequestObject = function()
{
	var obj;
	if(window.XMLHttpRequest)
	{
		obj = new XMLHttpRequest();
	}
	else if(window.ActiveXObject)
	{
		obj = new ActiveXObject("MSXML2.XMLHTTP");
	}
	return obj;
}


AjaxPost.CheckReadyState = function(obj)
{
/*
	if(obj.readyState == 0) { 
	document.getElementById('loading').innerHTML = "Sending Request..."; 
	}
	if(obj.readyState == 1) { 
	document.getElementById('loading').innerHTML = "Loading..."; 
	document.getElementById('infoDiv').innerHTML = "Updating..."; 
	}
	if(obj.readyState == 2) { 
	document.getElementById('loading').innerHTML = "Loading..."; 
	document.getElementById('infoDiv').innerHTML = "Updating..."; 
	}
	if(obj.readyState == 3) { 
	document.getElementById('loading').innerHTML = "Loading..."; 
	document.getElementById('infoDiv').innerHTML = "Updating..."; 
	}
	if(obj.readyState == 4)
	{
		if(obj.status == 200)
		{
			document.getElementById('loading').innerHTML = "";
			return true;
		}
		else
		{
			document.getElementById('loading').innerHTML = "HTTP " + obj.status;
		}
	}
*/
	if(obj.readyState == 4 && obj.status == 200)
	 return true;
}

