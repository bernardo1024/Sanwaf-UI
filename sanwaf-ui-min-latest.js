function A(e){return"0"<=e&&e<="9"}function i(e,r,t){var a=e.indexOf("%1");return e=0<=(a=(e=0<=a?e.substring(0,a)+r+e.substring(a+2,e.length):e).indexOf("%2"))?e.substring(0,a)+t+e.substring(a+2,e.length):e}function o(e){if(e){var r=document.getElementById(e);if(r)return r;e=document.getElementsByName(e);return e.length,e[0]}}function a(){for(var e,r=document.getElementsByTagName("LABEL"),t=0;t<r.length;t++)""==r[t].htmlFor||(e=o(r[t].htmlFor))&&(e.label=r[t])}function s(e){var r=o(e.showOnPageElementId);e.errorActions.includes("showdiv")&&(r.style.display="none"),!e.showOnPageSanwafTableElementId||(r=o(e.showOnPageSanwafTableElementId))&&(r.innerHTML="");for(var t=[],a=document.getElementsByTagName("DIV"),s=0;s<a.length;s++)"sanwafuierrordisplay"==a[s].id&&t.push(a[s].parentNode);for(var n=0;n<t.length;n++){var l=t[n].getAttribute("sanwafuilabeltxt");l&&(t[n].innerHTML=l)}for(var u=document.getElementsByTagName("INPUT"),i=0;i<u.length;i++)u[i].classList.contains(e.inputClass)&&u[i].classList.remove(e.inputClass)}function I(e,r){var t=p(e),a=t.getAttribute("sanwafuilabeltxt");a&&(t.innerHTML=a),e.classList.contains(r.inputClass)&&e.classList.remove(r.inputClass)}function g(e,r){for(var t="",a=0;a<e.length;a++)t+=0==a?e[a]:r+e[a];return t}function p(e){return e.swLabelId||e.label}function w(e,r,t,a){var s,n="",l="",u=e.getAttribute("id")?o(e.getAttribute("id")):o(e.getAttribute("name")),i=p(u);i&&((n=i.getAttribute("sanwafuilabeltxt"))||(n=i.innerHTML,(s=document.createAttribute("sanwafuilabeltxt")).value=i.innerHTML,i.setAttributeNode(s)),a.includes("colorLabel")&&(n="<span id='sanwafuispan' class='"+r.labelClass+"'>"+n+"</span>"),a.includes("hoverOnLabel")&&(r.showlabel&&(e.swDisplay&&0<e.swDisplay.length?l+='"'+e.swDisplay+'"<br/>':0<i.getAttribute("sanwafuilabeltxt").length&&(l+='"'+i.getAttribute("sanwafuilabeltxt")+'"<br/>')),l+=g(t,"<br/>")),a.includes("hoverOnLabel")?i.innerHTML="<div id='sanwafuierrordisplay' class='"+r.tooltipClass+"'>"+n+"<span id='sanwafuispan' class='"+r.tooltipTextClass+"'>"+l+"</span></div>":i.innerHTML=n),a.includes("colorInput")?u.classList.add(r.inputClass):u.classList.contains(r.inputClass)&&u.classList.remove(r.inputClass)}function h(e,r,t,a,s,n,l){var u=t.msgs.length;e.swErrMsg&&!s?0==u&&(t.msgs[u]=e.swErrMsg,(n||l)&&(t.msgs[u]=i(t.msgs[u],n,l))):(t.msgs[u]=a,(n||l)&&(t.msgs[u]=i(t.msgs[u],n,l)))}function v(e){var r="";e.includes("s")&&(e=e.replace("s",""),r+=" [space]"),e.includes("\t")&&(e=e.replace("\t",""),r+=" [tab]"),e.includes("\n")&&(e=e.replace("\n",""),r+=" [linefeed]"),e.includes("\r")&&(e=e.replace("\r",""),r+=" [carriage]");for(var t="",a=!1,s=0;s<e.length;s++)a?t+=", ":a=!0,t+='"'+e[s]+'"';return t+=r}function f(e){for(var r=[],t=[],a=q(e.swRelated,0,"AND",")&&(","(",")"),s=0;s<a.length;s++){for(var r=q(a[s],0,"OR",")||(","(",")"),n=0;n<r.length;n++)"||"==r[n]?r[n]="OR":r[n].startsWith("||(")?(r[n]=r[n].substring(3,r[n].length-1),r.splice(n,0,"OR")):r[n].endsWith(")||")&&(r[n]=r[n].substring(1,r[n].length-3),r.splice(n+1,0,"OR"));Array.prototype.push.apply(t,r)}for(var l="",u=0;u<t.length;u++)"AND"!=t[u]&&"OR"!=t[u]?l+="'"+o(t[u].split(":")[0]).label.innerHTML+"'":l+=" "+t[u]+" ";return l}function c(e){if(e.swDisplay&&0<e.swDisplay.length)return e.swDisplay;var r="",t=e.getAttribute("id")?o(e.getAttribute("id")):o(e.getAttribute("name")),e=p(t);return e?((r=e.getAttribute("sanwafuilabeltxt"))||(r=e.innerHTML,(t=document.createAttribute("sanwafuilabeltxt")).value=e.innerHTML,e.setAttributeNode(t)),r):""}function l(e,r,t,a){var s,n,l,u,i=new Object;i.id=e.id,i.name=e.name,i.disp=c(e),i.msgs=[],e.swTypeIsInError&&("c"==e.swType?h(e,r,i,r.type_c,!1,"",""):"n"==e.swType?h(e,r,i,r.type_n,!1,"",""):"i"==e.swType?h(e,r,i,r.type_i,!1,"",""):"a"==e.swType&&h(e,r,i,r.type_a,!1,"",""),n=e.swType.substring(0,2),l=H(e.swType,"{","}"),"n{"==n?h(e,r,i,r.type_nn,!1,v(l),""):"i{"==n?h(e,r,i,r.type_ii,!1,v(l),""):"a{"==n?h(e,r,i,r.type_aa,!1,v(l),""):"k{"==n?h(e,r,i,r.type_k,!1,l.replace(",",'" or "'),""):"r{"==n||"x{"==n?h(e,r,i,r.type_r,!1,l,""):"f{"==n?h(e,r,i,r.type_f,!1,l,""):"d{"==n&&h(e,r,i,r.type_d,!1,l,"")),e.swReqIsInError&&h(e,r,i,r.required,!1,"",""),(e.swMaxIsInError||e.swMinIsInError)&&(e.swMax==e.swMin?(h(e,r,i,r.maxMinEqualMsg,!1,e.swMin,e.swMax),e.swErrMsg&&h(e,r,i,"",!1,e.swMin,e.swMax)):h(e,r,i,r.max,!1,e.swMin,e.swMax)),(e.swMaxValueIsInError||e.swMinValueIsInError)&&h(e,r,i,r.maxVal,!1,e.swMinValue,e.swMaxValue),e.swRelatedIsInError&&(e.swRelated.startsWith("(")?h(e,r,i,r.rel,!1,f(e),""):(n=o((s=e.swRelated.split(":"))[0]),a||n&&n.getAttribute("id")&&(u=(u=(l=o(n.getAttribute("id")).label).getAttribute("sanwafuilabeltxt"))||l.innerHTML),"="==s[1]?e.value!=n.value?h(e,r,i,r.relNotEqual,!1,c(e),c(n)):h(e,r,i,r.relNotEqual,!1,c(e),c(parentElement)):h(e,r,i,r.rel,!1,"'"+u+"'",""))),r.msgarray.push(i),a||w(e,r,i.msgs,t)}function u(e,r,t){var a="";"html"==t?a+="<table class='"+r.sanwafErrorTableClass+"'>":(r.popheader1&&(a+=r.popheader1),r.popheader2&&(a+="\n"+r.popheader2));for(var s=0;s<r.msgarray.length;s++)a+="html"==t?"<tr><td class='"+r.sanwafErrorTableTdKeyClass+"'>"+r.msgarray[s].disp+"</td><td class='"+r.sanwafErrorTableTdDescClass+"'>"+g(r.msgarray[s].msgs,"<br/>")+"</td></tr>":'\n"'+r.msgarray[s].disp+'"\n\t'+g(r.msgarray[s].msgs,"\n\t");return"html"==t&&(a+="</table>"),a}function d(e,r,t){var a=e.errorActions;r&&(a=e.blurActions);for(var s,n=0;n<e.elements.length;n++)l(e.elements[n],e,a,t);t||(a.includes("showOnPage")&&((r=o(e.showOnPageElementId))&&(r.style.display="block"),!e.errorActions.includes("showOnPageSanwafTable")||(s=o(e.showOnPageSanwafTableElementId))&&(s.innerHTML=u(s,e,"html"))),0<e.msgarray.length&&a.includes("alertWithPopup")&&alert(u(s,e,"alertWithPopup")))}function b(e,r,t){if(null==t&&(t=""),e){r=e.getAttribute(r);if(null!=r&&0<r.length)return r}return t}function m(e){r(e),e.swDisplay=b(e,"data-sw-display",e.swDisplay),e.swLabelId=o(b(e,"data-sw-label-id",e.swLabelId)),e.swErrMsg=b(e,"data-sw-err-msg",e.swErrMsg),e.swType=b(e,"data-sw-type",e.swType),e.swTypeIsInError=!1,e.swMax=b(e,"data-sw-max-length",e.swMax),e.swMaxIsInError=!1,e.swMin=b(e,"data-sw-min-length",e.swMin),e.swMinIsInError=!1,e.swReq||(e.swReq=b(e,"data-sw-required",!1)),"false"==(e.swReq+"").toLowerCase()?e.swReq=!1:e.swReq=!0,e.swReqIsInError=!1,e.swMaskErr=b(e,"data-sw-mask-err",""),e.swType.startsWith("f{")?e.swFormat=e.swType.substring(2,e.swType.length-1):e.swType.startsWith("d{")&&(e.swDepFormat=e.swType.substring(2,e.swType.length-1)),e.swMaxValue=b(e,"data-sw-max-value",e.swMaxValue),e.swMaxValueIsInError=!1,e.swMinValue=b(e,"data-sw-min-value",e.swMinValue),e.swMinValueIsInError=!1,e.swRelated=C(b(e,"data-sw-related",e.swRelated)),e.swRelatedIsInError=!1}function r(e){"email"==e.type?(e.swType="r{[^@\\s]+@[^@\\s]+\\.[^@\\s]+}",e.swErrMsg="Invalid Email Entered",e.isHtml5=!0):"number"==e.type?(e.swType="n",e.isHtml5=!0):"url"==e.type?(e.swType="r{https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)}",e.swErrMsg="Invalid URL Entered",e.isHtml5=!0):"tel"==e.type&&(e.swType="r{\\(?(\\d{3})\\)?[-\\.\\s]?(\\d{3})[-\\.\\s]?(\\d{4})}",e.swErrMsg="Invalid Telephone Number Entered",e.isHtml5=!0);var r=b(e,"pattern","");r&&0<r.length&&(e.swType="r{"+r+"}",e.isHtml5=!0),e.swMin=b(e,"minlength",""),e.minlength&&0<e.minlength.length&&(e.isHtml5=!0),e.swMax=b(e,"maxlength",""),e.maxlength&&0<e.maxlength.length&&(e.isHtml5=!0),e.swReq=e.getAttribute("required"),""==e.swReq?(e.swReq=!0,e.isHtml5=!0):e.swReq=!1,e.swMaxValue=b(e,"max",""),e.swMaxValue&&0<e.swMaxValue.length&&(e.swType="n",e.isHtml5=!0),e.swMinValue=b(e,"min",""),e.swMinValue&&0<e.swMinValue.length&&(e.swType="n",e.isHtml5=!0)}function t(e,r){var t=document.createAttribute("data-sw-html5-is-neg");t.value=r,e.setAttributeNode(t)}function y(e){var r=document.createAttribute("data-sw-html5-value");r.value=e.value,e.setAttributeNode(r)}function M(e){var r=o("sanwafUiConfig"),t=new Object;return t.count=0,t.elements=[],t.msgarray=[],t.numErrorsToDisplay=b(r,"data-sw-numErrorsToDisplay"),""==t.numErrorsToDisplay&&(t.numErrorsToDisplay=-1),t.errorActions=b(r,"data-sw-errorActions",""),""==t.errorActions&&(t.errorActions="hoverOnLabel,hoverShowLabel,colorLabel,colorInput"),t.blurActions=b(r,"data-sw-blurActions",""),""==t.blurActions&&(t.blurActions="hoverOnLabel,hoverShowLabel,colorLabel,colorInput"),t.labelClass=b(r,"data-sw-labelClass","sanwafuiLabel"),t.inputClass=b(r,"data-sw-inputClass","sanwafuiInput"),t.tooltipClass=b(r,"data-sw-tooltipClass","sawafuiTooltip"),t.tooltipTextClass=b(r,"data-sw-tooltipTextClass","tooltiptext"),t.sanwafErrorTableClass=b(r,"data-sw-sanwafErrorTableClass","sanwafuiErrorTable"),t.sanwafErrorTableTdKeyClass=b(r,"data-sw-sanwafErrorTableTdKeyClass","sanwafuiErrorTableTdKey"),t.sanwafErrorTableTdDescClass=b(r,"data-sw-sanwafErrorTableTdDescClass","sanwafuiErrorTableTdDesc"),t.showOnPageElementId=b(r,"data-sw-showOnPageElementId","sanwafuierrorwrapper"),t.showOnPageSanwafTableElementId=b(r,"data-sw-showOnPageSanwafTableElementId","sanwafuierrortable"),t.errorActions.includes("hoverShowLabel")?t.showlabel=!0:t.showlabel=!1,t.popheader1=b(r,"data-sw-errorPopHeader1","Please correct the following errors"),t.popheader2=b(r,"data-sw-errorPopHeader2","---------------------------------------------------------------------------"),t.min=b(r,"data-sw-errorMinLength","Must be between %1 and %2 chars"),t.max=b(r,"data-sw-errorMaxLength","Must be between %1 and %2 chars"),t.maxMinEqualMsg=b(r,"data-sw-errorMaxMinLengthEqual","Must be %1 chars"),t.required=b(r,"data-sw-errorRequired","Is a Required Field"),t.minVal=b(r,"data-sw-errorMinValue","Must be between %1 and %2"),t.maxVal=b(r,"data-sw-errorMaxValue","Must be between %1 and %2"),t.rel=b(r,"data-sw-errorRelated","Is required when %1 is entered"),t.relNotEqual=b(r,"data-sw-errorRelatedNotEqual","%1 must have the same value as %2"),t.type_c=b(r,"data-sw-errorTypeChar","Must be a single character"),t.type_n=b(r,"data-sw-errorTypeNumeric","Must be numeric"),t.type_nn=b(r,"data-sw-errorTypeNumericDelimited","Must be a list of numeric value(s) delimted by %1"),t.type_i=b(r,"data-sw-errorTypeInteger","Must be an integer"),t.type_ii=b(r,"data-sw-errorTypeIntegerDelimited","Must be a list of integer value(s) delimted by %1"),t.type_a=b(r,"data-sw-errorTypeAlphanumeric","Must be alphanumeric"),t.type_aa=b(r,"data-sw-errorTypeAlphanumericAndMore","Must be alphanumeric or the following: %1"),t.type_k=b(r,"data-sw-errorTypeConstant",'Must be must be one of the following: "%1"'),t.type_r=b(r,"data-sw-errorTypeRegex",'Must be must match the regex: "%1"'),t.type_f=b(r,"data-sw-errorTypeFormat","Must have the format: %1"),t.type_d=b(r,"data-sw-errorTypeDependentFormat","Must have the format: %1"),a(),e||s(t),t}function e(e){if(!(e.value.length<=0)&&e)for(var r=0;r<e.value.length;r++)if(!A(e.value.charAt(r))){if(0==r)e.value=e.value.substring(1,e.value.length);else{if(r==e.value.length-1){e.value=e.value.substring(0,r);break}e.value=e.value.substring(0,r)+e.value.substring(r+1,e.value.length)}r--}}function n(e){if(!(e.value.length<=0)&&e)for(var r=0;r<e.value.length;r++)if(" "==e.value.charAt(r)){if(0==r)e.value=e.value.substring(1,e.value.length);else{if(r==e.value.length-1){e.value=e.value.substring(0,r);break}e.value=e.value.substring(0,r)+e.value.substring(r+1,e.value.length)}r--}}function E(e,r){return e=r?(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=e.replaceAll(/\\#/g,"\t")).replaceAll(/\\A/g,"\n")).replaceAll(/\\a/g,"\r")).replaceAll(/\\c/g,"\f")).replaceAll("\\[","\b")).replaceAll("\\]","\v")).replaceAll("\\|","\0")).replaceAll("\\x","")).replaceAll("\\:","")).replaceAll("\\=","")).replaceAll("\\(","")).replaceAll("\\)","")).replaceAll("\\+","")).replaceAll("\\-","")).replaceAll("\\;",""):(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=e.replaceAll("\t","#")).replaceAll("\n","A")).replaceAll("\r","a")).replaceAll("\f","c")).replaceAll("\b","[")).replaceAll("\v","]")).replaceAll("\0","|")).replaceAll("","x")).replaceAll("",":")).replaceAll("","=")).replaceAll("","(")).replaceAll("",")")).replaceAll("","+")).replaceAll("","-")).replaceAll("",";")}function T(e){var r=[],t=0,a=0,s=0,n=0;for(e=x(e);;){var l,u,i="",o=0;if((t=e.indexOf("#",a))<0){a<e.length&&Array.prototype.push.apply(r,e.substring(a,e.length).split(""));break}a="["==e.charAt(t+1)?(n=e.indexOf("]",t),o=e.substring(t+2,n).includes(",")?0:n-(e.indexOf("-",t)+1),i=e.substring(a,n+1),n+1):(i=e.substring(a,t+1),t+1),i.startsWith("#")||(l=i.indexOf("#"),u=i.substring(0,l),Array.prototype.push.apply(r,u.split("")),s=r.length,i=i.substring(l,i.length)),r[s]=i,s++;for(var g=0;g<o-1;g++)r[s]="",s++}return r}function x(e){for(var r,t=new Date,a=e,s=["dd","mm","yyyy","yy"],n=0;n<s.length;n++)for(var l=s[n],u=0;;){var i,o,g;if((u=a.indexOf(l))<0)break;o=(i=u)+l.length,"yy"==l?r=N(a,u+=2,r=parseInt(t.getFullYear().toString().substr(-2))):"yyyy"==l?r=N(a,u+=4,r=parseInt(t.getFullYear())):"mm"==l?(u+=2,12<(r=parseInt(t.getMonth())+1)&&(r=12)):(l="dd",31<(r=N(a,u+=2,r=parseInt(t.getDate())))&&(r=31)),a="("==a.substring(u,u+1)?(g=a.indexOf(")",u),a.substring(0,i)+r+a.substring(g+1,a.length)):a.substring(0,i)+r+a.substring(o,a.length)}return a}function N(e,r,t){var a;return"("==e.substring(r,r+1)&&(a=e.indexOf(")",r),a=e.substring(r+2,a),a=parseInt(a),"+"==(r=e.substring(r+1,r+2))?t+=a:"-"==r&&(t-=a)),t}function R(e,r,t){if(0!=e.value.length||0!=e.swReq){var a=E(e.swFormat,!0).split("||"),s=[],n=[],l=[];l.length=a.length;for(var u=0;u<l.length;u++)l[u]=Number.MAX_VALUE;for(var i=0;i<a.length;i++){n[i]=!1,s[i]=e.value;var o=T(a[i]),g=o.length;if(0==s[i].length&&0<g&&1==e.swReq)n[i]=!0;else{s[i].length>g&&(s[i]=s[i].substring(0,g));for(var p=0,p=0;p<s[i].length;p++){var w=s[i].charAt(p),h=o[p];if(""==h&&("9"<w||w<"0"))for(var v=p;;){s[i].charAt(v);if(""!=o[v])break;s[i]="0"+s[i],v--}else if(""!=h){if(!h)return void(s[i]=s[i].substring(0,o.length));(h.startsWith("#[")?L:V)(w,h,o,s,n,l,i,p)}}if(1==a.length)for(;;){var f=o[p];if(!f||f.startsWith("#")||f.startsWith("A")||f.startsWith("a")||f.startsWith("c")||f.startsWith("x")||p>s[i].length)break;s[i]=s[i].substring(0,s[i].length)+o[p],p++}s[i].length!=g&&(n[i]=!0)}}for(var c,d=!0,b=-1,m=-1,y=0;y<l.length;y++)(l[y]>m||s[y].length>b)&&(b=s[y].length,m=l[y],c=s[y],d=n[y]);e.value=c||"",d?e.swTypeIsInError=!0:I(e,r)}}function L(e,r,t,a,s,n,l,u){if("9"<e||e<"0")a[l]=a[l].substring(0,u)+a[l].substring(u+1,a[l].length);else{var i=[];if((r=r.substring(2,r.length-1)).includes(","))(i=r.split(",")).includes(e)||(a[l]=a[l].substring(0,u)+a[l].substring(u+1,a[l].length));else{var i=r.split("-"),o=parseInt(i[0]),g=parseInt(i[1]),p=(g+"").length,w=p,h=0,v=p-(o+"").length,f=0,c=!0,d=e,b=e;if(c&&0==parseInt(e)?f++:c=!1,1<p){for(var m=1;m<p;m++){var y=a[l].charAt(u+m);A(y)?(c&&0==parseInt(y)?f++:c=!1,d+=y,b+=y):(d+="9",b+="0",h++,w--)}r=parseInt(d),i=parseInt(b);0==i&&f<=v||o<=i&&i<=g?u+=w-1:((v=parseInt(b.substring(0,b.length-h)))<g&&o<=v?a[l]=a[l].substring(0,u+w-1)+"0"+a[l].substring(u+w-1,a[l].length):(r<o||g<i)&&(a[l]=a[l].substring(0,u+w-1)),O(s,n,l,u))}else parseInt(e)>=o&&parseInt(e)<=g?u+=p-1:(a[l]=a[l].substring(0,u+p-1),O(s,n,l,u))}}}function V(e,r,t,a,s,n,l,u){if("#"==r||"A"==r||"a"==r||"x"==r||"c"==r||e==E(r,!1)){if("x"!=r&&!("#"==r&&"0"<=e&&e<="9"))return"#"==r&&(e<"0"||"9"<e)?(O(s,n,l,u),a[l]=a[l].substring(0,u)+a[l].substring(u+1,a[l].length),void u--):void("A"!=r&&"a"!=r&&"c"!=r||!("a"<=e&&e<="z"||"A"<=e&&e<="Z")?"A"!=r&&"a"!=r&&"c"!=r&&("#"!=r||"0"<=e&&e<="9")&&"#"!=r||(O(s,n,l,u),a[l]=a[l].substring(0,u)+a[l].substring(u+1,a[l].length),u--):("A"==r?e=e.toUpperCase():"a"==r&&(e=e.toLowerCase()),a[l]=a[l].substring(0,u)+e+a[l].substring(u+1,a[l].length)))}else a[l]=a[l].substring(0,u)+E(r,!1)+a[l].substring(u,a[l].length)}function O(e,r,t,a){e[t]||(e[t]=!0,r[t]=a)}function q(e,r,t,a,s,n){for(var l=[],u=r;;){var i=e.indexOf(a,u);if(!(0<i)){if(u+1==e.length)break;g=e.substring(u,e.length),l.push(g);break}var o=e.lastIndexOf(s,i);o!=u&&(g=e.substring(u,o),l.push(g)),g=e.substring(o+s.length,i),l.push(g),l.push(t);var o=e.indexOf(n,i+a.length),g=e.substring(i+a.length,o);if(l.push(g),(u=o+n.length)==e.length)break}return l}function C(e){return e=(e=(e=(e=(e=(e=e.trim()).replaceAll(/\)\s+&&\s+\(/g,")&&(")).replaceAll(/\s+\|\|\s+/g,"||")).replaceAll(/\s+:\s+/g,":")).replaceAll(/\(\s+/g,"(")).replaceAll(/\s+\)/g,")")}function _(e,r){var t=(a=e.swDepFormat.split(":"))[0],a=a[1].split(";");if(value=o(t).value,value&&0!=value.length)for(var s=0;s<a.length;s++)if(value==a[s].split("=")[0]){e.swFormat=a[s].split("=")[1],R(e,r,!0);break}}function D(e){for(var r=[],t=[],a=q(e.swRelated,0,"AND",")&&(","(",")"),s=0;s<a.length;s++){for(var r=q(a[s],0,"OR",")||(","(",")"),n=0;n<r.length;n++)"||"==r[n]?r[n]="OR":r[n].startsWith("||(")?(r[n]=r[n].substring(3,r[n].length-1),r.splice(n,0,"OR")):r[n].endsWith(")||")&&(r[n]=r[n].substring(1,r[n].length-3),r.splice(n+1,0,"OR"));Array.prototype.push.apply(t,r)}for(var l=[],u=[],i=!1,o=!1,g=0;g<t.length;g++)k(t[g],e)&&(i?u[u.length]=!0:l[l.length]=!0),i=!1,"OR"!=t[g+1]?"AND"==t[g+1]&&(g++,o=i=!0):g++;if(0<u.length||1==o){if(0==u.length)return!0;for(var p=0;p<u.length;p++)if(u[p]&&0==e.value.length)for(var w=0;w<l.length;w++)if(l[w]&&0==e.value.length)return!(e.swRelatedIsInError=!0)}else for(var h=0;h<l.length;h++)if(l[h]&&0==e.value.length)return!(e.swRelatedIsInError=!0);return!0}function k(e,r){var t=e.split(":"),a=o(t[0]);if(a){var s=a.value;"checkbox"==a.type&&(s=""+a.checked);e=0;if(r.value.length&&(e=r.value.length),t[1]){if("="==t[1])return!(0<r.value.length&&r.value==s)&&((0<s.length||!(!a.getAttribute("swReq")||0!=r.value.length))&&(r.swRelatedIsInError=!0));for(var n=t[1].split("||"),l=0;l<n.length;l++)if(n[l]==s)return!0;return!1}a=a.getAttribute("data-sw-required");return a&&1==a&&0==e||0<s.length&&0==e?!(r.swRelatedIsInError=!0):void 0}}function H(e,r,t){var a=e.indexOf(r),t=e.lastIndexOf(t);return a<t&&0<=a?e.substring(a+r.length,t):""}function F(e,r){return!e||0==e.value.length||(1<e.value.length&&(e.value=e.value.substring(e.value.length-1,e.value.length)),1==e.value.length||!(e.swTypeIsInError=!0))}function W(e,r,t){if(e.isHtml5&&0==e.value.length){var a=b(e,"data-sw-html5-value","");return"-"==b(e,"data-sw-html5-is-neg","")&&""==a?void 0:void(e.value=a)}if(!(e&&0!=e.value.length||e.swReq))return!0;if(e&&0==e.value.length&&e.swReq)return!(e.swTypeIsInError=!0);a=Number.MAX_VALUE;e.swMaxValue&&0<e.swMaxValue.length&&NaN!=(i=parseFloat(e.swMaxValue))&&(a=i);var s=Number.MIN_VALUE;e.swMinValue&&0<e.swMinValue.length&&NaN!=(i=parseFloat(e.swMinValue))&&(s=i);for(var n=0,l=0;l<e.value.length;l++){var u=e.value.charAt(l);"0"<=u&&u<="9"||"-"==u&&0==l&&(s<0||s==Number.MIN_VALUE)||!t&&"."==u&&0==n?"."==u&&n++:e.value=e.value.substring(0,l)+e.value.substring(l+1,e.value.length)}if(isNaN(e.value))return e.value=e.value.substring(0,l)+e.value.substring(l+1,e.value.length),!(e.swTypeIsInError=!0);var i=parseFloat(e.value);return a!=Number.MAX_VALUE&&a<i&&(e.value=e.value.substring(0,e.value.length-1)),s!=Number.MIN_VALUE&&i<s||a!=Number.MAX_VALUE&&a<i?!(e.swTypeIsInError=!0):(e.isHtml5&&y(e),I(e,r),!0)}function P(e,r,t){if(e&&(0!=e.value.length||e.swReq)){if(e&&0==e.value.length&&e.swReq)return!(e.swTypeIsInError=!0);var a=H(e.swType,"{","}"),s=e.value.split(a),n=-1,l=Number.MAX_VALUE;e.swMaxValue&&0<e.swMaxValue.length&&NaN!=(u=parseFloat(e.swMaxValue))&&(l=u);var u,i=Number.MIN_VALUE;e.swMinValue&&0<e.swMinValue.length&&NaN!=(u=parseFloat(e.swMinValue))&&(i=u);for(var o=0;o<s.length;o++){n++;for(var g=s[o],p=0,w=0;w<g.length;w++){n++;var h=g.charAt(w);"0"<=h&&h<="9"||"-"==h&&0==w&&(i<0||i==Number.MIN_VALUE)||!t&&"."==h&&0==p?"."==h&&p++:e.value=e.value.substring(0,n-1)}if(isNaN(g))return!(e.swTypeIsInError=!0);var v=parseFloat(g);if(i!=Number.MIN_VALUE&&v<i||l!=Number.MAX_VALUE&&l<v)return v.toString().length>=i.toString().length&&(e.value=e.value.substring(0,n-1)),!(e.swTypeIsInError=!0)}return I(e,r),!0}}function U(e){return 47<e&&e<58||64<e&&e<91||96<e&&e<123}function S(e,r){if(e&&0!=e.value.length){for(var t=0;t<e.value.length;t++)U(e.value.charCodeAt(t))||(e.value=e.value.substring(0,t)+e.value.substring(t+1,e.value.length));for(var a=0;a<e.value.length;a++)if(!U(e.value.charCodeAt(a)))return!(e.swTypeIsInError=!0);return!0}}function B(e,r){if(!e||0==e.value.length)return!0;var t=!1,a=!1,s=!1,n=!1,l="",u=H(e.swType,"{","}");if(0<u.length)for(var i=0;i<u.length;i++)"\\"==(l=u.charAt(i))&&(l=u.charAt(i+1),i++,"s"==l?t=!0:"t"==l?a=!0:"n"==l?s=!0:"r"==l&&(n=!0));t?u=u.replaceAll("\\s",""):a?u=u.replaceAll("\\t",""):s?u=u.replaceAll("\\n",""):n&&(u=u.replaceAll("\\r",""));for(var o=0;o<e.value.length;o++)U(l=e.value.charCodeAt(o))||u.includes(e.value.charAt(o))||32==l&&t||9==l&&a||10==l&&s||13==l&&n||(e.value=e.value.substring(0,o)+e.value.substring(o+1,e.value.length));for(var g=0;g<e.value.length;g++)if(l=e.value.charCodeAt(g),!U(l)&&!u.includes(e.value.charAt(g))&&!(32==l&&t||9==l&&a||10==l&&s||13==l&&n))return!(e.swTypeIsInError=!0);return!0}function X(e,r){return!e||0==e.value.length&&e.swMin&&e.swMin<=0||e.swMax&&e.value.length>e.swMax&&(e.value=e.value.substring(0,e.swMax)),!0}function z(e,r){if(e&&(0!=e.value.length||e.swReq)){if(e&&0==e.value.length&&e.swReq)return!(e.swTypeIsInError=!0);for(var t=!1,a=H(e.swType,"{","}").split(","),s=[],n=0;n<a.length;n++){constant=a[n];for(var l=0;l<e.value.length;l++){if(e.value.length>constant.length){s[n]=e.value.substring(0,constant.length);break}if(e.value.charAt(l)!=constant.charAt(l)){s[n]=e.value.substring(0,l);break}s[n]=e.value.substring(0,l+1)}if(a[n]==e.value){t=!0;break}}if(t)return I(e,r),!0;for(var u="",i=0;i<s.length;i++)s[i].length>u.length&&(u=s[i]);return e.value=u,!(e.swTypeIsInError=!0)}}function K(e,r){if(!e||0==e.value.length)return!0;var t=H(e.swType,"{","}");return!!new RegExp(t).test(e.value)||!(e.swTypeIsInError=!0)}function Z(e,r){m(e);var t=e.swType;return"c"==(t=1<t.length?t.substring(0,2):t)?F(e,r):"n"==t?W(e,r,!1):"n{"==t?P(e,r,!1):"i"==t?W(e,r,!0):"i{"==t?P(e,r,!0):"a"==t?S(e,r):"a{"==t?B(e,r):"s"==t||"o"==t?X(e,r):"k{"==t?z(e,r):"r{"==t||"x{"==t?K(e,r):"f{"==t?R(e,r,!1):"d{"==t&&_(e,r),e.swRelated&&D(e),1==e.swReq&&0==e.value.length&&(e.swReqIsInError=!0),0<e.value.length&&((0<e.swMaxValue&&isNaN(parseInt(e.value))||0<e.swMaxValue&&parseInt(e.value)>parseInt(e.swMaxValue))&&(e.swMaxValueIsInError=!0),(0<e.swMinValue&&isNaN(parseInt(e.value))||0<e.swMinValue&&parseInt(e.value)<parseInt(e.swMinValue))&&(e.swMinValueIsInError=!0),0<e.swMax&&e.value.length>e.swMax&&(e.swMaxIsInError=!0),0<e.swMin&&e.value.length<e.swMin&&(e.swMinIsInError=!0)),!(e.swTypeIsInError||e.swMaxIsInError||e.swMinIsInError||e.swReqIsInError||e.swMaxValueIsInError||e.swMinValueIsInError||e.swRelatedIsInError)||(r.elements.push(e),r.count+=1,!1)}function j(e,r,t,a){for(var s=!0,n=0;n<e.length;n++){var l=e.elements[n];if(("text"==l.type||"textarea"==l.type||"password"==l.type||"hidden"==l.type||"checkbox"==l.type||"select-one"==l.type||"email"==l.type||"number"==l.type||"url"==l.type||"tel"==l.type)&&!Z(l,t)&&(s=!1,-1!=t.numErrorsToDisplay&&t.count>=t.numErrorsToDisplay))break;if(-1!=t.numErrorsToDisplay&&t.count==t.numErrorsToDisplay)break}return 0==s&&d(t,r,a),s}var J=!1;function Y(r){var e;r.onkeydown=function(){var e=event.keyCode||event.charCode;if(109!=e&&173!=e||t(r,"-"),8!=e&&46!=e)return!(J=!1);J=!0},J||(e=M(!0),Z(r,e))}function G(e){for(var r=[],t=q(e,0,"AND",")&&(","(",")"),a=0;a<t.length;a++){for(var s=q(t[a],0,"OR",")||(","(",")"),n=0;n<s.length;n++)"||"==s[n]?s[n]="OR":s[n].startsWith("||(")?(s[n]=s[n].substring(3,s[n].length-1),s.splice(n,0,"OR")):s[n].endsWith(")||")&&(s[n]=s[n].substring(1,s[n].length-3),s.splice(n+1,0,"OR"));Array.prototype.push.apply(r,s)}for(var l=0;l<r.length;l++)"AND"!=r[l]&&"OR"!=r[l]?r[l]=r[l].split(":")[0]:(r.splice(l,1),l--);return r}function Q(e,r,t){if(e.getAttribute(r))return!1;r=document.createAttribute(r);return r.value=t,e.setAttributeNode(r),!0}function initSanwafui(){for(var e=0;e<document.forms.length;e++)for(var r=0;r<document.forms[e].length;r++){var t=document.forms[e].elements[r],a=C(b(t,"data-sw-related",""));if(a){m(t);var s=[];a.includes("(")?s=G(a):s[0]=a.split(":")[0];for(var n=0;n<s.length;n++){var l=o(s[n]);l&&Q(l,"sanwaf-change-listener","true")&&function(r){l.addEventListener("change",function(e){sanwafUiBlurElement(r)})}(t)}}(t.getAttribute("data-sw-type")||"email"==t.type||"number"==t.type||"url"==t.type||"tel"==t.type||t.getAttribute("minlength")||t.getAttribute("maxlength")||t.getAttribute("pattern")||""==t.getAttribute("required")||t.getAttribute("max")||t.getAttribute("min"))&&(Q(t,"sanwaf-input-listener","true")&&t.addEventListener("input",function(e){Y(e.target)}),Q(t,"sanwaf-focusout-listener","true")&&t.addEventListener("focusout",function(e){var r=M(!0);Z(e.target,r)?I(e.target,r):d(r,!0,!1)}))}}function isSanwafUiFormValid(e){return j(e,!1,M(),!1)}function isSanwafElementValid(e){return Z(e,M())}function sanwafUiBlurElement(e){var r=M(!0);I(e,r),Z(e,r)||d(r,!0,!1)}function sanwafGetFormErrors(e){var r=M(!0);return s(r),j(e,!1,r,!0)?"":JSON.stringify(r.msgarray)}function sanwafGetElementErrors(e){return I(e,err),s(err),Z(e,err)?"":JSON.stringify(err.msgarray)}