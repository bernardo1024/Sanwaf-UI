//Copyright 2010 Bernardo Sanchez Oakville Ontario, Last Modified Date xxx 2021 by Bernardo Sanchez
function isNumber(c) {
  if ((c >= '0') && (c <= '9')) {
    return true;
  }
  return false;
}

function insertVarInString(msg, s1, s2) {
  var i = msg.indexOf("%1");
  if (i >= 0) {
    msg = msg.substring(0, i) + s1 + msg.substring(i + 2, msg.length);
  }
  i = msg.indexOf("%2");
  if (i >= 0) {
    msg = msg.substring(0, i) + s2 + msg.substring(i + 2, msg.length);
  }
  return msg;
}

function getElementByIdOrName(idOrName) {
  if (!idOrName) {
    return;
  }
  var e = document.getElementById(idOrName);
  if (e) {
    return e;
  }
  var names = document.getElementsByName(idOrName);
  if (names.length == 1) {
    return names[0];
  }
  return names[0];
}

function associateLabels() {
  var labels = document.getElementsByTagName('LABEL');
  for (var i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor != '') {
      var e = getElementByIdOrName(labels[i].htmlFor);
      if (e) {
        e.label = labels[i];
      }
    }
  }
}

function cleanAllErrorElements(err) {
  var d = getElementByIdOrName(err.showOnPageElementId);
  if (err.errorActions.includes("showdiv")) {
    d.style.display = "none";
  }
  if (err.showOnPageSanwafTableElementId) {
    var display = getElementByIdOrName(err.showOnPageSanwafTableElementId);
    if (display) {
      display.innerHTML = "";
    }
  }

  var labels = [];
  var divs = document.getElementsByTagName('DIV');
  for (var i = 0; i < divs.length; i++) {
    if (divs[i].id == "sanwafuierrordisplay") {
      labels.push(divs[i].parentNode);
    }
  }

  for (var j = 0; j < labels.length; j++) {
    var labeltxt = labels[j].getAttribute("sanwafuilabeltxt");
    if (labeltxt) {
      labels[j].innerHTML = labeltxt;
    }
  }

  var fields = document.getElementsByTagName('INPUT');
  for (var k = 0; k < fields.length; k++) {
    if (fields[k].classList.contains(err.inputClass)) {
      fields[k].classList.remove(err.inputClass);
    }
  }
}

function cleanErrorElement(e, err) {
  var label = getLabel(e);
  if(label){
    var labeltxt = label.getAttribute("sanwafuilabeltxt");
    if (labeltxt) {
      label.innerHTML = labeltxt;
    }
  }

  if (e.classList.contains(err.inputClass)) {
    e.classList.remove(err.inputClass);
  }
}

function buildMsgFromArray(msgs, linesep) {
  var out = "";
  for (var i = 0; i < msgs.length; i++) {
    if (i == 0) {
      out += msgs[i];
    } else {
      out += linesep + msgs[i];
    }
  }
  return out;
}

function getLabel(e) {
  if (e.swLabelId) {
    return e.swLabelId;
  } else {
    return e.label;
  }
}
function doLabelAndHover(e, err, msgs, actions) {
  var label;
  var labeltxt = "";
  var hovertxt = "";
  var field;
  if (e.getAttribute("id")) {
    field = getElementByIdOrName(e.getAttribute("id"));
  } else {
    field = getElementByIdOrName(e.getAttribute("name"));
  }
  label = getLabel(field);
  if (label) {
    labeltxt = label.getAttribute("sanwafuilabeltxt");
    if (!labeltxt) {
      labeltxt = label.innerHTML;
      var att = document.createAttribute("sanwafuilabeltxt");
      att.value = label.innerHTML;
      label.setAttributeNode(att);
    }
    if (actions.includes("colorLabel")) {
      labeltxt = "<span id='sanwafuispan' class='" + err.labelClass + "'>" + labeltxt + "</span>";
    }

    if (actions.includes("hoverOnLabel")) {
      if(err.showlabel){
        if(e.swDisplay && e.swDisplay.length > 0){
          hovertxt += '"' + e.swDisplay + '"<br/>';
        }
        else{
          if(label.getAttribute("sanwafuilabeltxt").length > 0){
            hovertxt += '"' + label.getAttribute("sanwafuilabeltxt") + '"<br/>';
          }
        }
      }
      hovertxt += buildMsgFromArray(msgs, "<br/>");
    }

    if (!actions.includes("hoverOnLabel")) {
      label.innerHTML = labeltxt;
    } else {
      label.innerHTML = "<div id='sanwafuierrordisplay' class='" + err.tooltipClass + "'>" + labeltxt + "<span id='sanwafuispan' class='"
          + err.tooltipTextClass + "'>" + hovertxt + "</span></div>";
    }
  }
  if (actions.includes("colorInput")) {
    field.classList.add(err.inputClass);
  } else {
    if (field.classList.contains(err.inputClass)) {
      field.classList.remove(err.inputClass);
    }
  }
}

function setErrorItem(e, err, errorItem, defaultmsg, forceDefault, more1, more2) {
  var len = errorItem.msgs.length;
  if (e.swErrMsg && !forceDefault) {
    if (len == 0) {
      errorItem.msgs[len] = e.swErrMsg;
      if (more1 || more2) {
        errorItem.msgs[len] = insertVarInString(errorItem.msgs[len], more1, more2);
      }
    }
  } else {
    errorItem.msgs[len] = defaultmsg;
    if (more1 || more2) {
      errorItem.msgs[len] = insertVarInString(errorItem.msgs[len], more1, more2);
    }
  }
}

function renderSpecialChars(chars) {
  var more = "";
  if (chars.includes("\s")) {
    chars = chars.replace("\s", "");
    more += " [space]";
  }
  if (chars.includes("\t")) {
    chars = chars.replace("\t", "");
    more += " [tab]";
  }
  if (chars.includes("\n")) {
    chars = chars.replace("\n", "");
    more += " [linefeed]";
  }
  if (chars.includes("\r")) {
    chars = chars.replace("\r", "");
    more += " [carriage]";
  }
  var out = "";
  var didFirst = false;
  for (var i = 0; i < chars.length; i++) {
    if (!didFirst) {
      didFirst = true;
    } else {
      out += ", ";
    }
    out += "\"" + chars[i] + "\"";
  }
  out = out + more;
  return out;
}

function getRelatedError(e) {
  var blocks = [];
  var andOrBlocks = [];
  var andBlocks = parseBlocks(e.swRelated, 0, "AND", ")&&(", "(", ")");
  for (var i = 0; i < andBlocks.length; i++) {
    blocks = parseBlocks(andBlocks[i], 0, "OR", ")||(", "(", ")");
    for (var j = 0; j < blocks.length; j++) {
      if (blocks[j] == "||") {
        blocks[j] = "OR";
      } else if (blocks[j].startsWith("||(")) {
        blocks[j] = blocks[j].substring(3, blocks[j].length - 1);
        blocks.splice(j, 0, "OR");
      } else if (blocks[j].endsWith(")||")) {
        blocks[j] = blocks[j].substring(1, blocks[j].length - 3);
        blocks.splice(j + 1, 0, "OR");
      }
    }
    Array.prototype.push.apply(andOrBlocks, blocks);
  }

  var msg = "";
  for (var k = 0; k < andOrBlocks.length; k++) {
    if (andOrBlocks[k] == "AND" || andOrBlocks[k] == "OR") {
      msg += " " + andOrBlocks[k] + " ";
      continue;
    }
    var kv = andOrBlocks[k].split(":");
    var parent = getElementByIdOrName(kv[0]);
    msg += "'" + parent.label.innerHTML + "'";
  }

  return msg;
}

