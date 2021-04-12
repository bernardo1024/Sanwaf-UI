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
  if(!idOrName){
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
  var labeltxt = label.getAttribute("sanwafuilabeltxt");
  if (labeltxt) {
    label.innerHTML = labeltxt;
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

function getLabel(e){
  if(e.swLabelId){
    return e.swLabelId;
  }
  else{
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
      if (err.showlabel == true) {
        hovertxt += '"' + e.swDisplay + '"<br/>';
      }
      hovertxt += buildMsgFromArray(msgs, "<br/>");
    }

    if (actions.includes("colorLabel") && !actions.includes("hoverOnLabel")) {
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
    errorItem.msgs[len] = e.swErrMsg;
  } else {
    errorItem.msgs[len] = defaultmsg;
  }
  if (more1 || more2) {
    errorItem.msgs[len] = insertVarInString(errorItem.msgs[len], more1, more2);
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

function buildErrorItemsArray(e, err, actions) {
  var errorItem = new Object();
  errorItem.disp = e.swDisplay;
  errorItem.msgs = [];

  if (e.swTypeIsInError) {
    if (e.swType == "c") {
      setErrorItem(e, err, errorItem, err.type_c, true, "", "");
    } else if (e.swType == "n") {
      setErrorItem(e, err, errorItem, err.type_n, true, "", "");
    } else if (e.swType == "a") {
      setErrorItem(e, err, errorItem, err.type_a, true, "", "");
    }
    var type = e.swType.substring(0, 2);
    var extra = parse(e.swType, "{", "}");
    if (type == "n{") {
      setErrorItem(e, err, errorItem, err.type_nn, true, renderSpecialChars(extra), "");
    } else if (type == "a{") {
      setErrorItem(e, err, errorItem, err.type_aa, true, renderSpecialChars(extra), "");
    } else if (type == "k{") {
      setErrorItem(e, err, errorItem, err.type_k, true, extra.replace(",", "\" or \""), "");
    } else if (type == "r{" || type == "x{") {
      setErrorItem(e, err, errorItem, err.type_r, true, extra, "");
    }
  }

  if (e.swReqIsInError) {
    setErrorItem(e, err, errorItem, err.required, false, "", "");
  }
  if (e.swMaxIsInError || e.swMinIsInError) {
    if (e.swMax == e.swMin) {
      setErrorItem(e, err, errorItem, err.maxMinEqualMsg, true, e.swMin, e.swMax);
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
  if (e.swFormatIsInError) {
    setErrorItem(e, err, errorItem, err.format, false, e.swFormat, "");
  }

  if (e.swRelatedIsInError) {
    var labeltxt;
    if (!e.swRelated.startsWith("(")) {
      var kv = e.swRelated.split(":");
      var rel = getElementByIdOrName(kv[0]);
      if (rel) {
        if (rel.getAttribute("id")) {
          var label = getElementByIdOrName(rel.getAttribute("id")).label;
          labeltxt = label.getAttribute("sanwafuilabeltxt");
          if (!labeltxt) {
            labeltxt = label.innerHTML;
          }
        }
      }
      if (kv[1] == "=") {
        if (e.value != rel.value) {
          setErrorItem(e, err, errorItem, err.relNotEqual, false, e.swDisplay, rel.swDisplay);
        } else {
          setErrorItem(e, err, errorItem, err.relNotEqual, false, e.swDisplay, parentElement.getAttribute("data-sw-display"));
        }
      } else {
        setErrorItem(e, err, errorItem, err.rel, false, "'" + labeltxt + "'", "");
      }
    } else {
      setErrorItem(e, err, errorItem, err.rel, false, getRelatedError(e), "");
    }
  }

  err.msgarray.push(errorItem);
  doLabelAndHover(e, err, errorItem.msgs, actions)
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

function handleErrors(err, doBlurActions) {
  var actions = err.errorActions;
  if (doBlurActions) {
    actions = err.blurActions;
  }

  for (var i = 0; i < err.elements.length; i++) {
    // NOTE: labels & hover are handled in buildErrorItemsArray method
    buildErrorItemsArray(err.elements[i], err, actions);
  }
  if (actions.includes("showOnPage")) {
    var d = getElementByIdOrName(err.showOnPageElementId);
    d.style.display = "block";
    if (err.errorActions.includes("showOnPageSanwafTable")) {
      var e = getElementByIdOrName(err.showOnPageSanwafTableElementId);
      e.innerHTML = buildErrorMsg(e, err, "html");
    }
  }
  if (err.msgarray.length > 0 && actions.includes("alertWithPopup")) {
    alert(buildErrorMsg(e, err, "alertWithPopup"));
  }
}

function getAttribute(config, att, def) {
  if (config) {
    var s = config.getAttribute(att);
    if (s != undefined && s.length > 0) {
      return s;
    }
  }
  return def;
}

function loadTags(e) {
  e.swDisplay = getAttribute(e, "data-sw-display", "");
  e.swLabelId = getElementByIdOrName(getAttribute(e, "data-sw-label-id", ""));
  
  e.swErrMsg = getAttribute(e, "data-sw-err-msg", "");
  e.swType = getAttribute(e, "data-sw-type", "");
  e.swTypeIsInError = false;
  e.swMax = getAttribute(e, "data-sw-max", "");
  e.swMaxIsInError = false;
  e.swMin = getAttribute(e, "data-sw-min", "");
  e.swMinIsInError = false;
  e.swReq = getAttribute(e, "data-sw-req", false);
  var s = e.swReq + "";
  if (s.toLowerCase() == "false") {
    e.swReq = false;
  } else {
    e.swReq = true;
  }
  e.swReqIsInError = false;
  if(e.swType.startsWith('f{')){
    e.swFormat = e.swType.substring(2, e.swType.length -1);
  }
  e.swFormatIsInError = false;
  e.swMaxValue = getAttribute(e, "data-sw-max-value", "");
  e.swMaxValueIsInError = false;
  e.swMinValue = getAttribute(e, "data-sw-min-value", "");
  e.swMinValueIsInError = false;
  e.swRelated = getAttribute(e, "data-sw-related", "");
  e.swRelatedIsInError = false;
}

function loadGlobalErrorSettings(forElementOnly) {
  var config = getElementByIdOrName("sanwafUiConfig");
  var err = new Object;
  err.count = 0;
  err.elements = [];
  err.msgarray = [];

  err.numErrorsToDisplay = getAttribute(config, "data-numErrorsToDisplay");
  if (err.numErrorsToDisplay == "") {
    err.numErrorsToDisplay = -1;
  }

  err.errorActions = getAttribute(config, "data-errorActions", "");
  if (err.errorActions == "") {
    err.errorActions = "hoverOnLabel,hoverShowLabel,colorLabel,colorInput,showOnPage,showOnPageSanwafTable,alertWithPopup";
  }

  err.blurActions = getAttribute(config, "data-blurActions", "");
  if (err.blurActions == "") {
    err.blurActions = "hoverOnLabel,hoverShowLabel,colorLabel,colorInput";
  }

  err.labelClass = getAttribute(config, "data-labelClass", "sanwafuiLabel");
  err.inputClass = getAttribute(config, "data-inputClass", "sanwafuiInput");
  err.tooltipClass = getAttribute(config, "data-tooltipClass", "sawafuiTooltip");
  err.tooltipTextClass = getAttribute(config, "data-tooltipTextClass", "tooltiptext");
  err.sanwafErrorTableClass = getAttribute(config, "data-sanwafErrorTableClass", "sanwafuiErrorTable");
  err.sanwafErrorTableTdKeyClass = getAttribute(config, "data-sanwafErrorTableTdKeyClass", "sanwafuiErrorTableTdKey");
  err.sanwafErrorTableTdDescClass = getAttribute(config, "data-sanwafErrorTableTdDescClass", "sanwafuiErrorTableTdDesc");

  err.showOnPageElementId = getAttribute(config, "data-showOnPageElementId", "sanwafuierrorwrapper");
  err.showOnPageSanwafTableElementId = getAttribute(config, "data-showOnPageSanwafTableElementId", "sanwafuierrortable");
  if (err.errorActions.includes("hoverShowLabel")) {
    err.showlabel = true;
  } else {
    err.showlabel = false;
  }

  err.popheader1 = getAttribute(config, "data-errorPopHeader1", "Please correct the following errors");
  err.popheader2 = getAttribute(config, "data-errorPopHeader2", "---------------------------------------------------------------------------");
  err.min = getAttribute(config, "data-errorMin", "Must be between %1 and %2 chars");
  err.max = getAttribute(config, "data-errorMax", "Must be between %1 and %2 chars");
  err.maxMinEqualMsg = getAttribute(config, "data-errorMaxMinEqual", "Must be %1 chars");
  err.required = getAttribute(config, "data-errorRequired", "Is a Required Field");
  err.format = getAttribute(config, "data-errorFormat", "Must have the format: %1 ");
  err.minVal = getAttribute(config, "data-errorMinValue", "Must be between %1 and %2");
  err.maxVal = getAttribute(config, "data-errorMaxValue", "Must be between %1 and %2");
  err.rel = getAttribute(config, "data-errorRelated", "Is required when %1 is entered");
  err.relNotEqual = getAttribute(config, "data-errorRelatedNotEqual", "%1 must have the same value as %2");
  err.type_c = getAttribute(config, "data-errorTypeChar", "Must be a single character");
  err.type_n = getAttribute(config, "data-errorTypeNumeric", "Must be numeric");
  err.type_nn = getAttribute(config, "data-errorTypeNumericDelimited", "Must be a list of numeric value(s) delimted by %1");
  err.type_a = getAttribute(config, "data-errorTypeAlphanumeric", "Must be alphanumeric");
  err.type_aa = getAttribute(config, "data-errorTypeAlphanumericAndMore", "Must be alphanumeric or the following: %1");
  err.type_k = getAttribute(config, "data-errorTypeConstant", "Must be must be one of the following: \"%1\"");
  err.type_r = getAttribute(config, "data-errorTypeRegex", "Must be must match the regex: \"%1\"");
  err.type_f = getAttribute(config, "data-errorTypeFormat", "Must have the format: %1");

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

  for (var i = 0; i != e.value.length; i++) {
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

  for (var i = 0; i != e.value.length; i++) {
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

function isFormatValid(e, err) {
  var formatlen = e.swFormat.length;
  
  if (e.value.length == 0 && formatlen > 0 && e.swReq == true) {
    e.swFormatIsInError = true;
    return;
  }
  if (e.value.length == 0 && e.swReq == false) {
    return;
  }
  for (var i = 0; i < e.value.length; i++) {
    if (e.value.length > formatlen) {
      e.value = e.value.substring(0, formatlen);
      break;
    }
    var f = e.swFormat.charAt(i);
    var c = e.value.charAt(i);
    if (f != '#' && f != 'A' && f != 'a' && c != f) {
      e.value = e.value.substring(0, i) + f + e.value.substring(i, e.value.length);
      continue;
    }
    if (f == '#' && c >= '0' && c <= '9') {
      continue;
    }

    if ((f == 'A' || f == 'a') && ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))) {
      if (f == 'A') {
        c = c.toUpperCase();
      } else {
        c = c.toLowerCase();
      }
      e.value = e.value.substring(0, i) + c + e.value.substring(i + 1, e.value.length);
      continue;
    } else if ((f == '#' && !(c >= '0' && c <= '9')) || ((f == 'A' || f == 'a') && !((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')))) {
      e.value = e.value.substring(0, i) + e.value.substring(i + 1, e.value.length);
    }
  }
  if (e.value.length != formatlen) {
    e.swFormatIsInError = true;
    return;
  }
  cleanErrorElement(e, err);
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

  // do AND conditions - must be met, else ignore OR conditions
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
    if (tagKeyValuePair[1] == '=') { // do values need to be equal?
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
  var parentIsReq = parentElement.getAttribute("data-sw-req");
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

function isNumberValid(e, err) {
  if (!e || e.value.length == 0) {
    return true;
  }
  for (var i = 0; i < e.value.length; i++) {
    var c = e.value.charAt(i);
    if (c >= '0' && c <= '9' || c == "." || c == "-" || c == ",") {
      continue;
    } else {
      e.value = e.value.substring(0, i) + e.value.substring(i + 1, e.value.length);
    }
  }
  if (isNaN(e.value)) {
    e.swTypeIsInError = true;
    return false;
  }
  return true;
}

function isNumberDelimitedValid(e, err) {
  if (!e || e.value.length == 0) {
    return;
  }
  var sep = parse(e.swType, "{", "}");
  var nums = e.value.split(sep);
  for (var i = 0; i < nums.length; i++) {
    for (var j = 0; j < e.value.length; j++) {
      var c = e.value.charAt(j);
      if (c >= '0' && c <= '9' || c == "." || c == "-" || c == "," || c == sep) {
        continue;
      } else {
        e.value = e.value.substring(0, j + i) + e.value.substring(j + i + 1, e.value.length);
      }
    }
    if (isNaN(nums[i])) {
      e.swTypeIsInError = true;
      return false;
    }
  }
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
  // make sure nothing got past
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

  if (hasSpace){
    more = more.replaceAll("\\s", "");
  } else if (hasTab){
    more = more.replaceAll("\\t", "");
  } else if (hasNewline){
    more = more.replaceAll("\\n", "");
  } else if (hasCarriage){
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
  // make sure nothing got past
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

function isConstantValid(e, err) {
  if (!e || e.value.length == 0) {
    return;
  }
  var found = false;
  var constants = parse(e.swType, "{", "}").split(",");
  for (var i = 0; i < constants.length; i++) {
    if (constants[i] == e.value) {
      found = true;
      break;
    }
  }
  if (!found) {
    e.swTypeIsInError = true;
    return false;
  }
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
    isNumberValid(e, err);
  } else if (type == 'n{') {
    isNumberDelimitedValid(e, err);
  } else if (type == 'a') {
    isAlphanumericValid(e, err);
  } else if (type == 'a{') {
    isAlphanumericAndAdditionalValid(e, err);
  } else if (type == 'k{') {
    isConstantValid(e, err);
  } else if (type == 'r{' || type == 'x{') {
    isRegexValid(e, err);
  } else if(type == 'f{') {
    isFormatValid(e, err);
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

  if (e.swTypeIsInError || e.swMaxIsInError || e.swMinIsInError || e.swReqIsInError || e.swFormatIsInError || e.swMaxValueIsInError
      || e.swMinValueIsInError || e.swRelatedIsInError) {
    err.elements.push(e);
    err.count += 1;
    return false;
  }
  return true;
}

function formIsValid(thisForm, doBlurActions) {
  var flag = true
  var err = loadGlobalErrorSettings();

  for (var i = 0; i < thisForm.length; i++) {
    var e = thisForm.elements[i];
    if (e.type == "text" || e.type == "textarea" || e.type == "password" || e.type == "hidden" || e.type == "checkbox" || e.type == "select-one") {
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
    handleErrors(err, doBlurActions);
  }

  // json = JSON.stringify(err.msgarray);
  return flag;
}

function sanwafUiOnInput(e) {
  e.onkeydown = function() {
    var key = event.keyCode || event.charCode;
    if (key != 8 && key != 46) {
      return true;
    }
  };
  if (e.onkeydown) {
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

function initSanwafui() {
  for (var i = 0; i < document.forms.length; i++) {
    for (var j = 0; j < document.forms[i].length; j++) {
      var e = document.forms[i].elements[j];
      var related = getAttribute(e, "data-sw-related", "");
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
            (function(passedInCopyOfThisElem) {
              parent.addEventListener("change", function(elemThatIsChangingEgTheSelectList) {
                sanwafUiBlurElement(passedInCopyOfThisElem);
              });
            })(e);
          }
        }
      }

      if (e.getAttribute("data-sw-type")) {
        e.addEventListener("focus", function(e) {
          var err = loadGlobalErrorSettings(true);
          if (err.blurActions.includes("onFocusDisableColors")) {
            cleanErrorElement(e.target, err);
          }
        });

        e.addEventListener("input", function(e) {
          sanwafUiOnInput(e.target);
        });

        e.addEventListener("drop", function(e) {
          sanwafUiOnInput(e.target);
        });

        e.addEventListener("focusout", function(e) {
          var err = loadGlobalErrorSettings(true);
          if (!isElementValid(e.target, err)) {
            handleErrors(err, true);
          } else {
            cleanErrorElement(e.target, err);
          }
        });
      }
    }
  }
}

function isSanwafUiFormValid(form) {
  return formIsValid(form, false);
}
function sanwafUiBlurElement(e) {
  var err = loadGlobalErrorSettings(true);
  cleanErrorElement(e, err);
  if (!isElementValid(e, err)) {
    handleErrors(err, true);
  }
}
