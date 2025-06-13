// Create an array of Ajax objects
var Ajax = [];

for(i=0;i<5;i++) {
//alert("creating "+i);
temp_Ajax= new Object();


temp_Ajax.Request = function(url, callbackMethod)
{
	this.request = this.createRequestObject();
	this.request.onreadystatechange = callbackMethod;
	//this.request.open("POST", url, true);
	//this.request.send(url);
	this.request.open("GET", url, true);
	this.request.send(null);
	//alert(url);
}

temp_Ajax.createRequestObject = function()
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


temp_Ajax.CheckReadyState = function(obj)
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

Ajax.push(temp_Ajax);
}