function getElementLabelValue(e){
  if(e.swDisplay && e.swDisplay.length > 0){
    return e.swDisplay;
  }
  var label;
  var labeltxt = "";
  var field;
  if (e.getAttribute("id")) {
    field = getElementByIdOrName(e.getAttribute("id"));
  } else {
    field = getElementByIdOrName(e.getAttribute("name"));
  }
  label = getLabel(field);
  if (label) {
    labeltxt = label.getAttribute("sanwafuilabeltxt");
    if (!labeltxt) {
      labeltxt = label.innerHTML;
      var att = document.createAttribute("sanwafuilabeltxt");
      att.value = label.innerHTML;
      label.setAttributeNode(att);
    }
    return labeltxt;
  }
  return "";
}

function buildErrorItemsArray(e, err, actions, suppressRender) {
  var errorItem = new Object();
  errorItem.id = e.id;
  errorItem.name = e.name;
  errorItem.disp = getElementLabelValue(e);
  errorItem.msgs = [];

  if (e.swTypeIsInError) {
    if (e.swType == "c") {
      setErrorItem(e, err, errorItem, err.type_c, false, "", "");
    } else if (e.swType == "n") {
      setErrorItem(e, err, errorItem, err.type_n, false, "", "");
    } else if (e.swType == "i") {
      setErrorItem(e, err, errorItem, err.type_i, false, "", "");
    } else if (e.swType == "a") {
      setErrorItem(e, err, errorItem, err.type_a, false, "", "");
    }
    var type = e.swType.substring(0, 2);
    var extra = parse(e.swType, "{", "}");
    if (type == "n{") {
      setErrorItem(e, err, errorItem, err.type_nn, false, renderSpecialChars(extra), "");
    } else if (type == "i{") {
      setErrorItem(e, err, errorItem, err.type_ii, false, renderSpecialChars(extra), "");
    } else if (type == "a{") {
      setErrorItem(e, err, errorItem, err.type_aa, false, renderSpecialChars(extra), "");
    } else if (type == "k{") {
      setErrorItem(e, err, errorItem, err.type_k, false, extra.replace(",", "\" or \""), "");
    } else if (type == "r{" || type == "x{") {
      setErrorItem(e, err, errorItem, err.type_r, false, extra, "");
    } else if (type == "f{") {
      setErrorItem(e, err, errorItem, err.type_f, false, extra, "");
    } else if (type == "d{") {
      setErrorItem(e, err, errorItem, err.type_d, false, extra, "");
    }
  }

  if (e.swReqIsInError) {
    setErrorItem(e, err, errorItem, err.required, false, "", "");
  }
  if (e.swMaxIsInError || e.swMinIsInError) {
    if (e.swMax == e.swMin) {
      setErrorItem(e, err, errorItem, err.maxMinEqualMsg, false, e.swMin, e.swMax);
      if (e.swErrMsg) {
        setErrorItem(e, err, errorItem, "", false, e.swMin, e.swMax);
      }
    } else {
      setErrorItem(e, err, errorItem, err.max, false, e.swMin, e.swMax);
    }
  }
  if (e.swMaxValueIsInError || e.swMinValueIsInError) {
    setErrorItem(e, err, errorItem, err.maxVal, false, e.swMinValue, e.swMaxValue);
  }

  if (e.swRelatedIsInError) {
    var labeltxt;
    if (!e.swRelated.startsWith("(")) {
      var kv = e.swRelated.split(":");
      var rel = getElementByIdOrName(kv[0]);
      if (!suppressRender) {
        if (rel) {
          if (rel.getAttribute("id")) {
            var label = getElementByIdOrName(rel.getAttribute("id")).label;
            labeltxt = label.getAttribute("sanwafuilabeltxt");
            if (!labeltxt) {
              labeltxt = label.innerHTML;
            }
          }
        }
      }
      if (kv[1] == "=") {
        if (e.value != rel.value) {
          setErrorItem(e, err, errorItem, err.relNotEqual, false, getElementLabelValue(e), getElementLabelValue(rel));
        } else {
          setErrorItem(e, err, errorItem, err.relNotEqual, false, getElementLabelValue(e), getElementLabelValue(parentElement));
        }
      } else {
        setErrorItem(e, err, errorItem, err.rel, false, "'" + labeltxt + "'", "");
      }
    } else {
      setErrorItem(e, err, errorItem, err.rel, false, getRelatedError(e), "");
    }
  }

  err.msgarray.push(errorItem);
  if (!suppressRender) {
    doLabelAndHover(e, err, errorItem.msgs, actions)
  }
}

function buildErrorMsg(e, err, type) {
  var out = "";
  if (type == "html") {
    out += "<table class='" + err.sanwafErrorTableClass + "'>";
  } else {
    if (err.popheader1) {
      out += err.popheader1;
    }
    if (err.popheader2) {
      out += "\n" + err.popheader2;
    }
  }
  for (var i = 0; i < err.msgarray.length; i++) {
    if (type == "html") {
      out += "<tr><td class='" + err.sanwafErrorTableTdKeyClass + "'>" + err.msgarray[i].disp + "</td><td class='" + err.sanwafErrorTableTdDescClass + "'>"
          + buildMsgFromArray(err.msgarray[i].msgs, "<br/>") + "</td></tr>";
    } else {
      out += "\n\"" + err.msgarray[i].disp + "\"\n\t" + buildMsgFromArray(err.msgarray[i].msgs, "\n\t");
    }
  }
  if (type == "html") {
    out += "</table>";
  }
  return out;
}

function handleErrors(err, doBlurActions, suppressRender) {
  var actions = err.errorActions;
  if (doBlurActions) {
    actions = err.blurActions;
  }

  for (var i = 0; i < err.elements.length; i++) {
    buildErrorItemsArray(err.elements[i], err, actions, suppressRender);
  }

  if (suppressRender) {
    return;
  }

  if (actions.includes("showOnPage")) {
    var d = getElementByIdOrName(err.showOnPageElementId);
    if (d) {
      d.style.display = "block";
    }
    if (err.errorActions.includes("showOnPageSanwafTable")) {
      var e = getElementByIdOrName(err.showOnPageSanwafTableElementId);
      if (e) {
        e.innerHTML = buildErrorMsg(e, err, "html");
      }
    }
  }
  if (err.msgarray.length > 0 && actions.includes("alertWithPopup")) {
    alert(buildErrorMsg(e, err, "alertWithPopup"));
  }
}

function getAttribute(elem, att, def) {
  if(def == undefined){
    def = "";
  }
  if (elem) {
    var s = elem.getAttribute(att);
    if (s != undefined && s.length > 0) {
      return s;
    }
  }
  return def;
}

