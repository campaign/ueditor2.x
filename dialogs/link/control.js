

var range = editor.selection.getRange(),
    link = range.collapsed ? editor.queryCommandValue( "link" ) : editor.selection.getStart(),
    url,
    text = $G('text'),
    rangeLink = domUtils.findParentByTagName(range.getCommonAncestor(),'a',true),
    orgText;
link = domUtils.findParentByTagName( link, "a", true );
if(link){
    url = utils.html(link.getAttribute( '_href' ) || link.getAttribute( 'href', 2 ));

    if(rangeLink === link && !link.getElementsByTagName('img').length){
        text.removeAttribute('disabled');
        orgText = text.value = link[browser.ie ? 'innerText':'textContent'];
    }else{
        text.setAttribute('disabled','true');
        text.value = lang.validLink;
    }

}else{
    if(range.collapsed){
        text.removeAttribute('disabled');
        text.value = '';
    }else{
        text.setAttribute('disabled','true');
        text.value = lang.validLink;
    }

}
$G("title").value = url ? link.title : "";
$G("href").value = url ? url: '';
$G("target").checked = url && link.target == "_blank" ? true :  false;
$focus($G("href"));

function handleDialogOk(){
    var href =$G('href').value.replace(/^\s+|\s+$/g, '');
    if(href){
        if(!hrefStartWith(href,["http","/","ftp://"])) {
            href  = "http://" + href;
        }
        var obj = {
            'href' : href,
            'target' : $G("target").checked ? "_blank" : '_self',
            'title' : $G("title").value.replace(/^\s+|\s+$/g, ''),
            '_href':href
        };
        //修改链接内容的情况太特殊了，所以先做到这里了
        //todo:情况多的时候，做到command里
        if(orgText && text.value != orgText){
            link[browser.ie ? 'innerText' : 'textContent'] =  obj.textValue = text.value;
            range.selectNode(link).select()
        }
        if(range.collapsed){
            obj.textValue = text.value;
        }
        editor.execCommand('link',obj );
        dialog.close();
    }
}
dialog.onok = handleDialogOk;
$G('href').onkeydown = $G('title').onkeydown = function(evt){
    evt = evt || window.event;
    if (evt.keyCode == 13) {
        handleDialogOk();
        return false;
    }
};
$G('href').onblur = function(){
    if(!hrefStartWith(this.value,["http","/","ftp://"])){
        $G("msg").innerHTML = "<span style='color: red'>"+lang.httpPrompt+"</span>";
    }else{
        $G("msg").innerHTML = "";
    }
};

function hrefStartWith(href,arr){
    href = href.replace(/^\s+|\s+$/g, '');
    for(var i=0,ai;ai=arr[i++];){
        if(href.indexOf(ai)==0){
            return true;
        }
    }
    return false;
}