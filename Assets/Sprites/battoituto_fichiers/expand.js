/*--- Text labels (can be customized)---*/

var show_all='Show all text';
var hide_all='Hide all text';
var show_details='(more.. )';
var hide_details='(hide)';

/*--------------------------------------*/

var div=document.getElementsByTagName('div');

function toggle(container, action)
{
    var child=container.getElementsByTagName('div')[0];
    var label_text=container.lastChild.firstChild.nodeValue;
    if(action=='toggle' && child.style.display=='none')
    {
        child.style.display='inline';
    }
    else if(action=='toggle' && child.style.display=='inline')
    {
        child.style.display='none';
    }
    else if(action=='toggle_all')
    {
        var global_label_text=toggle_all.lastChild.firstChild.nodeValue;
        if(global_label_text==show_all)
        {
            var display_value='inline';
            toggle_all.lastChild.firstChild.nodeValue=hide_all;
        }
        else if(global_label_text==hide_all)
        {
            var display_value='none';
            toggle_all.lastChild.firstChild.nodeValue=show_all;
        }
        for(var i=0; i<div.length; i++)
        {
            var child=div[i].getElementsByTagName('div')[0];
            if(div[i].className=='toggle')
            {
                child.style.display=display_value;
            }
        }
    }

    // synchronize buttons
    var all_shown='yes';
    var all_hidden='yes';
    for(var i=0; i<div.length; i++)
    {
        var child=div[i].getElementsByTagName('div')[0];
        if(div[i].className=='toggle' && child.style.display=='none')
        {
            div[i].lastChild.firstChild.nodeValue=show_details;
            div[i].lastChild.className='toggle-control-show notranslate';
            all_shown='no';
        }
        else if(div[i].className=='toggle' && child.style.display=='inline')
        {
            div[i].lastChild.firstChild.nodeValue=hide_details;
//            div[i].lastChild.style.color='#826240';
            div[i].lastChild.className='toggle-control-hide notranslate';
            all_hidden='no';
        }
    }
    if(all_shown=='yes')
    {
        toggle_all.lastChild.firstChild.nodeValue=hide_all;
    }
    else if(all_hidden=='yes')
    {
        toggle_all.lastChild.firstChild.nodeValue=show_all;
    }
}

function make_control(container, action)
{
    var span=document.createElement('span');
    span.className='toggle-control-show notranslate';
    container.appendChild(span);
    if(action=='toggle_all')
    {
        span.className='toggle-all notranslate';
        span.appendChild(document.createTextNode(show_all));
    }
    else if(action=='toggle')
    {
        span.appendChild(document.createTextNode(show_details));
    }
    span.onclick=function()
    {
        toggle(container, action);
    }
}

var toggle_all=document.getElementById('toggle_all');
make_control(toggle_all, 'toggle_all');

for(var i=0; i<div.length; i++)
{
    if(div[i].className=='toggle')
    {
        div[i].getElementsByTagName('div')[0].style.display='none';
        make_control(div[i], 'toggle');
    }
}