function loadTags(e) {
  loadHtml5Tags(e);
  e.swDisplay = getAttribute(e, "data-sw-display", e.swDisplay);
  e.swLabelId = getElementByIdOrName(getAttribute(e, "data-sw-label-id", e.swLabelId));

  e.swErrMsg = getAttribute(e, "data-sw-err-msg", e.swErrMsg);
  e.swType = getAttribute(e, "data-sw-type", e.swType);
  e.swTypeIsInError = false;
  e.swMax = getAttribute(e, "data-sw-max-length", e.swMax);
  e.swMaxIsInError = false;
  e.swMin = getAttribute(e, "data-sw-min-length", e.swMin);
  e.swMinIsInError = false;
  
  if(!e.swReq){
    e.swReq = getAttribute(e, "data-sw-required", false);
  }
  
  var s = e.swReq + "";
  if (s.toLowerCase() == "false") {
    e.swReq = false;
  } else {
    e.swReq = true;
  }
  e.swReqIsInError = false;
  
  e.swMaskErr = getAttribute(e, "data-sw-mask-err", "");
  
  if (e.swType.startsWith('f{')) {
    e.swFormat = e.swType.substring(2, e.swType.length - 1);
  } else if (e.swType.startsWith('d{')) {
    e.swDepFormat = e.swType.substring(2, e.swType.length - 1);
  }

  e.swMaxValue = getAttribute(e, "data-sw-max-value", e.swMaxValue);
  e.swMaxValueIsInError = false;
  e.swMinValue = getAttribute(e, "data-sw-min-value", e.swMinValue);
  e.swMinValueIsInError = false;
  e.swRelated = removeRelatedSpace(getAttribute(e, "data-sw-related", e.swRelated));
  e.swRelatedIsInError = false;
}

function loadHtml5Tags(e) {
  if (e.type == "email") {
    e.swType = 'r{[^@\\s]+@[^@\\s]+\\.[^@\\s]+}';
    e.swErrMsg = "Invalid Email Entered";
    e.isHtml5 = true;
  } else if (e.type == "number") {
    e.swType = 'n';
    e.isHtml5 = true;
  } else if (e.type == "url") {
    e.swType = 'r{https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)}';
    e.swErrMsg = "Invalid URL Entered";
    e.isHtml5 = true;
  } else if (e.type == "tel") {
    e.swType = 'r{\\(?(\\d{3})\\)?[-\\.\\s]?(\\d{3})[-\\.\\s]?(\\d{4})}';
    e.swErrMsg = "Invalid Telephone Number Entered";
    e.isHtml5 = true;
  } 
  
  var pattern = getAttribute(e, "pattern", "");
  if (pattern && pattern.length > 0) {
    e.swType = 'r{' + pattern + '}';
    e.isHtml5 = true;
  } 

  e.swMin = getAttribute(e, "minlength", "");
  if(e.minlength && e.minlength.length > 0){
    e.isHtml5 = true;
  }

  e.swMax = getAttribute(e, "maxlength", "");
  if(e.maxlength && e.maxlength.length > 0){
    e.isHtml5 = true;
  }

  e.swReq = e.getAttribute("required");
  if(e.swReq == ""){
    e.swReq = true;
    e.isHtml5 = true;
  }
  else{
    e.swReq = false;
  }

  e.swMaxValue = getAttribute(e, "max", "");
  if(e.swMaxValue && e.swMaxValue.length > 0){
    e.swType = 'n';
    e.isHtml5 = true;
  }

  e.swMinValue = getAttribute(e, "min", "");
  if(e.swMinValue && e.swMinValue.length > 0){
    e.swType = 'n';
    e.isHtml5 = true;
  }
}

function setHtml5AttributeValue(e, val){
  var att = document.createAttribute("data-sw-html5-is-neg");
  att.value = val;
  e.setAttributeNode(att);
}

  
function setHtml5Attribute(e){
  var att = document.createAttribute("data-sw-html5-value");
  att.value = e.value;
  e.setAttributeNode(att);
}

function loadGlobalErrorSettings(forElementOnly) {
  var config = getElementByIdOrName("sanwafUiConfig");
  var err = new Object;
  err.count = 0;
  err.elements = [];
  err.msgarray = [];

  err.numErrorsToDisplay = getAttribute(config, "data-sw-numErrorsToDisplay");
  if (err.numErrorsToDisplay == "") {
    err.numErrorsToDisplay = -1;
  }

  err.errorActions = getAttribute(config, "data-sw-errorActions", "");
  if (err.errorActions == "") {
    err.errorActions = "hoverOnLabel,hoverShowLabel,colorLabel,colorInput";
  }

  err.blurActions = getAttribute(config, "data-sw-blurActions", "");
  if (err.blurActions == "") {
    err.blurActions = "hoverOnLabel,hoverShowLabel,colorLabel,colorInput";
  }

  err.labelClass = getAttribute(config, "data-sw-labelClass", "sanwafuiLabel");
  err.inputClass = getAttribute(config, "data-sw-inputClass", "sanwafuiInput");
  err.tooltipClass = getAttribute(config, "data-sw-tooltipClass", "sawafuiTooltip");
  err.tooltipTextClass = getAttribute(config, "data-sw-tooltipTextClass", "tooltiptext");
  err.sanwafErrorTableClass = getAttribute(config, "data-sw-sanwafErrorTableClass", "sanwafuiErrorTable");
  err.sanwafErrorTableTdKeyClass = getAttribute(config, "data-sw-sanwafErrorTableTdKeyClass", "sanwafuiErrorTableTdKey");
  err.sanwafErrorTableTdDescClass = getAttribute(config, "data-sw-sanwafErrorTableTdDescClass", "sanwafuiErrorTableTdDesc");

  err.showOnPageElementId = getAttribute(config, "data-sw-showOnPageElementId", "sanwafuierrorwrapper");
  err.showOnPageSanwafTableElementId = getAttribute(config, "data-sw-showOnPageSanwafTableElementId", "sanwafuierrortable");
  if (err.errorActions.includes("hoverShowLabel")) {
    err.showlabel = true;
  } else {
    err.showlabel = false;
  }

  err.popheader1 = getAttribute(config, "data-sw-errorPopHeader1", "Please correct the following errors");
  err.popheader2 = getAttribute(config, "data-sw-errorPopHeader2", "---------------------------------------------------------------------------");
  err.min = getAttribute(config, "data-sw-errorMinLength", "Must be between %1 and %2 chars");
  err.max = getAttribute(config, "data-sw-errorMaxLength", "Must be between %1 and %2 chars");
  err.maxMinEqualMsg = getAttribute(config, "data-sw-errorMaxMinLengthEqual", "Must be %1 chars");
  err.required = getAttribute(config, "data-sw-errorRequired", "Is a Required Field");
  err.minVal = getAttribute(config, "data-sw-errorMinValue", "Must be between %1 and %2");
  err.maxVal = getAttribute(config, "data-sw-errorMaxValue", "Must be between %1 and %2");
  err.rel = getAttribute(config, "data-sw-errorRelated", "Is required when %1 is entered");
  err.relNotEqual = getAttribute(config, "data-sw-errorRelatedNotEqual", "%1 must have the same value as %2");
  err.type_c = getAttribute(config, "data-sw-errorTypeChar", "Must be a single character");
  err.type_n = getAttribute(config, "data-sw-errorTypeNumeric", "Must be numeric");
  err.type_nn = getAttribute(config, "data-sw-errorTypeNumericDelimited", "Must be a list of numeric value(s) delimted by %1");
  err.type_i = getAttribute(config, "data-sw-errorTypeInteger", "Must be an integer");
  err.type_ii = getAttribute(config, "data-sw-errorTypeIntegerDelimited", "Must be a list of integer value(s) delimted by %1");
  err.type_a = getAttribute(config, "data-sw-errorTypeAlphanumeric", "Must be alphanumeric");
  err.type_aa = getAttribute(config, "data-sw-errorTypeAlphanumericAndMore", "Must be alphanumeric or the following: %1");
  err.type_k = getAttribute(config, "data-sw-errorTypeConstant", "Must be must be one of the following: \"%1\"");
  err.type_r = getAttribute(config, "data-sw-errorTypeRegex", "Must be must match the regex: \"%1\"");
  err.type_f = getAttribute(config, "data-sw-errorTypeFormat", "Must have the format: %1");
  err.type_d = getAttribute(config, "data-sw-errorTypeDependentFormat", "Must have the format: %1");

  associateLabels();
  if (!forElementOnly) {
    cleanAllErrorElements(err);
  }
  return err;
}

