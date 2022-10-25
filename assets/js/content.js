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
    shadowRoot.getElementById('linkedInProfileImg').src = chrome.runtime.getURL('assets/icons/spinner.gif');
    shadowRoot.getElementById('linkedInProfileName').innerHTML = `
    <div class="load-2">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>`;
    // setTimeout(getLinkedInProfile(),5000);
    var myInterval = setInterval(function () {
        if(getLinkedInProfile()){
            console.log("Got DOM")
            clearInterval(myInterval);
        }else{
            console.log("Not found!")
        }
    }, 5000);
    // $.get(location.href, function(data, status){
    //     if(status == "success"){
    //         var parser = new DOMParser();
    //         var document = parser.parseFromString(data, 'text/html');
    //         console.log(document);
    //     }
    //   });
    //   chrome.runtime.sendMessage({call: "getDOM", url:location.href}, function(response) {
    //     alert(response);
    //         // getLinkedInProfile(response)
    //   });
    //   getLinkedInProfile()
}

// chrome.runtime.sendMessage({call: "getDOM", url:location.href}, function(response) {
   
//     var parser = new DOMParser();
//     var htmlDoc = parser.parseFromString(response, 'text/html');
//     console.log(htmlDoc.body);
//         // getLinkedInProfile(response)
//   });

var myInterval = setInterval(function () {
    if(getLinkedInProfile()){
        console.log("Got DOM")
        clearInterval(myInterval);
    }else{
        console.log("Not found!")
    }
}, 5000);


const getLinkedInProfile = () => {
    // var parser = new DOMParser();
    // var document = parser.parseFromString(text, 'text/html');
    // console.log(document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]'));
    let linkedin_url = location.href.replace(/(^\w+:|^)\/\//, '').replace('www.','')
    url_array = linkedin_url.split("/in/");
    tmp_url = url_array[1].split("/")
    console.log(tmp_url);
    linkedin_url = "linkedin.com/in/"+tmp_url[0]
    chrome.runtime.sendMessage({call: "getProfile", link: linkedin_url}, function(response) {
        console.log(response);
        let res = JSON.parse(response);
        if(res.dynamowebs_status=="success"){
            shadowRoot.getElementById('contact_found_detail').innerHTML = contact_detail_api;
            shadowRoot.getElementById('linkedInProfileName').innerText = res.firstName + " " + res.lastName;
            shadowRoot.getElementById('linkedInProfileImg').src = res.image;
        }else{
            shadowRoot.getElementById('contact_found_detail').innerHTML = contact_detail_linkedIn;
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
        }
    })
   
   

}

// shadowRoot.getElementById('signin').addEventListener('click',()=>{signedIn()})

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
                chrome.storage.local.set({loggedin: true}, function() {
                    console.log('Value is set to ' + value);
                });
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
            shadowRoot.getElementById('loginMsg').innerText = res.dynamowebs_msg;
        });
    }
   
}

chrome.storage.local.get(['loggedin'], function(result) {
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