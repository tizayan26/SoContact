let lastUrl = location.href; 
new MutationObserver(() => {
const url = location.href;
if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
}
}).observe(document, {subtree: true, childList: true});

function onUrlChange() {
    console.log('URL changed!', location.href);
    var pattern = /linkedin.com\/in/;
    console.log(location.href.match(pattern));
    // if(location.href != 'https://www.linkedin.com/feed/' || location.href != 'https://www.linkedin.com/mynetwork/' || location.href != 'https://www.linkedin.com/jobs/' || location.href != 'https://www.linkedin.com/notifications/?filter=all'){
    if(location.href.match(pattern)!= null){
        getProfileDetailsFromAPI();
        console.log('valid URL');
    }else{
        shadowRoot.getElementById('app_container').innerHTML = noProfileHTML;
    }
}

const getProfileDetailsFromAPI = () => {
    shadowRoot.getElementById('app_container').innerHTML = contactSearchHTML;
    let linkedin_url = location.href.replace(/(^\w+:|^)\/\//, '').replace('www.','')
    url_array = linkedin_url.split("/in/");
    tmp_url = url_array[1].split("/")
    console.log(tmp_url);
    
    linkedin_url = "linkedin.com/in/"+tmp_url[0];
    chrome.runtime.sendMessage({call: "getProfile", link: linkedin_url}, function(response) {
        console.log(response);
        var  res = JSON.parse(response);
        if(res.dynamowebs_status=="success"){
            shadowRoot.getElementById('contact_found_detail').innerHTML = contact_detail_api;
           
            setTimeout(function(){
                if(document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]').length > 0){
                    var pic = document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]');
                }else if(document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]').length > 0){
                    var pic = document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]');
                } 
                var name = document.querySelectorAll('h1[class*="text-heading-xlarge"]');  
                var jobTitle = document.querySelectorAll('div[class*="text-body-medium break-words"]')[0].innerText
                res['name'] = name[0].innerText;
                res['image'] = pic[0].src;
                res['jobtitle'] = jobTitle
                // shadowRoot.getElementById('linkedInProfileName').innerText = res.name;
                shadowRoot.getElementById('linkedInProfileName').innerText = res.name;
                shadowRoot.getElementById('linkedInProfileImg').src = res.image//res.image
                let ul_phones = shadowRoot.getElementById('phoneNumbers');
                ul_phones.innerHTML = null;
                res.phoneNumbers.forEach(el => {
                   
                    var li = document.createElement('li');
                    if(el.verified == true)
                        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ el.countryCode + strMask(el.number);
                    else{
                        li.innerHTML = ' '+ el.countryCode + strMask(el.number);
                        li.className = 'not-verified';
                    }
                    ul_phones.appendChild(li);
                });
                let ul_proEmails = shadowRoot.getElementById('proEmails');
                ul_proEmails.innerHTML = null;
                res.professionalEmail.forEach(el =>{
                    var li = document.createElement('li');
                    if(el.verified == true)
                        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ maskEmail(el.email);
                    else{
                        li.innerHTML = ' '+ maskEmail(el.email);
                        li.className = 'not-verified';
                    }
                    ul_proEmails.appendChild(li);
                });
                let ul_perEmails = shadowRoot.getElementById('perEmails');
                ul_perEmails.innerHTML = null;
                res.personalEmail.forEach(el =>{
                    var li = document.createElement('li');
                    if(el.verified == true)
                        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ maskEmail(el.email);
                    else{
                        li.innerHTML = ' '+ maskEmail(el.email);
                        li.className = 'not-verified';
                    }
                    ul_perEmails.appendChild(li);
                })
                shadowRoot.getElementById('companyName').innerText = res.companyInformation[0].name;
                shadowRoot.getElementById('companyWebsite').href = res.companyInformation[0].website;
                console.log(res.otherSocialMedia.facebook);
                shadowRoot.getElementById('fbURL').innerText = strMask(res.otherSocialMedia.facebook);
            },1000)
            

            shadowRoot.getElementById('unlockbuttoncontainer').innerHTML = '<button class="btn-unlock" id="btnUnlock">Unlock details</button>';
            shadowRoot.getElementById('btnUnlock').addEventListener('click', ()=> {unlockLead(res)});
        }
        else if(res.dynamowebs_msg=="token_expired"){
            console.log(res.token);
                // console.log(res.message.includes("Token has been expired."));
            if(res.token!==undefined && res.token == "expired"){
                chrome.storage.local.get(['session'], function(result) {
                    var session = JSON.parse(result.session);

                    chrome.runtime.sendMessage({call: "validateUser", email: session.email, password: session.pass}, function(response) {
                        var res = JSON.parse(response);
                        console.log(res);
                        if(res.dynamowebs_status == "success"){
                            var session_obj = {
                                token: res.token,
                                id: res.id,
                                email: session.email,
                                pass:  session.pass
                            }
                            chrome.storage.local.set({loggedin: true,session:JSON.stringify(session_obj)}, function() {
                                console.log('Session is set to ' + JSON.stringify(session_obj));
                            });
                            shadowRoot.getElementById('popup').innerHTML = account_html;
                            // shadowRoot.getElementById('account_dropdown').addEventListener('click', () => {
                            //     $(shadowRoot.getElementById('drop_down')).slideToggle(800);
                            //     $(shadowRoot.getElementById('app_container')).fadeToggle(400);
                                
                            // })
                            accountDropdown();
                            shadowRoot.getElementById('logout').addEventListener('click',() => {
                                chrome.storage.local.remove('loggedin');
                                chrome.storage.local.remove('session');
                                shadowRoot.getElementById('popup').innerHTML = login_html;
                                shadowRoot.getElementById('signin').addEventListener('click',()=>{signedIn()})
                            })
                        }
                        getProfileDetailsFromAPI();
                    });

                });
            }
            
        }else{
            shadowRoot.getElementById('unlockbuttoncontainer').innerHTML = null;
            shadowRoot.getElementById('contact_found_detail').innerHTML = contact_detail_linkedIn;
        }
        shadowRoot.getElementById('linkedInProfileImg').src = chrome.runtime.getURL('assets/icons/spinner.gif');
        shadowRoot.getElementById('linkedInProfileName').innerHTML = `
        <div class="load-2">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>`;
        var myInterval = setInterval(function () {
            if(getLinkedInProfile()){
                console.log("Got DOM")
                clearInterval(myInterval);
            }else{
                console.log("Not found!")
            }
        }, 5000);
    });
}