function trimAlpha(e) {
  if (e.value.length <= 0 || !e) {
    return;
  }

  for (var i = 0; i < e.value.length; i++) {
    if (!isNumber(e.value.charAt(i))) {
      if (i == 0) {
        e.value = e.value.substring(1, e.value.length);
      } else {
        if (i == e.value.length - 1) {
          e.value = e.value.substring(0, i);
          break;
        } else {
          e.value = e.value.substring(0, i) + e.value.substring(i + 1, e.value.length);
        }
      }
      i--;
    }
  }
}

function trimSpaces(e) {
  if (e.value.length <= 0 || !e) {
    return;
  }

  for (var i = 0; i < e.value.length; i++) {
    if (e.value.charAt(i) == " ") {
      if (i == 0) {
        e.value = e.value.substring(1, e.value.length);
      } else {
        if (i == e.value.length - 1) {
          e.value = e.value.substring(0, i);
          break;
        } else {
          e.value = e.value.substring(0, i) + e.value.substring(i + 1, e.value.length);
        }
      }
      i--;
    }
  }
}

function handleEscapedChars(s, forFormat) {
  if (forFormat) {
    s = s.replaceAll(/\\#/g, "\t");
    s = s.replaceAll(/\\A/g, "\n");
    s = s.replaceAll(/\\a/g, "\r");
    s = s.replaceAll(/\\c/g, "\f");
    s = s.replaceAll("\\[", "\b");
    s = s.replaceAll("\\]", "\v");
    s = s.replaceAll("\\|", "\0");
    s = s.replaceAll("\\x", "\1");
    s = s.replaceAll("\\:", "\2");
    s = s.replaceAll("\\=", "\3");
    s = s.replaceAll("\\(", "\4");
    s = s.replaceAll("\\)", "\5");
    s = s.replaceAll("\\+", "\6");
    s = s.replaceAll("\\-", "\7");
    s = s.replaceAll("\\;", "\016");

  } else {
    s = s.replaceAll("\t", "#");
    s = s.replaceAll("\n", "A");
    s = s.replaceAll("\r", "a");
    s = s.replaceAll("\f", "c");
    s = s.replaceAll("\b", "[");
    s = s.replaceAll("\v", "]");
    s = s.replaceAll("\0", "|");
    s = s.replaceAll("\1", "x");
    s = s.replaceAll("\2", ":");
    s = s.replaceAll("\3", "=");
    s = s.replaceAll("\4", "(");
    s = s.replaceAll("\5", ")");
    s = s.replaceAll("\6", "+");
    s = s.replaceAll("\7", "-");
    s = s.replaceAll("\016", ";");
  }
  return s;
}

function parseFormat(format) {
  var blocks = [];
  var pos = 0;
  var last = 0;
  var i = 0;
  var end = 0;
  var dash = 0;

  format = resolveDateVariables(format);

  while (true) {
    var block = "";
    var numDigits = 0;

    pos = format.indexOf("#", last);
    if (pos < 0) {
      if (last < format.length) {
        Array.prototype.push.apply(blocks, format.substring(last, format.length).split(''));
      }
      break;
    }

    if (format.charAt(pos + 1) == '[') {
      end = format.indexOf("]", pos);

      var temp = format.substring(pos + 2, end);
      if (temp.includes(',')) {
        numDigits = 0;
      } else {
        dash = format.indexOf("-", pos);
        numDigits = end - (dash + 1);
      }
      block = format.substring(last, end + 1);
      last = end + 1;
    } else {
      block = format.substring(last, pos + 1);
      last = pos + 1;
    }

    if (!block.startsWith("#")) {
      var x = block.indexOf("#");
      var s = block.substring(0, x);
      Array.prototype.push.apply(blocks, s.split(''));
      i = blocks.length;
      block = block.substring(x, block.length);
    }

    blocks[i] = block;
    i++;
    for (var j = 0; j < numDigits - 1; j++) {
      blocks[i] = '';
      i++;
    }
  }
  return blocks;
}

function resolveDateVariables(format) {
  var today = new Date();
  var newMdy;
  var parsedValue = format;
  var dateOrder = [ 'dd', 'mm', 'yyyy', 'yy' ];

  for (var i = 0; i < dateOrder.length; i++) {
    var mdy = dateOrder[i];
    var last = 0;
    while (true) {
      var startMdyReplacePos = 0;
      var endMdyReplacePos = 0;
      last = parsedValue.indexOf(mdy);
      if (last < 0) {
        break;
      }
      startMdyReplacePos = last;
      endMdyReplacePos = last + mdy.length;

      if (mdy == 'yy') {
        newMdy = parseInt(today.getFullYear().toString().substr(-2));
        last += 2;
        newMdy = adjustDate(parsedValue, last, newMdy);
      } else if (mdy == 'yyyy') {
        newMdy = parseInt(today.getFullYear());
        last += 4;
        newMdy = adjustDate(parsedValue, last, newMdy);
      } else if (mdy == 'mm') {
        newMdy = parseInt(today.getMonth()) + 1;
        last += 2;
        if (newMdy > 12) {
          newMdy = 12;
        }
      } else if (mdy = 'dd') {
        newMdy = parseInt(today.getDate());
        last += 2;
        newMdy = adjustDate(parsedValue, last, newMdy);
        if (newMdy > 31) {
          newMdy = 31;
        }
      }

      if (parsedValue.substring(last, last + 1) == "(") {
        var endOfNum = parsedValue.indexOf(")", last);
        parsedValue = parsedValue.substring(0, startMdyReplacePos) + newMdy + parsedValue.substring(endOfNum + 1, parsedValue.length);
      } else {
        parsedValue = parsedValue.substring(0, startMdyReplacePos) + newMdy + parsedValue.substring(endMdyReplacePos, parsedValue.length);
      }
    }
  }
  return parsedValue;
}
function adjustDate(parsedValue, last, newMdy) {
  if (parsedValue.substring(last, last + 1) == "(") {
    var endOfNum = parsedValue.indexOf(")", last);
    var num = parsedValue.substring(last + 2, endOfNum);
    var parsedNum = parseInt(num);
    var arith = parsedValue.substring(last + 1, last + 2);
    if (arith == "+") {
      newMdy += parsedNum;
    } else if (arith == "-") {
      newMdy -= parsedNum;
    }
  }
  return newMdy;
}
function isFormatValid(e, err, isDepFormat) {
  if (e.value.length == 0 && e.swReq == false) {
    return;
  }

  var format = handleEscapedChars(e.swFormat, true);
  var formats = format.split("||");
  var formatsCurrentValue = [];
  var formatsInError = [];
  var formatErrorPos = [];
  formatErrorPos.length = formats.length;
  for (var p = 0; p < formatErrorPos.length; p++) {
    formatErrorPos[p] = Number.MAX_VALUE;
  }

  for (var formatCount = 0; formatCount < formats.length; formatCount++) {
    formatsInError[formatCount] = false;
    formatsCurrentValue[formatCount] = e.value;

    var blocks = parseFormat(formats[formatCount]);
    var formatlen = blocks.length;

    if (formatsCurrentValue[formatCount].length == 0 && formatlen > 0 && e.swReq == true) {
      formatsInError[formatCount] = true;
      continue;
    }
    if (formatsCurrentValue[formatCount].length > formatlen) {
      formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, formatlen);
    }

    var i = 0;
    for (i = 0; i < formatsCurrentValue[formatCount].length; i++) {
      var c = formatsCurrentValue[formatCount].charAt(i);
      var f = blocks[i];

      if (f == "" && (c > '9' || c < '0')) {
        var b = i;
        var zeroPadCount = 0;
        while (true) {
          var cc = formatsCurrentValue[formatCount].charAt(b);
          if (blocks[b] == "") {
            formatsCurrentValue[formatCount] = "0" + formatsCurrentValue[formatCount];
            zeroPadCount++;
          } else {
            break;
          }
          b--;
        }
        continue;
      } else if (f == "") {
        continue;
      }

      if (!f) {
        formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, blocks.length);
        return;
      }

      if (f.startsWith("#[")) {
        doNumRangePart(c, f, blocks, formatsCurrentValue, formatsInError, formatErrorPos, formatCount, i);
      } else {
        doNormalFormatPart(c, f, blocks, formatsCurrentValue, formatsInError, formatErrorPos, formatCount, i);
      }
    }

    if (formats.length == 1) {
      while (true) {
        var nextBlock = blocks[i];
        if (!nextBlock || nextBlock.startsWith("#") || nextBlock.startsWith("A") || nextBlock.startsWith('a') || nextBlock.startsWith('c')
            || nextBlock.startsWith('x') || i > formatsCurrentValue[formatCount].length) {
          break;
        }
        formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, formatsCurrentValue[formatCount].length) + blocks[i];
        i++
      }
    }

    if (formatsCurrentValue[formatCount].length != formatlen) {
      formatsInError[formatCount] = true;
    }
  }

  var formatInError = true;
  var maxSize = -1;
  var maxErrorPos = -1;
  var formatWithMaxSize;
  for (var j = 0; j < formatErrorPos.length; j++) {
    if (formatErrorPos[j] > maxErrorPos || formatsCurrentValue[j].length > maxSize) {
      maxSize = formatsCurrentValue[j].length;
      maxErrorPos = formatErrorPos[j];
      formatWithMaxSize = formatsCurrentValue[j];
      formatInError = formatsInError[j];
    }
  }

  if (formatWithMaxSize) {
    e.value = formatWithMaxSize;
  } else {
    e.value = "";
  }

  if (formatInError) {
    e.swTypeIsInError = true;
    return;
  }

  cleanErrorElement(e, err);
}

