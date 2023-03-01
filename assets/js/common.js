let lang = "fr";
let profile_image;
let profile_name;
let loading_flag = true;
let shadowWrapper = document.createElement('div');
shadowWrapper.id = "shadow-wrapper";
document.body.appendChild(shadowWrapper);
let host = document.getElementById('shadow-wrapper');
let shadowRoot = host.attachShadow({
    mode: 'open'
});

//  Draggable element
function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e){
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e){
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement(){
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
//  Draggable element


function strMask(str){
    return Array.from(str, () => '*').join('');
}

function maskEmail(email){
    array = email.split('@');
    tmp = Array.from(array[0], () => '*').join('');
    return tmp+'@'+array[1];

}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

  function ParseAddressEsri(singleLineaddressString) {
    var address = {
      street: "",
      city: "",
      state: "",
      postalCode: ""
    };
  
    // tokenize by space (retain commas in tokens)
    var tokens = singleLineaddressString.split(/[\s]+/);
    var tokenCount = tokens.length;
    var lastToken = tokens.pop();
    if (
      // if numeric assume postal code (ignore length, for now)
      !isNaN(lastToken) ||
      // if hyphenated assume long zip code, ignore whether numeric, for now
      lastToken.split("-").length - 1 === 1) {
      address.postalCode = lastToken;
      lastToken = tokens.pop();
    }
  
    if (lastToken && isNaN(lastToken)) {
      if (address.postalCode.length && lastToken.length === 2) {
        // assume state/province code ONLY if had postal code
        // otherwise it could be a simple address like "714 S OAK ST"
        // where "ST" for "street" looks like two-letter state code
        // possibly this could be resolved with registry of known state codes, but meh. (and may collide anyway)
        address.state = lastToken;
        lastToken = tokens.pop();
      }
      if (address.state.length === 0) {
        // check for special case: might have State name instead of State Code.
        var stateNameParts = [lastToken.endsWith(",") ? lastToken.substring(0, lastToken.length - 1) : lastToken];
  
        // check remaining tokens from right-to-left for the first comma
        while (2 + 2 != 5) {
          lastToken = tokens.pop();
          if (!lastToken) break;
          else if (lastToken.endsWith(",")) {
            // found separator, ignore stuff on left side
            tokens.push(lastToken); // put it back
            break;
          } else {
            stateNameParts.unshift(lastToken);
          }
        }
        address.state = stateNameParts.join(' ');
        lastToken = tokens.pop();
      }
    }
  
    if (lastToken) {
      // here is where it gets trickier:
      if (address.state.length) {
        // if there is a state, then assume there is also a city and street.
        // PROBLEM: city may be multiple words (spaces)
        // but we can pretty safely assume next-from-last token is at least PART of the city name
        // most cities are single-name. It would be very helpful if we knew more context, like
        // the name of the city user is in. But ignore that for now.
        // ideally would have zip code service or lookup to give city name for the zip code.
        var cityNameParts = [lastToken.endsWith(",") ? lastToken.substring(0, lastToken.length - 1) : lastToken];
  
        // assumption / RULE: street and city must have comma delimiter
        // addresses that do not follow this rule will be wrong only if city has space
        // but don't care because Esri formats put comma before City
        var streetNameParts = [];
  
        // check remaining tokens from right-to-left for the first comma
        while (2 + 2 != 5) {
          lastToken = tokens.pop();
          if (!lastToken) break;
          else if (lastToken.endsWith(",")) {
            // found end of street address (may include building, etc. - don't care right now)
            // add token back to end, but remove trailing comma (it did its job)
            tokens.push(lastToken.endsWith(",") ? lastToken.substring(0, lastToken.length - 1) : lastToken);
            streetNameParts = tokens;
            break;
          } else {
            cityNameParts.unshift(lastToken);
          }
        }
        address.city = cityNameParts.join(' ');
        address.street = streetNameParts.join(' ');
      } else {
        // if there is NO state, then assume there is NO city also, just street! (easy)
        // reasoning: city names are not very original (Portland, OR and Portland, ME) so if user wants city they need to store state also (but if you are only ever in Portlan, OR, you don't care about city/state)
        // put last token back in list, then rejoin on space
        tokens.push(lastToken);
        address.street = tokens.join(' ');
      }
    }
    // when parsing right-to-left hard to know if street only vs street + city/state
    // hack fix for now is to shift stuff around.
    // assumption/requirement: will always have at least street part; you will never just get "city, state"  
    // could possibly tweak this with options or more intelligent parsing&sniffing
    if (!address.city && address.state) {
      address.city = address.state;
      address.state = '';
    }
    if (!address.street) {
      address.street = address.city;
      address.city = '';
    }
  
    return address;
  }  

  function logout(){
    chrome.storage.local.clear(function(){
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
        // do something more
        console.log('Cleared!');
        shadowRoot.getElementById('popup').innerHTML = login_html;
        getRememberData();
        shadowRoot.getElementById('signin').addEventListener('click',()=>{signedIn()});
    });
}

function lsRememberMe() {
  var emailInput = shadowRoot.getElementById('email').value;
  var passInput = shadowRoot.getElementById('password').value;
  var rmCheck = shadowRoot.getElementById("keepme");
  if (rmCheck.checked && emailInput.value !== "") {
    localStorage.setItem('username',emailInput.value);
    localStorage.setItem('password',passInput.value);
    localStorage.setItem('check',rmCheck.value);
  } else {
    localStorage.setItem('username',"");
    localStorage.setItem('assword',"");
    localStorage.setItem('check',false);
  }
}

function getRememberData(){
  var emailInput = shadowRoot.getElementById('email').value;
  var passInput = shadowRoot.getElementById('password').value;
  var rmCheck = shadowRoot.getElementById("keepme");
  if(localStorage.getItem('check')){
    emailInput.value = localStorage.getItem('username');
    passInput.value = localStorage.getItem('password');
    rmCheck.checked = localStorage.getItem('check');
  }
}

function changeLangNoProfile(lang){
  chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
      let msg = JSON.parse(response);
      $(shadowRoot.getElementById('gheading')).text(msg.greetingHeading.message);
      $(shadowRoot.getElementById('gsub')).text(msg.greetingSub.message);
      $(shadowRoot.getElementById('gsub')).text(msg.greetingSub.message);
      $(shadowRoot.getElementById('instheading')).text(msg.instructionHeading.message);
      $(shadowRoot.getElementById('instsub')).text(msg.instructionSub.message);
      $(shadowRoot.getElementById('cr')).text(msg.cr.message);
      $(shadowRoot.getElementById('acc')).text(msg.acc.message);
  });
}
function changeLangDropdown(lang){
  chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
      let msg = JSON.parse(response);
      $(shadowRoot.getElementById('acc')).text(msg.ac.message);
      $(shadowRoot.getElementById('email')).text(msg.email.message);
      $(shadowRoot.getElementById('aoHead')).text(msg.autoopenHead.message);
      $(shadowRoot.getElementById('aoSub')).text(msg.autoopenSub.message);
      $(shadowRoot.getElementById('asHead')).text(msg.autosvHeading.message);
      $(shadowRoot.getElementById('asSub')).text(msg.autosvSub.message);
      $(shadowRoot.getElementById('atm')).text(msg.atm.message);
      $(shadowRoot.getElementById('anl')).text(msg.atm.message);
      $(shadowRoot.getElementById('itgrn')).text(msg.atm.message);
      $(shadowRoot.getElementById('inv')).text(msg.inv.message);
      $(shadowRoot.getElementById('inv')).text(msg.inv.message);
      $(shadowRoot.getElementById('hc')).text(msg.help.message);
      $(shadowRoot.getElementById('fc')).text(msg.fc.message);
      $(shadowRoot.getElementById('logout')).text(msg.lo.message);
  });
}

function changeLangContactFound(lang){
  chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
    let msg = JSON.parse(response);
    $(shadowRoot.getElementById('cf')).text(msg.cf.message);
    $(shadowRoot.getElementById('head')).text(msg.cfHeading.message);
    $(shadowRoot.getElementById('sub')).html(msg.cfSub.message);
    $(shadowRoot.getElementById('addToWaiting')).text(msg.cfBtn.message);
  });
}