const getLinkedInProfile = () => {
    // var parser = new DOMParser();
    // var document = parser.parseFromString(text, 'text/html');
    // console.log(document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]'));
    try{
        if(document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]').length > 0){
            var pic = document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]');
        }else if(document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]').length > 0){
            var pic = document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]');
        }   
        console.log(pic[0].src);
        var name = document.querySelectorAll('h1[class*="text-heading-xlarge"]');
        shadowRoot.getElementById('linkedInProfileName').innerText = name[0].innerText;
        shadowRoot.getElementById('linkedInProfileImg').src = pic[0].src;
        profile_name = name[0].innerText;
        profile_image =  pic[0].src;
        return true;
    }catch(err){
        console.log(err);
        return false;
    }

};

function signedIn(){
    let login_email = shadowRoot.getElementById('email').value;
    let login_pass = shadowRoot.getElementById('password').value;
    if(!login_email || !login_pass){
        shadowRoot.getElementById('loginMsg').innerText = "Email and Password is required!"
    }else{
        chrome.runtime.sendMessage({call: "validateUser", email: login_email, password: login_pass}, function(response) {
            let res = JSON.parse(response);
            console.log(res);
            if(res.dynamowebs_status == "success"){
                var session_obj = {
                    token: res.token,
                    id: res.id,
                    email: login_email,
                    pass: login_pass
                }
                chrome.storage.local.set({loggedin: true,session:JSON.stringify(session_obj)}, function() {
                    console.log('Session is set to ' + JSON.stringify(session_obj));
                });

                shadowRoot.getElementById('popup').innerHTML = account_html;
                // shadowRoot.getElementById('account_dropdown').addEventListener('click', () => {
                //     $(shadowRoot.getElementById('drop_down')).slideToggle(800);
                //     $(shadowRoot.getElementById('app_container')).fadeToggle(400);
                    
                // })
                accountDropdown();
                shadowRoot.getElementById('logout').addEventListener('click',() => {
                    chrome.storage.local.remove('loggedin');
                    chrome.storage.local.remove('session');
                    shadowRoot.getElementById('popup').innerHTML = login_html;
                    shadowRoot.getElementById('signin').addEventListener('click',()=>{signedIn()})
                })
            }
            shadowRoot.getElementById('loginMsg').innerText = res.dynamowebs_msg;
        });
    }
   
}