function doNumRangePart(c, f, blocks, formatsCurrentValue, formatsInError, formatErrorPos, formatCount, i) {
  if (c > '9' || c < '0') {
    formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i)
        + formatsCurrentValue[formatCount].substring(i + 1, formatsCurrentValue[formatCount].length);
    return;
  }
  f = f.substring(2, f.length - 1);
  var ff = [];
  if (f.includes(',')) {
    ff = f.split(',');
    if (!ff.includes(c)) {
      formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i)
          + formatsCurrentValue[formatCount].substring(i + 1, formatsCurrentValue[formatCount].length);
    }
    return;
  }
  ff = f.split('-');
  var minNum = parseInt(ff[0]);
  var maxNum = parseInt(ff[1]);
  var maxLen = (maxNum + "").length;
  var maxLenDynamic = maxLen;
  var numAddedZeros = 0;
  var minLen = (minNum + "").length;
  var allowedZeros = maxLen - minLen;
  var zeroCount = 0;
  var countZeros = true;
  var cNewMax = c;
  var cNewMin = c;
  if (countZeros && parseInt(c) == 0) {
    zeroCount++;
  } else {
    countZeros = false;
  }

  if (maxLen > 1) {
    for (var j = 1; j < maxLen; j++) {
      var n = formatsCurrentValue[formatCount].charAt(i + j);
      if (isNumber(n)) {
        if (countZeros && parseInt(n) == 0) {
          zeroCount++;
        } else {
          countZeros = false;
        }
        cNewMax += n;
        cNewMin += n;
      } else {
        cNewMax += "9";
        cNewMin += "0";
        numAddedZeros++;
        maxLenDynamic--;
      }
    }

    var iNewMax = parseInt(cNewMax);
    var iNewMin = parseInt(cNewMin);

    if ((iNewMin == 0 && zeroCount <= allowedZeros) || (iNewMin >= minNum && iNewMin <= maxNum)) {
      i += maxLenDynamic - 1;
    } else {
      var numBeforeAddingZeros = parseInt(cNewMin.substring(0, cNewMin.length - numAddedZeros));
      if (numBeforeAddingZeros < maxNum && numBeforeAddingZeros >= minNum) {
        formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i + maxLenDynamic - 1) + "0"
            + formatsCurrentValue[formatCount].substring(i + maxLenDynamic - 1, formatsCurrentValue[formatCount].length);
      } else {
        if (iNewMax < minNum || iNewMin > maxNum) {
          formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i + maxLenDynamic - 1);
        }
      }
      setFormatError(formatsInError, formatErrorPos, formatCount, i);
      return;
    }
  } else {
    if (parseInt(c) >= minNum && parseInt(c) <= maxNum) {
      i += maxLen - 1;
    } else {
      formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i + maxLen - 1);
      setFormatError(formatsInError, formatErrorPos, formatCount, i);
      return;
      ;
    }
  }
}

function doNormalFormatPart(c, f, blocks, formatsCurrentValue, formatsInError, formatErrorPos, formatCount, i) {
  if (f != '#' && f != 'A' && f != 'a' && f != 'x' && f != 'c' && c != handleEscapedChars(f, false)) {
    formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i) + handleEscapedChars(f, false)
        + formatsCurrentValue[formatCount].substring(i, formatsCurrentValue[formatCount].length);
    return;
  }
  if (f == 'x') {
    return;
  }
  if (f == '#' && c >= '0' && c <= '9') {
    return;
  }
  if (f == '#' && (c < '0' || c > '9')) {
    setFormatError(formatsInError, formatErrorPos, formatCount, i);
    formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i)
        + formatsCurrentValue[formatCount].substring(i + 1, formatsCurrentValue[formatCount].length);
    i--;
    return;
  }

  if ((f == 'A' || f == 'a' || f == 'c') && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))) {
    if (f == 'A') {
      c = c.toUpperCase();
    } else if (f == 'a') {
      c = c.toLowerCase();
    }
    formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i) + c
        + formatsCurrentValue[formatCount].substring(i + 1, formatsCurrentValue[formatCount].length);
  } else if (f == 'A' || f == 'a' || f == 'c') {
    setFormatError(formatsInError, formatErrorPos, formatCount, i);
    formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i)
        + formatsCurrentValue[formatCount].substring(i + 1, formatsCurrentValue[formatCount].length);
    i--;
  } else if (f == '#' && !(c >= '0' && c <= '9')) {
    setFormatError(formatsInError, formatErrorPos, formatCount, i);
    formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i)
        + formatsCurrentValue[formatCount].substring(i + 1, formatsCurrentValue[formatCount].length);
    i--;
  } else if (f == '#') {
    setFormatError(formatsInError, formatErrorPos, formatCount, i);
    formatsCurrentValue[formatCount] = formatsCurrentValue[formatCount].substring(0, i)
        + formatsCurrentValue[formatCount].substring(i + 1, formatsCurrentValue[formatCount].length);
    i--;
  }
}

function setFormatError(formatsInError, formatErrorPos, formatCount, i) {
  if (!formatsInError[formatCount]) {
    formatsInError[formatCount] = true;
    formatErrorPos[formatCount] = i;
  }
}

