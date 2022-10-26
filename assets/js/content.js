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
    getProfileDetailsFromAPI();
}

const getProfileDetailsFromAPI = () => {
    let linkedin_url = location.href.replace(/(^\w+:|^)\/\//, '').replace('www.','')
    url_array = linkedin_url.split("/in/");
    if(url_array!==undefined){
        tmp_url = url_array[1].split("/")
        console.log(tmp_url);
    }
    linkedin_url = "linkedin.com/in/"+tmp_url[0];
    chrome.runtime.sendMessage({call: "getProfile", link: linkedin_url}, function(response) {
        console.log(response);
        let res = JSON.parse(response);
        if(res.dynamowebs_status=="success"){
            if(document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]').length > 0){
                var pic = document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]');
            }else if(document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]').length > 0){
                var pic = document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]');
            }   
            shadowRoot.getElementById('contact_found_detail').innerHTML = contact_detail_api;
            shadowRoot.getElementById('linkedInProfileName').innerText = res.name;
            shadowRoot.getElementById('linkedInProfileImg').src = pic[0].src//res.image;
            let ul_phones = shadowRoot.getElementById('phoneNumbers');
            ul_phones.innerHTML = null;
            res.phoneNumbers.forEach(el => {
               
                var li = document.createElement('li');
                if(el.verified == true)
                    li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ el.countryCode + el.number;
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
                    li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ strMask(el.email);
                else{
                    li.innerHTML = ' '+ strMask(el.email) ;
                    li.className = 'not-verified';
                }
                ul_proEmails.appendChild(li);
            });
            let ul_perEmails = shadowRoot.getElementById('perEmails');
            ul_perEmails.innerHTML = null;
            res.personalEmail.forEach(el =>{
                var li = document.createElement('li');
                if(el.verified == true)
                    li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ strMask(el.email);
                else{
                    li.innerHTML = ' '+ strMask(el.email) ;
                    li.className = 'not-verified';
                }
                ul_perEmails.appendChild(li);
            })
            shadowRoot.getElementById('companyName').innerText = res.companyInformation[0].name;
            shadowRoot.getElementById('companyWebsite').href = res.companyInformation[0].website;
            console.log(res.otherSocialMedia.facebook);
            shadowRoot.getElementById('fbURL').innerText = strMask(res.otherSocialMedia.facebook);

        }else{
            // if(res.message == "Token is invalid renew your token. error-code :: 293403924"){
            if(res.message.includes("Token is invalid renew your token.")){
                chrome.storage.local.get(['session'], function(result) {
                    var session = JSON.parse(result.session);

                    chrome.runtime.sendMessage({call: "validateUser", email: session.email, password: session.pass}, function(response) {
                        let res = JSON.parse(response);
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
                            shadowRoot.getElementById('account_dropdown').addEventListener('click', () => {
                                $(shadowRoot.getElementById('drop_down')).slideToggle(800);
                                $(shadowRoot.getElementById('app_container')).fadeToggle(400);
                                
                            })
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
                shadowRoot.getElementById('account_dropdown').addEventListener('click', () => {
                    $(shadowRoot.getElementById('drop_down')).slideToggle(800);
                    $(shadowRoot.getElementById('app_container')).fadeToggle(400);
                    
                })
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
        shadowRoot.getElementById('popup').innerHTML = account_html;
        shadowRoot.getElementById('account_dropdown').addEventListener('click', () => {
            $(shadowRoot.getElementById('drop_down')).slideToggle(800);
            $(shadowRoot.getElementById('app_container')).fadeToggle(400);
            
        })
        shadowRoot.getElementById('logout').addEventListener('click',() => {
            shadowRoot.getElementById('popup').innerHTML = login_html;
            shadowRoot.getElementById('signin').addEventListener('click',()=>{signedIn()})
        })
    }
})

getProfileDetailsFromAPI();