chrome.storage.local.get(['loggedin'], function(result) {
    console.log(result);
    if(result.loggedin){
        chrome.runtime.sendMessage({call: "getUser",}, function(response) {
            console.log(response);
        })

        shadowRoot.getElementById('popup').innerHTML = account_html;
        // shadowRoot.getElementById('account_dropdown').addEventListener('click', () => {
        //     $(shadowRoot.getElementById('drop_down')).slideToggle(800);
        //     $(shadowRoot.getElementById('app_container')).fadeToggle(400);
            
        // })
        accountDropdown();
        shadowRoot.getElementById('logout').addEventListener('click',() => {
            shadowRoot.getElementById('popup').innerHTML = login_html;
            shadowRoot.getElementById('signin').addEventListener('click',()=>{signedIn()})
        })
    }
})

function unlockLead(res){
    shadowRoot.getElementById('app_container').innerHTML = leadUnlocked;
    shadowRoot.getElementById('linkedInProfileName').innerText = res.name;
    shadowRoot.getElementById('jobTitle').innerText = res.jobtitle;
    shadowRoot.getElementById('linkedInProfileImg').src = res.image;
    let ul_phones = shadowRoot.getElementById('phoneNumbers');
    ul_phones.innerHTML = null;
    res.phoneNumbers.forEach(el => {   
        var li = document.createElement('li');
        if(el.verified == true)
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ el.countryCode + el.number;
        else{
            li.innerHTML = ' '+ el.countryCode + el.number;
            li.className = 'not-verified';
        }
        ul_phones.appendChild(li);
    });
    let ul_proEmails = shadowRoot.getElementById('proEmails');
    ul_proEmails.innerHTML = null;
    res.professionalEmail.forEach(el =>{
        var li = document.createElement('li');
        if(el.verified == true)
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ el.email;
        else{
            li.innerHTML = ' '+ el.email;
            li.className = 'not-verified';
        }
        ul_proEmails.appendChild(li);
    });
    let ul_perEmails = shadowRoot.getElementById('perEmails');
    ul_perEmails.innerHTML = null;
    res.personalEmail.forEach(el =>{
        var li = document.createElement('li');
        if(el.verified == true)
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ el.email;
        else{
            li.innerHTML = ' '+ el.email;
            li.className = 'not-verified';
        }
        ul_perEmails.appendChild(li);
    })
    shadowRoot.getElementById('companyName').innerText = res.companyInformation[0].name;
    shadowRoot.getElementById('companyWebsite').href = res.companyInformation[0].website;
    console.log(res.otherSocialMedia.facebook);
    // shadowRoot.getElementById('fbURL').innerText = res.otherSocialMedia.facebook;
    let ul_socialMedia = shadowRoot.getElementById('social_media');
    ul_socialMedia.innerHTML = null;
    var li = document.createElement('li');
    if(res.otherSocialMedia.facebook !== undefined || res.otherSocialMedia.facebook !== null || res.otherSocialMedia.facebook !== ''){
        var li = document.createElement('li');
        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30.033" height="30.033" viewBox="0 0 30.033 30.033"><path id="Icon_awesome-facebook-square" data-name="Icon awesome-facebook-square" d="M26.816,2.25H3.218A3.218,3.218,0,0,0,0,5.468v23.6a3.218,3.218,0,0,0,3.218,3.218h9.2V22.073H8.2V17.267h4.223V13.6c0-4.166,2.48-6.468,6.28-6.468a25.587,25.587,0,0,1,3.722.324V11.55h-2.1a2.4,2.4,0,0,0-2.71,2.6v3.121h4.611l-.737,4.806H17.614V32.283h9.2a3.218,3.218,0,0,0,3.218-3.218V5.468A3.218,3.218,0,0,0,26.816,2.25Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.facebook;
        ul_socialMedia.appendChild(li);
    }
    if(res.otherSocialMedia.Linkedin !== undefined || res.otherSocialMedia.Linkedin !== null || res.otherSocialMedia.Linkedin !== ''){
        var li = document.createElement('li');
        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="29.139" height="29.139" viewBox="0 0 29.139 29.139"><path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M27.057,2.25H2.075A2.09,2.09,0,0,0,0,4.351V29.288a2.09,2.09,0,0,0,2.075,2.1H27.057a2.1,2.1,0,0,0,2.081-2.1V4.351A2.1,2.1,0,0,0,27.057,2.25ZM8.807,27.226H4.488V13.32H8.813V27.226ZM6.647,11.421a2.5,2.5,0,1,1,2.5-2.5A2.505,2.505,0,0,1,6.647,11.421ZM25,27.226H20.677V20.462c0-1.613-.033-3.688-2.244-3.688-2.25,0-2.6,1.756-2.6,3.571v6.881H11.519V13.32h4.143v1.9h.059a4.549,4.549,0,0,1,4.091-2.244C24.183,12.975,25,15.857,25,19.6Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.Linkedin;
        ul_socialMedia.appendChild(li);
    }
    if(res.otherSocialMedia.instagram !== undefined || res.otherSocialMedia.instagram !== null || res.otherSocialMedia.instagram !== ''){
        var li = document.createElement('li');
        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.instagram;
        ul_socialMedia.appendChild(li);
    }
    if(res.otherSocialMedia.twitter !== undefined || res.otherSocialMedia.twitter !== null || res.otherSocialMedia.twitter !== ''){
        var li = document.createElement('li');
        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.twitter;
        ul_socialMedia.appendChild(li);
    }
    shadowRoot.getElementById('btnBack').addEventListener('click', () => {
        shadowRoot.getElementById('app_container').innerHTML = html_back_content;
        getProfileDetailsFromAPI();
        // var myInterval = setInterval(function () {
        //     if(getLinkedInProfile()){
        //         console.log("Got DOM")
        //         clearInterval(myInterval);
        //     }else{
        //         console.log("Not found!")
        //     }
        // }, 5000);
    })
}

function accountDropdown(){
    shadowRoot.getElementById('account_dropdown').addEventListener('click', () => {
        $(shadowRoot.getElementById('drop_down')).slideToggle(800);
        $(shadowRoot.getElementById('app_container')).fadeToggle(200);
        
    })
}
// window.onload = function(){
    // if(location.href != 'https://www.linkedin.com/feed/')
    
// }
// window.addEventListener("load", function load(event){
//     window.removeEventListener("load", load, false); //remove listener, no longer needed
    
// },false);
$(document).ready(function(){
    var pattern = /linkedin.com\/in/;
    // if(location.href != 'https://www.linkedin.com/feed/' || location.href != 'https://www.linkedin.com/mynetwork/' || location.href != 'https://www.linkedin.com/jobs/' || location.href != 'https://www.linkedin.com/notifications/?filter=all'){
    if(location.href.match(pattern)!= null){
        getProfileDetailsFromAPI();
        console.log("Valid URL"); 
    }else{
        shadowRoot.getElementById('app_container').innerHTML = noProfileHTML;
    }
});