function parseBlocks(s, start, andOr, match, reverseMatch, forwardMatch) {
  var blocks = [];
  var block;
  var lastPos = start;
  while (true) {
    var pos = s.indexOf(match, lastPos);
    if (pos > 0) {
      var lastIndexOf = s.lastIndexOf(reverseMatch, pos);
      if (lastIndexOf != lastPos) {
        block = s.substring(lastPos, lastIndexOf);
        blocks.push(block);
      }
      block = s.substring(lastIndexOf + reverseMatch.length, pos);
      blocks.push(block);
      blocks.push(andOr);
      var end = s.indexOf(forwardMatch, pos + match.length);
      block = s.substring(pos + match.length, end);
      blocks.push(block);
      lastPos = end + forwardMatch.length;
      if (lastPos == s.length) {
        break;
      }
    } else {
      if (lastPos + 1 == s.length) {
        break;
      }
      block = s.substring(lastPos, s.length);
      blocks.push(block);
      break;
    }
  }
  return blocks;
}

function removeRelatedSpace(related) {
  related = related.trim();
  related = related.replaceAll(/\)\s+&&\s+\(/g, ")&&(");
  related = related.replaceAll(/\s+\|\|\s+/g, "||");
  related = related.replaceAll(/\s+:\s+/g, ":");
  related = related.replaceAll(/\(\s+/g, "(");
  related = related.replaceAll(/\s+\)/g, ")");
  return related;
}
function isDependentFormatValid(e, err) {
  var deps = e.swDepFormat.split(":");
  var element = deps[0];
  var deps = deps[1].split(";");
  value = getElementByIdOrName(element).value;
  if (!value || value.length == 0) {
    return;
  }
  for (var i = 0; i < deps.length; i++) {
    if (value == deps[i].split("=")[0]) {
      e.swFormat = deps[i].split("=")[1];
      isFormatValid(e, err, true);
      break;
    }
  }
}
function isRelateValid(e) {
  var blocks = [];
  var andOrBlocks = [];
  var andBlocks = parseBlocks(e.swRelated, 0, "AND", ")&&(", "(", ")");
  for (var i = 0; i < andBlocks.length; i++) {
    blocks = parseBlocks(andBlocks[i], 0, "OR", ")||(", "(", ")");
    for (var j = 0; j < blocks.length; j++) {
      if (blocks[j] == "||") {
        blocks[j] = "OR";
      } else if (blocks[j].startsWith("||(")) {
        blocks[j] = blocks[j].substring(3, blocks[j].length - 1);
        blocks.splice(j, 0, "OR");
      } else if (blocks[j].endsWith(")||")) {
        blocks[j] = blocks[j].substring(1, blocks[j].length - 3);
        blocks.splice(j + 1, 0, "OR");
      }
    }
    Array.prototype.push.apply(andOrBlocks, blocks);
  }

  var isRequired = false;
  var orRequired = [];
  var andRequired = [];
  var nextIsAnd = false;
  var andFound = false;
  for (var k = 0; k < andOrBlocks.length; k++) {
    isRequired = isRelatedBlockMakingMeRequired(andOrBlocks[k], e);
    if (isRequired) {
      if (nextIsAnd) {
        andRequired[andRequired.length] = true;
      } else {
        orRequired[orRequired.length] = true;
      }
    }
    nextIsAnd = false;
    if (andOrBlocks[k + 1] == "OR") {
      k++;
      continue;
    }
    if (andOrBlocks[k + 1] == "AND") {
      k++;
      nextIsAnd = true;
      andFound = true;
    }
  }

  if (andRequired.length > 0 || andFound == true) {
    if (andRequired.length == 0) {
      return true;
    }
    for (var l = 0; l < andRequired.length; l++) {
      if (andRequired[l] && e.value.length == 0) {

        for (var m = 0; m < orRequired.length; m++) {
          if (orRequired[m]) {
            if (e.value.length == 0) {
              e.swRelatedIsInError = true;
              return false;
            }
          }
        }
      }
    }
  } else {
    for (var n = 0; n < orRequired.length; n++) {
      if (orRequired[n]) {
        if (e.value.length == 0) {
          e.swRelatedIsInError = true;
          return false;
        }
      }
    }
  }

  return true;
}

function isRelatedBlockMakingMeRequired(block, e) {
  var tagKeyValuePair = block.split(":");
  var parentElement = getElementByIdOrName(tagKeyValuePair[0]);

  if (!parentElement) {
    return;
  }
  var parentValue = parentElement.value;
  if (parentElement.type == "checkbox") {
    parentValue = "" + parentElement.checked;
  }

  var childLen = 0;
  if (e.value.length) {
    childLen = e.value.length;
  }

  if (tagKeyValuePair[1]) {
    if (tagKeyValuePair[1] == '=') {
      if (e.value.length > 0 && e.value == parentValue) {
        return false;
      } else {
        if (parentValue.length > 0) {
          e.swRelatedIsInError = true;
          return true;
        }
        var parentReq = parentElement.getAttribute("swReq");
        if (parentReq && e.value.length == 0) {
          e.swRelatedIsInError = true;
          return true;
        }
        return false;
      }
    }

    var or = tagKeyValuePair[1].split("||");
    for (var i = 0; i < or.length; i++) {
      if (or[i] == parentValue) {
        return true
      }
    }
    return false;
  }
  var parentIsReq = parentElement.getAttribute("data-sw-required");
  if (parentIsReq && parentIsReq == true && childLen == 0) {
    e.swRelatedIsInError = true;
    return false;
  }
  if (parentValue.length > 0 && childLen == 0) {
    e.swRelatedIsInError = true;
    return false;
  }
}

function parse(s, start, end) {
  var s1 = s.indexOf(start);
  var s2 = s.lastIndexOf(end);
  if (s2 > s1 && s1 >= 0) {
    return s.substring(s1 + start.length, s2);
  }
  return "";
}

function isCharValid(e, err) {
  if (!e || e.value.length == 0) {
    return true;
  }
  if (e.value.length > 1) {
    e.value = e.value.substring(e.value.length - 1, e.value.length);
  }
  if (e.value.length != 1) {
    e.swTypeIsInError = true;
    return false
  }
  return true;
}
function isNumberValid(e, err, isInt) {
  //some browsers dont return the value for numeric items if they arent numeric
  if(e.isHtml5){
    if(e.value.length == 0){
      var last = getAttribute(e, "data-sw-html5-value", "");
      var neg = getAttribute(e, "data-sw-html5-is-neg", "");
      if(neg == "-" && last == ""){
        return;
      }
      e.value = last;
      return;
    }
  }
  if ((!e || e.value.length == 0) && !e.swReq) {
    return true;
  }
  if (e && e.value.length == 0 && e.swReq) {
    e.swTypeIsInError = true;
    return false;
  }
  var max = Number.MAX_VALUE;
  if (e.swMaxValue && e.swMaxValue.length > 0) {
    var temp = parseFloat(e.swMaxValue);
    if (temp != NaN) {
      max = temp;
    }
  }
  var min = Number.MIN_VALUE;
  if (e.swMinValue && e.swMinValue.length > 0) {
    var temp = parseFloat(e.swMinValue);
    if (temp != NaN) {
      min = temp;
    }
  }
  var dotCount = 0;
  for (var i = 0; i < e.value.length; i++) {
    var c = e.value.charAt(i);
    if (c >= '0' && c <= '9' || (c == "-" && i == 0 && (min < 0 || min == Number.MIN_VALUE)) || (!isInt && (c == "." && dotCount == 0))) {
      if(c == "."){
        dotCount++;
      }
      continue;
    } else {
      e.value = e.value.substring(0, i) + e.value.substring(i + 1, e.value.length);
    }
  }
  if (isNaN(e.value)) {
    e.value = e.value.substring(0, i) + e.value.substring(i + 1, e.value.length);
    e.swTypeIsInError = true;
    return false;
  }
  var value = parseFloat(e.value);
  if (max != Number.MAX_VALUE && value > max) {
    e.value = e.value.substring(0, e.value.length - 1);
  }
  if ((min != Number.MIN_VALUE && value < min) || (max != Number.MAX_VALUE && value > max)) {
    e.swTypeIsInError = true;
    return false;
  }
  if(e.isHtml5){
    setHtml5Attribute(e);
  }
  cleanErrorElement(e, err);
  return true;
}
function isNumberDelimitedValid(e, err, isInt) {
  if (!e || e.value.length == 0 && !e.swReq) {
    return;
  }
  if (e && e.value.length == 0 && e.swReq) {
    e.swTypeIsInError = true;
    return false;
  }
  var sep = parse(e.swType, "{", "}");
  var nums = e.value.split(sep);
  var fullPos = -1;
  var max = Number.MAX_VALUE;
  if (e.swMaxValue && e.swMaxValue.length > 0) {
    var temp = parseFloat(e.swMaxValue);
    if (temp != NaN) {
      max = temp;
    }
  }
  var min = Number.MIN_VALUE;
  if (e.swMinValue && e.swMinValue.length > 0) {
    var temp = parseFloat(e.swMinValue);
    if (temp != NaN) {
      min = temp;
    }
  }
  for (var i = 0; i < nums.length; i++) {
    fullPos++;
    var num = nums[i];
    var dotCount = 0;
    for (var j = 0; j < num.length; j++) {
      fullPos++;
      var c = num.charAt(j);
      if (c >= '0' && c <= '9' || (c == "-" && j == 0 && (min < 0 || min == Number.MIN_VALUE)) || (!isInt && (c == "." && dotCount == 0))) {
        if(c == "."){
          dotCount++;
        }
        continue;
      } else {
        e.value = e.value.substring(0, fullPos - 1);
      }
    }
    if (isNaN(num)) {
      e.swTypeIsInError = true;
      return false;
    }
    var value = parseFloat(num);
    if ((min != Number.MIN_VALUE && value < min) || (max != Number.MAX_VALUE && value > max)) {
      if (value.toString().length >= min.toString().length) {
        e.value = e.value.substring(0, fullPos - 1);
      }
      e.swTypeIsInError = true;
      return false;
    }
  }
  cleanErrorElement(e, err);
  return true;
}
function isAlphanumeric(c) {
  if (!(c > 47 && c < 58) && !(c > 64 && c < 91) && !(c > 96 && c < 123)) {
    return false;
  }
  return true;
}
function isAlphanumericValid(e, err) {
  if (!e || e.value.length == 0) {
    return;
  }
  for (var i = 0; i < e.value.length; i++) {
    if (!isAlphanumeric(e.value.charCodeAt(i))) {
      e.value = e.value.substring(0, i) + e.value.substring(i + 1, e.value.length);
    }
  }
  for (var j = 0; j < e.value.length; j++) {
    if (!isAlphanumeric(e.value.charCodeAt(j))) {
      e.swTypeIsInError = true;
      return false;
    }
  }
  return true;
}
function isAlphanumericAndAdditionalValid(e, err) {
  if (!e || e.value.length == 0) {
    return true;
  }
  var hasSpace = false;
  var hasTab = false;
  var hasNewline = false;
  var hasCarriage = false;
  var c = '';
  var more = parse(e.swType, "{", "}");
  if (more.length > 0) {
    for (var i = 0; i < more.length; i++) {
      c = more.charAt(i);
      if (c == "\\") {
        c = more.charAt(i + 1);
        i++;
      } else {
        continue;
      }
      if (c == "s") {
        hasSpace = true;
      } else if (c == "t") {
        hasTab = true;
      } else if (c == "n") {
        hasNewline = true;
      } else if (c == "r") {
        hasCarriage = true;
      }
    }
  }
  if (hasSpace) {
    more = more.replaceAll("\\s", "");
  } else if (hasTab) {
    more = more.replaceAll("\\t", "");
  } else if (hasNewline) {
    more = more.replaceAll("\\n", "");
  } else if (hasCarriage) {
    more = more.replaceAll("\\r", "");
  }
  for (var j = 0; j < e.value.length; j++) {
    c = e.value.charCodeAt(j);
    if (!isAlphanumeric(c)) {
      if (!more.includes(e.value.charAt(j))) {
        if ((c == 32 && hasSpace) || (c == 9 && hasTab) || (c == 10 && hasNewline) || (c == 13 && hasCarriage)) {
          continue;
        }
        e.value = e.value.substring(0, j) + e.value.substring(j + 1, e.value.length);
      }
    }
  }
  for (var k = 0; k < e.value.length; k++) {
    c = e.value.charCodeAt(k);
    if (!isAlphanumeric(c)) {
      if (!more.includes(e.value.charAt(k))) {
        if ((c == 32 && hasSpace) || (c == 9 && hasTab) || (c == 10 && hasNewline) || (c == 13 && hasCarriage)) {
          continue;
        }
        e.swTypeIsInError = true;
        return false;
      }
    }
  }
  return true;
}
function isStringValid(e, err) {
  if (!e || (e.value.length == 0 && (e.swMin && e.swMin <= 0))) {
    return true;
  }
  if(e.swMax && e.value.length > e.swMax){
    e.value = e.value.substring(0, e.swMax);
  }
  return true;
}
function isConstantValid(e, err) {
  if (!e || e.value.length == 0 && !e.swReq) {
    return;
  }
  if (e && e.value.length == 0 && e.swReq) {
    e.swTypeIsInError = true;
    return false;
  }

  var found = false;
  var constants = parse(e.swType, "{", "}").split(",");
  var constantValues = [];
  for (var i = 0; i < constants.length; i++) {
    constant = constants[i];
    for (var j = 0; j < e.value.length; j++) {
      if (e.value.length > constant.length) {
        constantValues[i] = e.value.substring(0, constant.length);
        break;
      }
      var c = e.value.charAt(j);
      var k = constant.charAt(j);
      if (c != k) {
        constantValues[i] = e.value.substring(0, j);
        break;
      } else {
        constantValues[i] = e.value.substring(0, j + 1);
      }
    }
    if (constants[i] == e.value) {
      found = true;
      break;
    }
  }
  if (!found) {
    var newValue = "";
    for (var l = 0; l < constantValues.length; l++) {
      if (constantValues[l].length > newValue.length) {
        newValue = constantValues[l];
      }
    }
    e.value = newValue;
    e.swTypeIsInError = true;
    return false;
  }
  cleanErrorElement(e, err);
  return true;
}

function isRegexValid(e, err) {
  if (!e || e.value.length == 0) {
    return true;
  }
  var r = parse(e.swType, "{", "}")
  var regex = new RegExp(r);
  var result = regex.test(e.value);
  if (!result) {
    e.swTypeIsInError = true;
    return false;
  }
  return true;
}

function isElementValid(e, err) {
  loadTags(e);
  var type = e.swType;
  if (type.length > 1) {
    type = type.substring(0, 2);
  }

  if (type == 'c') {
    isCharValid(e, err);
  } else if (type == 'n') {
    isNumberValid(e, err, false);
  } else if (type == 'n{') {
    isNumberDelimitedValid(e, err, false);
  } else if (type == 'i') {
    isNumberValid(e, err, true);
  } else if (type == 'i{') {
    isNumberDelimitedValid(e, err, true);
  } else if (type == 'a') {
    isAlphanumericValid(e, err);
  } else if (type == 'a{') {
    isAlphanumericAndAdditionalValid(e, err);
  } else if (type == 's' || type == 'o') {
    isStringValid(e, err);
  } else if (type == 'k{') {
    isConstantValid(e, err);
  } else if (type == 'r{' || type == 'x{') {
    isRegexValid(e, err);
  } else if (type == 'f{') {
    isFormatValid(e, err, false);
  } else if (type == 'd{') {
    isDependentFormatValid(e, err);
  }

  if (e.swRelated) {
    isRelateValid(e);
  }
  if (e.swReq == true && e.value.length == 0) {
    e.swReqIsInError = true;
  }

  if (e.value.length > 0) {
    if (e.swMaxValue > 0 && isNaN(parseInt(e.value))) {
      e.swMaxValueIsInError = true;
    } else if (e.swMaxValue > 0 && parseInt(e.value) > parseInt(e.swMaxValue)) {
      e.swMaxValueIsInError = true;
    }

    if (e.swMinValue > 0 && isNaN(parseInt(e.value))) {
      e.swMinValueIsInError = true;
    } else if (e.swMinValue > 0 && parseInt(e.value) < parseInt(e.swMinValue)) {
      e.swMinValueIsInError = true;
    }

    if (e.swMax > 0 && e.value.length > e.swMax) {
      e.swMaxIsInError = true;
    }
    if (e.swMin > 0 && e.value.length < e.swMin) {
      e.swMinIsInError = true;
    }
  }

  if (e.swTypeIsInError || e.swMaxIsInError || e.swMinIsInError || e.swReqIsInError || e.swMaxValueIsInError || e.swMinValueIsInError || e.swRelatedIsInError) {
    err.elements.push(e);
    err.count += 1;
    return false;
  }
  return true;
}

function formIsValid(thisForm, doBlurActions, err, suppressRender) {
  var flag = true
  for (var i = 0; i < thisForm.length; i++) {
    var e = thisForm.elements[i];
    if (e.type == "text" || e.type == "textarea" || e.type == "password" || e.type == "hidden" || e.type == "checkbox" || e.type == "select-one"
        || e.type == "email" || e.type == "number" || e.type == "url" || e.type == "tel") {
      if (!isElementValid(e, err)) {
        flag = false;
        if (err.numErrorsToDisplay != -1 && err.count >= err.numErrorsToDisplay) {
          break;
        }
      }
    }
    if (err.numErrorsToDisplay != -1 && err.count == err.numErrorsToDisplay) {
      break;
    }
  }
  if (flag == false) {
    handleErrors(err, doBlurActions, suppressRender);
  }
  return flag;
}

var deleteKeyDetected = false;
function sanwafUiOnInput(e) {
  e.onkeydown = function() {
    var key = event.keyCode || event.charCode;
    if(key == 109 || key == 173){
      setHtml5AttributeValue(e, "-");
    }
    
    if (key != 8 && key != 46) {
      deleteKeyDetected = false;
      return true;
    }
    deleteKeyDetected = true;
  };
  if (!deleteKeyDetected) {
    var err = loadGlobalErrorSettings(true);
    isElementValid(e, err);
  }
}
function parseComplexRelated(related) {
  var andOrBlocks = [];
  var andBlocks = parseBlocks(related, 0, "AND", ")&&(", "(", ")");

  for (var i = 0; i < andBlocks.length; i++) {
    var blocks = parseBlocks(andBlocks[i], 0, "OR", ")||(", "(", ")");
    for (var j = 0; j < blocks.length; j++) {
      if (blocks[j] == "||") {
        blocks[j] = "OR";
      } else if (blocks[j].startsWith("||(")) {
        blocks[j] = blocks[j].substring(3, blocks[j].length - 1);
        blocks.splice(j, 0, "OR");
      } else if (blocks[j].endsWith(")||")) {
        blocks[j] = blocks[j].substring(1, blocks[j].length - 3);
        blocks.splice(j + 1, 0, "OR");
      }
    }
    Array.prototype.push.apply(andOrBlocks, blocks);
  }
  for (var k = 0; k < andOrBlocks.length; k++) {
    if (andOrBlocks[k] == "AND" || andOrBlocks[k] == "OR") {
      andOrBlocks.splice(k, 1);
      k--;
      continue;
    }
    andOrBlocks[k] = andOrBlocks[k].split(":")[0];
  }
  return andOrBlocks;
}
function setAttributeForEventListener(element, key, value) {
  var elem = element.getAttribute(key);
  if (!elem) {
    var att = document.createAttribute(key);
    att.value = value;
    element.setAttributeNode(att);
    return true;
  }
  return false;
}


//PUBLIC FUNCTIONS
function initSanwafui() {
  for (var i = 0; i < document.forms.length; i++) {
    for (var j = 0; j < document.forms[i].length; j++) {
      var e = document.forms[i].elements[j];
      var related = removeRelatedSpace(getAttribute(e, "data-sw-related", ""));
      if (related) {
        loadTags(e);
        var parents = [];
        if (related.includes("(")) {
          parents = parseComplexRelated(related);
        } else {
          parents[0] = related.split(":")[0];
        }

        for (var k = 0; k < parents.length; k++) {
          var parent = getElementByIdOrName(parents[k]);
          if (parent) {
            if (setAttributeForEventListener(parent, "sanwaf-change-listener", "true")) {
              (function(passedInCopyOfThisElem) {
                parent.addEventListener("change", function(elemThatIsChangingEgTheSelectList) {
                  sanwafUiBlurElement(passedInCopyOfThisElem);
                });
              })(e);
            }
          }
        }
      }

      if (e.getAttribute("data-sw-type") || (e.type == "email" || e.type == "number" || e.type == "url" || e.type == "tel" || e.getAttribute("minlength") || e.getAttribute("maxlength")
          || e.getAttribute("pattern") || e.getAttribute("required") == "" || e.getAttribute("max") || e.getAttribute("min")) ) {
        if (setAttributeForEventListener(e, "sanwaf-input-listener", "true")) {
          e.addEventListener("input", function(e) {
            sanwafUiOnInput(e.target);
          });
        }

        if (setAttributeForEventListener(e, "sanwaf-focusout-listener", "true")) {
          e.addEventListener("focusout", function(e) {
            var err = loadGlobalErrorSettings(true);
            if (!isElementValid(e.target, err)) {
              handleErrors(err, true, false);
            } else {
              cleanErrorElement(e.target, err);
            }
          });
        }
      }
    }
  }
}
function isSanwafUiFormValid(form) {
  var err = loadGlobalErrorSettings();
  return formIsValid(form, false, err, false);
}
function isSanwafElementValid(elem){
  var err = loadGlobalErrorSettings();
  return isElementValid(elem, err);
}

function sanwafUiBlurElement(elem) {
  var err = loadGlobalErrorSettings(true);
  cleanErrorElement(elem, err);
  if (!isElementValid(elem, err)) {
    handleErrors(err, true, false);
  }
}
function sanwafGetFormErrors(form) {
  var err = loadGlobalErrorSettings(true);
  cleanAllErrorElements(err);
  if (!formIsValid(form, false, err, true)) {
    return JSON.stringify(err.msgarray);
  }
  return "";
}
function sanwafGetElementErrors(elem) {
  cleanErrorElement(elem, err);
  cleanAllErrorElements(err);
  if (!isElementValid(elem, err)) {
    return JSON.stringify(err.msgarray);
  }
  return "";
}
