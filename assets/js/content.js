chrome.runtime.onMessage.addListener(function(msg, sender) {
    switch (msg) {
        case "toggle":
            return $(shadowRoot.getElementById('popup')).fadeToggle();
        case "complete":
            return loading_flag = false, init();
    }
});
let lastUrl = location.href; 
new MutationObserver(() => {
const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        chrome.storage.local.get(['loggedin'], function(result) {
            if(result.loggedin){
                onUrlChange();
            }
        })
    }
}).observe(document, {subtree: true, childList: true});

function scrapeLinkedInProfile(type){
    let base64Img;
    // if(document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]').length > 0){
    //     var pic = document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]')[0];
    // }else if(document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]').length > 0){
    //     var pic = document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]')[0];
    // }else{
    //     var pic = document.querySelector('[class*="ghost-person"]')
    // }
    if(document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]').length > 0){
        profile_image = document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]')[0].src;
    }else if(document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]').length > 0){
        profile_image = document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]')[0].src;
    }
    // else{
    //     profile_image = chrome.runtime.getURL('assets/icons/logo.png');
    // }
    if(profile_image !==''){
        toDataURL(profile_image).then(dataUrl => {
            // console.log(dataUrl);
            base64Img = dataUrl;  
            var linkedInObj = {
                linkedinURL: location.href,
                profile_image: dataUrl,
                name: profile_name,
                address_details: {},
                experience: [],
                education: [],
                certification:[],
                languages: [],
                about: ''
            }
            if(document.querySelectorAll('div[class*="text-body-medium break-words"]').length > 0){
                linkedInObj['profile_heading'] = document.querySelectorAll('div[class*="text-body-medium break-words"]')[0].innerText;
            }
            if(document.getElementById('main')!==null){
                if(document.getElementById('main').children[0].children[1].children[1].children[2]!== undefined){
                    linkedInObj['location'] = document.getElementById('main').children[0].children[1].children[1].children[2].children[0].innerText;
                    linkedInObj.address_details = ParseAddressEsri(document.getElementById('main').children[0].children[1].children[1].children[2].children[0].innerText);
                }
            }
            if(document.getElementById('about')!==null){
                linkedInObj.about =  document.getElementById('about').nextElementSibling.nextElementSibling.children[0].children[0].children[0].children[0].innerText;
            }
            if(document.getElementById('experience') !== null){
                var experiences = document.getElementById('experience').nextElementSibling.nextElementSibling.children[0].children;
                for(var i=0; i<experiences.length;i++){
                    if(experiences[i].children[0].children[1].children[0].children[0].children[2]!==undefined){
                        var time_length = experiences[i].children[0].children[1].children[0].children[0].children[2].children[0].innerText;
                        var dates = time_length.split('·');
                        var dates_array = dates[0].trim().split('-');
                        var start_date = new Date(dates_array[0].trim());
                        var end_date = (dates_array[1]!==undefined) ? (dates_array[1].trim() == "Present" ? new Date() : new Date(dates_array[1].trim())) : '';
                    }else{
                        var start_date = new Date();
                        var end_date = new Date() ;
                    }
                    var obj = { 
                        job_title : experiences[i].children[0].children[1].children[0].children[0].children[0].children[0].children[0].innerText,
                        organization_name: experiences[i].children[0].children[1].children[0].children[0].children[1].children[0].innerText,
                        time_length: experiences[i].children[0].children[1].children[0].children[0].children[2]===undefined ? null : experiences[i].children[0].children[1].children[0].children[0].children[2].children[0].innerText,
                        start_time: moment(start_date).format('YYYY-MM-DD'),
                        end_time: moment(end_date).format('YYYY-MM-DD'),
                        url: experiences[i].children[0].children[0].children[0].href
                    }
                    if(experiences[i].children[0].children[1].children[0].children[0].children[3]!==undefined)
                    obj['job_location'] = experiences[i].children[0].children[1].children[0].children[0].children[3].children[0].innerText
                    linkedInObj.experience .push(obj);
                }
            }
            if(document.getElementById('education') !== null){
                var educations = document.getElementById('education').nextElementSibling.nextElementSibling.children[0].children;
                for(var i=0; i<educations.length;i++){
                    //var dates_array
                    var obj = {
                        institution_name: educations[i].children[0].children[1].children[0].children[0].children[0].children[0].children[0].innerText,
                        field_of_study: educations[i].children[0].children[1].children[0].children[0].children[1].innerText,
                        length_of_study: '',
                        start_time: '',
                        end_time: '',
                        url: educations[i].children[0].children[0].children[0].href
                    }
                    if(educations[i].children[0].children[1].children[0].children[0].children[2] !== undefined){
                        var year = educations[i].children[0].children[1].children[0].children[0].children[2].children[0].innerText.trim().split(' - ');
                        obj.length_of_study = educations[i].children[0].children[1].children[0].children[0].children[2].children[0].innerText;
                        obj.start_time = year[0].trim();
                        obj.end_time = year[1].trim();
                    }
                    linkedInObj.education.push(obj);
                }
            }
            if(document.getElementById('licenses_and_certifications') !== null){
                var certification = document.getElementById('licenses_and_certifications').nextElementSibling.nextElementSibling.children[0].children;
                for(var i=0; i<certification.length;i++){
                    var obj = {
                        certification_name: certification[i].children[0].children[1].children[0].children[0].children[0].children[0].children[0].innerText,
                        issuing_organization: '',
                        validity: '',
                        issue_date: '',
                        expiration_date: '',
                        url: certification[i].children[0].children[0].children[0].href
                    }
                    if(certification[i].children[0].children[1].children[0].children[0].children[1] !== undefined){
                        obj.issuing_organization = certification[i].children[0].children[1].children[0].children[0].children[1].children[0].innerText;
                    }
                    if(certification[i].children[0].children[1].children[0].children[0].children[2] !== undefined){
                        obj.validity = certification[i].children[0].children[1].children[0].children[0].children[2].children[0].innerText;
                        var dates_array = certification[i].children[0].children[1].children[0].children[0].children[2].children[0].innerText.trim().split('·');
                        var start_date = new Date(dates_array[0].trim());
                        var end_date = (dates_array[1]!==undefined) ? dates_array[1].trim() == "No Expiration Date" ? new Date() : new Date(dates_array[1].trim()) : '';
                        obj.issue_date = moment(start_date).format('YYYY-MM-DD');
                        obj.expiration_date =  moment(end_date).format('YYYY-MM-DD');
                    }
                    if(certification[i].children[0].children[1].children[0].children[0].children[3] !== undefined){
                        obj["credential_ID"] = certification[i].children[0].children[1].children[0].children[0].children[3].children[0].innerText;
                    }
                    if(certification[i].children[0].children[1].children[1]!== undefined){
                        obj['credential_URL'] = certification[i].children[0].children[1].children[1].querySelector('a').href
                    }
                    linkedInObj.certification.push(obj);
                }
            }
            if(document.getElementById('languages') !== null){
                var languages = document.getElementById('languages').nextElementSibling.nextElementSibling.children[0].children;
                for(var i=0; i<languages.length;i++){
                    var obj ={
                        language: languages[i].children[0].children[1].children[0].children[0].children[0].children[0].children[0].innerText,
                        proficiency: (languages[i].children[0].children[1].children[0].children[0].children[1] !== undefined) ? languages[i].children[0].children[1].children[0].children[0].children[1].children[0].innerText : ''
                    }
                    linkedInObj.languages.push(obj);
                }
            }
            if(type === 1){
                chrome.runtime.sendMessage({call: "sendScrapedProfile", body: JSON.stringify(linkedInObj)}, function(response) {
                    // console.log(response);
                })
            }else if(type === 0){
                shadowRoot.getElementById('addToWaiting').innerHTML = 'Adding to waiting list' + '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>'
                
                chrome.runtime.sendMessage({call: "addProfile", body: JSON.stringify(linkedInObj)}, function(response) {
                    // console.log(response);
                    var res = JSON.parse(response);
                    if(res.dynamowebs_status === "success"){
                        shadowRoot.getElementById('addToWaiting').innerHTML = "Added to waiting list";
                    }
                })
            }
        })
    }
}

function onUrlChange() {
    if(shadowRoot.getElementById('badge')!==null){
        shadowRoot.getElementById('badge').remove();
        // chrome.runtime.sendMessage({call: "setBadge", count: ''});
    }
    shadowRoot.getElementById('icon').src = chrome.runtime.getURL("assets/img/logo.gif");
    getUserInfoFromAPI();
    getCredits();
    var pattern = /linkedin.com\/in/;
    if(location.href.match(pattern)!= null){
        getProfileDetailsFromAPI();
        console.log('valid URL');
       
    }else{
        shadowRoot.getElementById('app_container').innerHTML = noProfileHTML;
        changeLangNoProfile(lang);
        shadowRoot.getElementById('icon').src = chrome.runtime.getURL("assets/icons/icon48.png");
    }
}
function clickedLeadAdd(res){
    var linkedin_url = location.origin+location.pathname;
    chrome.runtime.sendMessage({call: "addLeadToList", link: linkedin_url, id: "1"}, function(response) {
        console.log(response);
    })
    shadowRoot.getElementById('addLeadDiv').classList.remove('text-center');
    shadowRoot.getElementById('addLeadDiv').innerHTML = ` 
    <!--div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="leadAdded" checked>
        <label class="form-check-label">Lead Added</label>
    </div-->
    <div class="d-flex leadAddMsg" id="leadAddMsg">
        <div class="tick-mark">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
        </div>
        <label class="form-check-label" id="lblLeadAdded">Lead Added</label>
    </div>
    <div class="d-flex justify-content-between">
        <div class="p-2">
            <select id="bookmarkLists">
            </select>
        </div>
        <!--button class="btn-export">Export</button-->
        <div class="p-0">
            <button class="m-2 round-small-button btn-edit" id="editLead"></button>
            <button class="m-2 round-small-button btn-refresh" id="refresh"></button>
        </div>
    </div>
        `;
    chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
        let msg = JSON.parse(response);
        $(shadowRoot.getElementById('lblLeadAdded')).text(msg.lblLeadAdded.message);
    });
    $(shadowRoot.getElementById('leadAddMsg')).fadeIn(800);
    setTimeout(function(){
        $(shadowRoot.getElementById('leadAddMsg')).fadeOut(800);
    },10000)
    // shadowRoot.getElementById('editLead').addEventListener('click', () => {
    $(shadowRoot.getElementById('editLead')).off('click').on('click', () => {
        editLead(res);
        shadowRoot.getElementById('btnBack').style.display = "block";
    });
    // shadowRoot.getElementById('refresh').addEventListener('click', () => {
    $(shadowRoot.getElementById('refresh')).off('click').on('click', () => {
        refresh();
    });
    chrome.runtime.sendMessage({call: "getAllList"}, function(response) {
        lists = JSON.parse(response);
        lists.list.forEach((list) =>{
            var opt = document.createElement('option');
            opt.innerText = list.list_name;
            opt.value = list.list_id;
            shadowRoot.getElementById('bookmarkLists').appendChild(opt);
        })
      
    })
}
const getProfileDetailsFromAPI = () => {
    shadowRoot.getElementById('icon').src = chrome.runtime.getURL("assets/img/logo.gif");
    shadowRoot.getElementById('app_container').innerHTML = contactSearchHTML;
    var linkedin_url = location.origin+location.pathname;
    chrome.runtime.sendMessage({call: "getProfile", link: linkedin_url}, function(response) {
        if(response!== null || response!= '' || response!== 'null' ){
            var  res = JSON.parse(response);
            let profile_detail_res = JSON.parse(response);
            if(res.dynamowebs_status=="success"){
                chrome.storage.local.get('autoOpen', function(result){
                    if(result.autoOpen){
                        $(shadowRoot.getElementById('popup')).fadeIn()
                    }
                })
                if(res.masked){
                    shadowRoot.getElementById('contact_found_detail').innerHTML = contact_detail_api;
                    changeLangContactLockedDetail(lang);
                }else{
                    shadowRoot.getElementById('app_container').innerHTML = leadUnlocked;
                    changeLangContactDetail(lang);
                }
               
                setTimeout(function(){
                    let count = res.phoneNumbers.length + res.personalEmail.length + res.professionalEmail.length;
                   
                    if(count>0){
                        chrome.runtime.sendMessage({call: "setBadge", count: count});
                        // let badge_html = `<span id="badge" class="widget-notification">${count}</span>`;
                        // var btn_main = shadowRoot.getElementById('icon_button');
                        // btn_main.innerHTML = badge_html + btn_main.innerHTML;
                        if(shadowRoot.getElementById('badge')===null){
                            let badge = document.createElement('span');
                            badge.id = 'badge';
                            badge.className = "widget-notification";
                            badge.innerText = count;
                            shadowRoot.getElementById('icon_button').prepend(badge);
                        }else{
                            shadowRoot.getElementById('badge').innerText = count;
                        }
                    }else{
                        if(shadowRoot.getElementById('badge')!==null){
                            shadowRoot.getElementById('badge').remove();
                        }
                    }
                    scrapeLinkedInProfile(1);
                    // if(document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]').length > 0){
                    //     var pic = document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]')[0];
                    // }else if(document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]').length > 0){
                    //     var pic = document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]')[0];
                    // }else{
                    //     var pic = document.querySelector('[class*="ghost-person"]');
                    // }
               
                    if(document.getElementById('experience')!== null){
                        var jobTitle = document.getElementById('experience').nextElementSibling.nextElementSibling.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].innerText;
                    }else{
                        var jobTitle = '';
                    }
                    if(res.name === undefined || res.name === '' || res.name === null){
                        res['name'] = profile_name;
                    }
                    // res['image'] = pic.src;
                    if(res.image === undefined || res.image === '' || res.image === null){
                        res['image'] = profile_image;
                    }
                    // profile_detail_res['image'] = pic.src;
                    if(profile_detail_res.image === undefined || profile_detail_res.image === '' || profile_detail_res.image === null){
                        profile_detail_res['image'] = profile_image;
                    }
                    res['jobtitle'] = jobTitle;
                    if(profile_detail_res.jobtitle === undefined || profile_detail_res.jobtitle === '' || profile_detail_res.jobtitle === null){
                        profile_detail_res['jobtitle'] = jobTitle;
                    }
                    shadowRoot.getElementById('linkedInProfileName').innerText = res.name;
                    shadowRoot.getElementById('linkedInProfileImg').src = res.image
                    if(res.phoneNumbers.length>0){
                        shadowRoot.getElementById('phoneNumbersBlock').style.display = "block";
                        let ul_phones = shadowRoot.getElementById('phoneNumbers');
                        ul_phones.innerHTML = null;
                        res.phoneNumbers.forEach(el => {   
                            var li = document.createElement('li');
                            if(el.verified == true)
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg>'+ el.countryCode + el.number + '</div>' +(!res.masked ? '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1btn-small btn-thumbs-down"></button></div></div>':'</div>');
                            else{
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.countryCode + el.number + '</div>' + (!res.masked ? '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>':'</div>');
                                li.className = 'not-verified';
                            }
                            ul_phones.appendChild(li);
                        });
                    }else{
                        shadowRoot.getElementById('phoneNumbersBlock').style.display = "none";
                    }
                    if(res.professionalEmail.length>0){
                        shadowRoot.getElementById('proEmailsBlock').style.display = "block";
                        let ul_proEmails = shadowRoot.getElementById('proEmails');
                        ul_proEmails.innerHTML = null;
                        res.professionalEmail.forEach(el =>{
                            var li = document.createElement('li');
                            if(el.verified == true)
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ el.email  + '</div>'+ (!res.masked ? '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1btn-small btn-thumbs-down"></button></div></div>':'</div>');
                            else{
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.email + '</div>' + (!res.masked ? '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>':'</div>');
                                li.className = 'not-verified';
                            }
                            ul_proEmails.appendChild(li);
                        });
                    }else{
                        shadowRoot.getElementById('proEmailsBlock').style.display = "none";
                    }
                    if(res.personalEmail.length>0){
                        shadowRoot.getElementById('perEmailsBlock').style.display = "block";
                        let ul_perEmails = shadowRoot.getElementById('perEmails');
                        ul_perEmails.innerHTML = null;
                        res.personalEmail.forEach(el =>{
                            var li = document.createElement('li');
                            if(el.verified == true)
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> '+ el.email  + '</div>'+ (!res.masked ? '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>':'</div>');
                            else{
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.email + '</div>' + (!res.masked ? '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>':'</div>');
                                li.className = 'not-verified';
                            }
                            ul_perEmails.appendChild(li);
                        })
                    }else{
                        shadowRoot.getElementById('perEmailsBlock').style.display = "none";
                    }
                    if(res.companyInformation.length > 0 || (res.companyInformation[0].mainIndustry.toString() !== "" && res.companyInformation[0].employees.toString() !== "" && res.companyInformation[0].headQuarters.toString() !== "" && res.companyInformation[0].founded.toString() !== "")){
                        shadowRoot.getElementById('companyBlock').style.display = "block";
                        shadowRoot.getElementById('companyName').innerText = res.companyInformation[0].name;
                        if(res.companyInformation[0].website === null || res.companyInformation[0].website == ''){
                            shadowRoot.getElementById('companyWebsite').parentElement.style.display = "none";
                        }else{
                            shadowRoot.getElementById('companyWebsite').parentElement.style.display = "block";
                            shadowRoot.getElementById('companyWebsite').href = res.companyInformation[0].website;
                        }
                    }
                    if(!res.masked){
                        shadowRoot.getElementById('jobTitle').innerText = jobTitle;
                        console.log(res.otherSocialMedia.length);
                        // if(typeof res.otherSocialMedia === "object" && res.otherSocialMedia.length > 0){
                        if(res.otherSocialMedia.facebook !== null || res.otherSocialMedia.linkedin !== null || res.otherSocialMedia.instagram !== null || res.otherSocialMedia.twitter !== null){
                            let ul_socialMedia = shadowRoot.getElementById('social_media');
                            ul_socialMedia.innerHTML = null;
                            var li = document.createElement('li');
                            if(res.otherSocialMedia.facebook !== null){
                                var li = document.createElement('li');
                                li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30.033" height="30.033" viewBox="0 0 30.033 30.033"><path id="Icon_awesome-facebook-square" data-name="Icon awesome-facebook-square" d="M26.816,2.25H3.218A3.218,3.218,0,0,0,0,5.468v23.6a3.218,3.218,0,0,0,3.218,3.218h9.2V22.073H8.2V17.267h4.223V13.6c0-4.166,2.48-6.468,6.28-6.468a25.587,25.587,0,0,1,3.722.324V11.55h-2.1a2.4,2.4,0,0,0-2.71,2.6v3.121h4.611l-.737,4.806H17.614V32.283h9.2a3.218,3.218,0,0,0,3.218-3.218V5.468A3.218,3.218,0,0,0,26.816,2.25Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.facebook;
                                ul_socialMedia.appendChild(li);
                            }
                            if(res.otherSocialMedia.linkedin !== null){
                                var li = document.createElement('li');
                                li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="29.139" height="29.139" viewBox="0 0 29.139 29.139"><path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M27.057,2.25H2.075A2.09,2.09,0,0,0,0,4.351V29.288a2.09,2.09,0,0,0,2.075,2.1H27.057a2.1,2.1,0,0,0,2.081-2.1V4.351A2.1,2.1,0,0,0,27.057,2.25ZM8.807,27.226H4.488V13.32H8.813V27.226ZM6.647,11.421a2.5,2.5,0,1,1,2.5-2.5A2.505,2.505,0,0,1,6.647,11.421ZM25,27.226H20.677V20.462c0-1.613-.033-3.688-2.244-3.688-2.25,0-2.6,1.756-2.6,3.571v6.881H11.519V13.32h4.143v1.9h.059a4.549,4.549,0,0,1,4.091-2.244C24.183,12.975,25,15.857,25,19.6Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.linkedin;
                                ul_socialMedia.appendChild(li);
                            }
                            if(res.otherSocialMedia.instagram !== null){
                                var li = document.createElement('li');
                                li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.instagram;
                                ul_socialMedia.appendChild(li);
                            }
                            if(res.otherSocialMedia.twitter !== null){
                                var li = document.createElement('li');
                                li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.twitter;
                                ul_socialMedia.appendChild(li);
                            }
                            shadowRoot.getElementById('socialMediaBlock').style.display = "block";
                        }else{
                            shadowRoot.getElementById('socialMediaBlock').style.display = "none"
                        }
                        if(res.companyInformation.length > 0 || (res.companyInformation[0].mainIndustry !== "" && res.companyInformation[0].employees !== "" && res.companyInformation[0].headQuarters !== "" && res.companyInformation[0].founded !== "")){
                            shadowRoot.getElementById('companyName').innerText = res.companyInformation[0].name;
                            
                            if(res.companyInformation[0].website === null || res.companyInformation[0].website == ''){
                                shadowRoot.getElementById('companyWebsite').parentElement.style.display = "none";
                            }else{
                                shadowRoot.getElementById('companyWebsite').parentElement.style.display = "block";
                                shadowRoot.getElementById('companyWebsite').href = res.companyInformation[0].website;
                            }
                            if(res.companyInformation[0].mainIndustry===undefined || res.companyInformation[0].mainIndustry == "" || res.companyInformation[0].mainIndustry === null){
                                shadowRoot.getElementById('industryBlock').style.display = "none";
                            }else{
                                shadowRoot.getElementById('industryBlock').style.display = "block";
                                shadowRoot.getElementById('industry').innerText = res.companyInformation[0].mainIndustry;
                            }
                            if(res.companyInformation[0].employees===undefined || res.companyInformation[0].employees == "" || res.companyInformation[0].employees === null){
                                shadowRoot.getElementById('employeeBlock').style.display = "none";
                            }else{
                                shadowRoot.getElementById('employeeBlock').style.display = "block";
                                shadowRoot.getElementById('employeeCount').innerText = res.companyInformation[0].employees;
                            }
                            if(res.companyInformation[0].headQuarters===undefined || res.companyInformation[0].headQuarters == "" || res.companyInformation[0].headQuarters === null){
                                shadowRoot.getElementById('headquarterBlock').style.display = "none";
                            }else{
                                shadowRoot.getElementById('headquarterBlock').style.display = "block";
                                shadowRoot.getElementById('hq').innerText = res.companyInformation[0].headQuarters;
                            }
                            if(res.companyInformation[0].founded===undefined || res.companyInformation[0].founded == "" || res.companyInformation[0].founded === null){
                                shadowRoot.getElementById('historyBlock').style.display = "none";
                            }
                            else{
                                shadowRoot.getElementById('historyBlock').style.display = "block";
                                shadowRoot.getElementById('foundedIn').innerHTML = `<label class="social-media-icon">Founded in : ${res.companyInformation[0].founded}</label>`;
                            }
                            shadowRoot.getElementById('companyBlock').style.display = "block";

                            // shadowRoot.getElementById('companyDetailsToggle').addEventListener('click', () => {
                            $(shadowRoot.getElementById('companyDetailsToggle')).off('click').on('click', () => {
                                $(shadowRoot.getElementById('companyDetails')).slideToggle(800);
                                // if (shadowRoot.getElementById('companyDetailsToggle').innerText === "Show company details") {
                                //     shadowRoot.getElementById('companyDetailsToggle').innerText = "Hide company details";
                                // }else{
                                //     shadowRoot.getElementById('companyDetailsToggle').innerText = "Show company details";
                                // }
                                chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
                                    let msg = JSON.parse(response);
                                    if (shadowRoot.getElementById('companyDetailsToggle').innerText === msg.scd.message) {
                                        shadowRoot.getElementById('companyDetailsToggle').innerText = msg.hcd.message;
                                    }else{
                                        shadowRoot.getElementById('companyDetailsToggle').innerText = msg.scd.message;
                                    }
                                });
                            })
                        }else{
                            shadowRoot.getElementById('companyBlock').style.display = "none"
                            shadowRoot.getElementById('companyDetails').style.display = "none";
                            shadowRoot.getElementById('companyToggleBtnBlock').style.display = "none";
                        }
                        if (res.companyInformation[0].mainIndustry.toString() == "" && res.companyInformation[0].employees.toString() == "" && res.companyInformation[0].headQuarters.toString() == "" && res.companyInformation[0].founded.toString() == ""){
                            shadowRoot.getElementById('companyDetails').style.display = "none";
                            shadowRoot.getElementById('companyToggleBtnBlock').style.display = "none";
                        }
                        var linkedin_url = location.origin+location.pathname;
                        chrome.runtime.sendMessage({call: "isOnList", link: linkedin_url}, function(response) {
                            let isOnlist = JSON.parse(response)
                            if(isOnlist.is_assigned){
                                shadowRoot.getElementById('addLeadDiv').classList.remove('text-center');
                                shadowRoot.getElementById('addLeadDiv').innerHTML = ` 
                                <!--div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="leadAdded" checked>
                                    <label class="form-check-label">Lead Added</label>
                                </div-->
                                <div class="d-flex leadAddMsg" id="leadAddMsg">
                                    <div class="tick-mark">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                                    </div>
                                    <label class="form-check-label" id="lblLeadAdded">Lead Added</label>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <div class="p-2">
                                        <select id="bookmarkLists">
                                        </select>
                                    </div>
                                    <!--button class="btn-export">Export</button-->
                                    <div class="p-0">
                                        <button class="m-2 round-small-button btn-edit" id="editLead"></button>
                                        <button class="m-2 round-small-button btn-refresh" id="refresh"></button>
                                    </div>
                                </div>
                                `;
                                chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
                                    let msg = JSON.parse(response);
                                    $(shadowRoot.getElementById('lblLeadAdded')).text(msg.lblLeadAdded.message);
                                });
                                // shadowRoot.getElementById('editLead').addEventListener('click', () => {
                                $(shadowRoot.getElementById('editLead')).off('click').on('click', () => {
                                    editLead(profile_detail_res);
                                    shadowRoot.getElementById('btnBack').style.display = "block";
                                });
                                // shadowRoot.getElementById('refresh').addEventListener('click', () => {
                                $(shadowRoot.getElementById('refresh')).off('click').on('click', () => {
                                    refresh();
                                });
                                chrome.runtime.sendMessage({call: "getAllList"}, function(response) {
                                    lists = JSON.parse(response);
                                    lists.list.forEach((list) =>{
                                        var opt = document.createElement('option');
                                        opt.innerText = list.list_name;
                                        opt.value = lists.list_id;
                                        shadowRoot.getElementById('bookmarkLists').appendChild(opt);
                                    });
                                })
                            }else{
                                shadowRoot.getElementById('addLeadDiv').innerHTML = '<button class="btn btn-secondary add-lead" id="addLead">Add lead</button>';
                                // shadowRoot.getElementById('addLead').addEventListener('click', () => {
                                $(shadowRoot.getElementById('addLead')).off('click').on('click', () => {
                                    clickedLeadAdd(profile_detail_res);
                                });
                                chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
                                    let msg = JSON.parse(response);
                                    shadowRoot.getElementById('addLeadDiv').innerHTML = `<button class="btn btn-secondary add-lead" id="addLead">${msg.alBtn.message}</button>`;
                                    $(shadowRoot.getElementById('addLead')).off('click').on('click', () => {
                                        clickedLeadAdd(profile_detail_res);
                                    });
                                });
                            }
                        });
                        shadowRoot.querySelectorAll('.btn-thumbs-up').forEach(function(element) {
                            element.addEventListener('click', () => {
                                var linkedin_url = location.origin+location.pathname;
                                chrome.runtime.sendMessage({call: "thumbsUp", link: linkedin_url}, function(response) {
                                    console.log(response);
                                });
                            });
                        });
                        shadowRoot.querySelectorAll('.btn-thumbs-down').forEach(function(element) {
                            element.addEventListener('click', () => {
                                var linkedin_url = location.origin+location.pathname;
                                chrome.runtime.sendMessage({call: "thumbsDown", link: linkedin_url}, function(response) {
                                    console.log(response);
                                });
                            });
                        });  
                    }else{
                        if(res.otherSocialMedia.facebook === undefined){
                            shadowRoot.getElementById('socialMediaBlock').style.display = "none"
                        }else{
                            shadowRoot.getElementById('socialMediaBlock').style.display = "block";
                            shadowRoot.getElementById('fbURL').innerText = res.otherSocialMedia.facebook;
                        }
                        if(res.companyInformation.length >0){
                            shadowRoot.getElementById('companyBlock').style.display = "blocks";
                            shadowRoot.getElementById('companyName').innerText = res.companyInformation[0].name;
                            if(res.companyInformation[0].website === null || res.companyInformation[0].website == ''){
                                shadowRoot.getElementById('companyWebsite').parentElement.style.display = "none";
                            }else{
                                shadowRoot.getElementById('companyWebsite').parentElement.style.display = "block";
                                shadowRoot.getElementById('companyWebsite').href = res.companyInformation[0].website;
                            }
                        }else{
                            shadowRoot.getElementById('companyBlock').style.display = "none";
                        }
                        shadowRoot.getElementById('unlockbuttoncontainer').innerHTML = '<button class="btn-unlock" id="btnUnlock">Unlock details</button>';
                        // shadowRoot.getElementById('btnUnlock').addEventListener('click', ()=> {unlockLead()});
                        $(shadowRoot.getElementById('btnUnlock')).off('click').on('click', ()=> {unlockLead()});
                        chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
                            let msg = JSON.parse(response);
                            shadowRoot.getElementById('unlockbuttoncontainer').innerHTML = `<button class="btn-unlock" id="btnUnlock" `+((lang == 'en')? '' : 'style="background-position-x: 10px;"')+`>${msg.udBtn.message}</button>`;
                            $(shadowRoot.getElementById('noCreditAlert')).text(msg.noCreditAlert.message);
                            $(shadowRoot.getElementById('btnUnlock')).off('click').on('click', ()=> {unlockLead()});
                        });
                    }
                },1000)
                
            }else if(res.dynamowebs_msg=="token_expired"){
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
                                accountDropdown();
                                shadowRoot.getElementById('logout').addEventListener('click',() => {
                                    logout();
                                })
                            }
                            getProfileDetailsFromAPI();
                        });
    
                    });
                }
                
            }else{
                shadowRoot.getElementById('unlockbuttoncontainer').innerHTML = null;
                shadowRoot.getElementById('contact_found_detail').innerHTML = contact_detail_linkedIn;
                changeLangContactFound(lang);
                shadowRoot.getElementById('addToWaiting').addEventListener('click', () => {
                    scrapeLinkedInProfile(0);
                })
                chrome.storage.local.get('autoSave', function(result){
                    if(result.autoSave){
                        shadowRoot.getElementById('addToWaiting').dispatchEvent(new Event("click"));
                    }
                })
            }
            shadowRoot.getElementById('icon').src = chrome.runtime.getURL("assets/icons/icon48.png")
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
        }, 1000);
    });
}

function backDetails(res){
    shadowRoot.getElementById('app_container').innerHTML = leadUnlocked;
    shadowRoot.getElementById('linkedInProfileName').innerText = res.name;
    shadowRoot.getElementById('linkedInProfileImg').src = res.image;
    shadowRoot.getElementById('jobTitle').innerText = res.jobtitle;

    if(res.phoneNumbers.length>0){
        shadowRoot.getElementById('phoneNumbers').style.display = "block";
        let ul_phones = shadowRoot.getElementById('phoneNumbers');
        ul_phones.innerHTML = null;
        res.phoneNumbers.forEach(el => {   
            var li = document.createElement('li');
            if(el.verified == true)
                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> ' + el.countryCode + el.number + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
            else{
                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.countryCode + el.number + '</div>' +'<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                li.className = 'not-verified';
            }
            ul_phones.appendChild(li);
        });
    }else{
        shadowRoot.getElementById('phoneNumbers').style.display = "none";
    }
    if(res.professionalEmail.length>0){
        shadowRoot.getElementById('proEmailsBlock').style.display = "block";
        let ul_proEmails = shadowRoot.getElementById('proEmails');
        ul_proEmails.innerHTML = null;
        res.professionalEmail.forEach(el =>{
            var li = document.createElement('li');
            if(el.verified == true)
                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> ' + el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
            else{
                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                li.className = 'not-verified';
            }
            ul_proEmails.appendChild(li);
        });
    }else{
        shadowRoot.getElementById('proEmailsBlock').style.display = "none";
    }
    // alert(res.personalEmail.length);
    if(res.personalEmail.length>0){
        shadowRoot.getElementById('perEmailsBlock').style.display = "block";
        let ul_perEmails = shadowRoot.getElementById('perEmails');
        ul_perEmails.innerHTML = null;
        res.personalEmail.forEach(el =>{
            var li = document.createElement('li');
            if(el.verified == true)
                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> ' + el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
            else{
                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                li.className = 'not-verified';
            }
            ul_perEmails.appendChild(li);
        })
    }else{
        shadowRoot.getElementById('perEmailsBlock').style.display = "none";
    }
    if(res.companyInformation.length > 0 || (res.companyInformation[0].mainIndustry !== "" && res.companyInformation[0].employees !== "" && res.companyInformation[0].headQuarters !== "" && res.companyInformation[0].founded !== "")){
        shadowRoot.getElementById('companyName').innerText = res.companyInformation[0].name;
        if(res.companyInformation[0].website === null || res.companyInformation[0].website == ''){
            shadowRoot.getElementById('companyWebsite').parentElement.style.display = "none";
        }else{
            shadowRoot.getElementById('companyWebsite').parentElement.style.display = "block";
            shadowRoot.getElementById('companyWebsite').href = res.companyInformation[0].website;
        }
        if(res.companyInformation[0].mainIndustry===undefined || res.companyInformation[0].mainIndustry == "" || res.companyInformation[0].mainIndustry === null){
            shadowRoot.getElementById('industryBlock').style.display = "none";
        }else{
            shadowRoot.getElementById('industryBlock').style.display = "block";
            shadowRoot.getElementById('industry').innerText = res.companyInformation[0].mainIndustry;
        }
        if(res.companyInformation[0].employees===undefined || res.companyInformation[0].employees == "" || res.companyInformation[0].employees === null){
            shadowRoot.getElementById('employeeBlock').style.display = "none";
        }else{
            shadowRoot.getElementById('employeeBlock').style.display = "block";
            shadowRoot.getElementById('employeeCount').innerText = res.companyInformation[0].employees;
        }
        if(res.companyInformation[0].headQuarters===undefined || res.companyInformation[0].headQuarters == "" || res.companyInformation[0].headQuarters === null){
            shadowRoot.getElementById('headquarterBlock').style.display = "none";
        }else{
            shadowRoot.getElementById('headquarterBlock').style.display = "block";
            shadowRoot.getElementById('hq').innerText = res.companyInformation[0].headQuarters;
        }
        if(res.companyInformation[0].founded===undefined || res.companyInformation[0].founded == '' || res.companyInformation[0].founded ===null){
            shadowRoot.getElementById('historyBlock').style.display = "none";
        }else{
            shadowRoot.getElementById('historyBlock').style.display = "block";
            shadowRoot.getElementById('foundedIn').innerHTML = `<label class="social-media-icon">Founded in : ${res.companyInformation[0].founded}</label>`;
        }
        shadowRoot.getElementById('companyBlock').style.display = "block";

        // shadowRoot.getElementById('companyDetailsToggle').addEventListener('click', () => {
        $(shadowRoot.getElementById('companyDetailsToggle')).off('click').on('click', () => {
            $(shadowRoot.getElementById('companyDetails')).slideToggle(800);
            // if (shadowRoot.getElementById('companyDetailsToggle').innerText === "Show company details") {
            //     shadowRoot.getElementById('companyDetailsToggle').innerText = "Hide company details";
            // }else{
            //     shadowRoot.getElementById('companyDetailsToggle').innerText = "Show company details";
            // }
            chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
                let msg = JSON.parse(response);
                if (shadowRoot.getElementById('companyDetailsToggle').innerText === msg.scd.message) {
                    shadowRoot.getElementById('companyDetailsToggle').innerText = msg.hcd.message;
                }else{
                    shadowRoot.getElementById('companyDetailsToggle').innerText = msg.scd.message;
                }
            });
        })
    }else{
        shadowRoot.getElementById('companyBlock').style.display = "none"
        shadowRoot.getElementById('companyDetails').style.display = "none";
        shadowRoot.getElementById('companyToggleBtnBlock').style.display = "none";
    }
    if (res.companyInformation[0].mainIndustry.toString() == "" && res.companyInformation[0].employees.toString() == "" && res.companyInformation[0].headQuarters.toString() == "" && res.companyInformation[0].founded.toString() == ""){
        shadowRoot.getElementById('companyDetails').style.display = "none";
        shadowRoot.getElementById('companyToggleBtnBlock').style.display = "none";
    }
    // if(typeof res.otherSocialMedia === "object" && res.otherSocialMedia.length > 0){
    if(res.otherSocialMedia.facebook !== null || res.otherSocialMedia.linkedin !== null || res.otherSocialMedia.instagram !== null || res.otherSocialMedia.twitter !== null){
        let ul_socialMedia = shadowRoot.getElementById('social_media');
        ul_socialMedia.innerHTML = null;
        var li = document.createElement('li');
        if(res.otherSocialMedia.facebook !== null){
            var li = document.createElement('li');
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30.033" height="30.033" viewBox="0 0 30.033 30.033"><path id="Icon_awesome-facebook-square" data-name="Icon awesome-facebook-square" d="M26.816,2.25H3.218A3.218,3.218,0,0,0,0,5.468v23.6a3.218,3.218,0,0,0,3.218,3.218h9.2V22.073H8.2V17.267h4.223V13.6c0-4.166,2.48-6.468,6.28-6.468a25.587,25.587,0,0,1,3.722.324V11.55h-2.1a2.4,2.4,0,0,0-2.71,2.6v3.121h4.611l-.737,4.806H17.614V32.283h9.2a3.218,3.218,0,0,0,3.218-3.218V5.468A3.218,3.218,0,0,0,26.816,2.25Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.facebook;
            ul_socialMedia.appendChild(li);
        }
        if(res.otherSocialMedia.linkedin !== null){
            var li = document.createElement('li');
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="29.139" height="29.139" viewBox="0 0 29.139 29.139"><path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M27.057,2.25H2.075A2.09,2.09,0,0,0,0,4.351V29.288a2.09,2.09,0,0,0,2.075,2.1H27.057a2.1,2.1,0,0,0,2.081-2.1V4.351A2.1,2.1,0,0,0,27.057,2.25ZM8.807,27.226H4.488V13.32H8.813V27.226ZM6.647,11.421a2.5,2.5,0,1,1,2.5-2.5A2.505,2.505,0,0,1,6.647,11.421ZM25,27.226H20.677V20.462c0-1.613-.033-3.688-2.244-3.688-2.25,0-2.6,1.756-2.6,3.571v6.881H11.519V13.32h4.143v1.9h.059a4.549,4.549,0,0,1,4.091-2.244C24.183,12.975,25,15.857,25,19.6Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.linkedin;
            ul_socialMedia.appendChild(li);
        }
        if(res.otherSocialMedia.instagram !== null){
            var li = document.createElement('li');
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.instagram;
            ul_socialMedia.appendChild(li);
        }
        if(res.otherSocialMedia.twitter !== null){
            var li = document.createElement('li');
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.twitter;
            ul_socialMedia.appendChild(li);
        }
        shadowRoot.getElementById('socialMediaBlock').style.display = "block";
    }else{
        shadowRoot.getElementById('socialMediaBlock').style.display = "none"
    }
    shadowRoot.getElementById('addLeadDiv').classList.remove('text-center');
    shadowRoot.getElementById('addLeadDiv').innerHTML = ` 
    <!--div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="leadAdded" checked>
        <label class="form-check-label">Lead Added</label>
    </div-->
    <div class="d-flex leadAddMsg" id="leadAddMsg">
        <div class="tick-mark">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
        </div>
        <label class="form-check-label" id="lblLeadAdded">Lead Added</label>
    </div>
    <div class="d-flex justify-content-between">
        <div class="p-2">
            <select id="bookmarkLists">
            </select>
        </div>
        <!--button class="btn-export">Export</button-->
        <div class="p-0">
            <button class="m-2 round-small-button btn-edit" id="editLead"></button>
            <button class="m-2 round-small-button btn-refresh" id="refresh"></button>
        </div>
    </div>
    `;

    chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
        let msg = JSON.parse(response);
        $(shadowRoot.getElementById('lblLeadAdded')).text(msg.lblLeadAdded.message);
    });
    chrome.runtime.sendMessage({call: "getAllList"}, function(response) {
        lists = JSON.parse(response);
        lists.list.forEach((list) =>{
            var opt = document.createElement('option');
            opt.innerText = list.list_name;
            opt.value = list.list_id;
            shadowRoot.getElementById('bookmarkLists').appendChild(opt);
        })
      
    })
    // shadowRoot.getElementById('editLead').addEventListener('click', () => {
    $(shadowRoot.getElementById('editLead')).off('click').on('click', () => {
        editLead(res);
        shadowRoot.getElementById('btnBack').style.display = "block";
    });
    // shadowRoot.getElementById('refresh').addEventListener('click', () => {
    $(shadowRoot.getElementById('refresh')).off('click').on('click', () => {
        refresh();
    });
    shadowRoot.querySelectorAll('.btn-thumbs-up').forEach(function(element) {
        element.addEventListener('click', () => {
            var linkedin_url = location.origin+location.pathname;
            chrome.runtime.sendMessage({call: "thumbsUp", link: linkedin_url}, function(response) {
                console.log(response);
            });
        });
    });
    shadowRoot.querySelectorAll('.btn-thumbs-down').forEach(function(element) {
        element.addEventListener('click', () => {
            var linkedin_url = location.origin+location.pathname;
            chrome.runtime.sendMessage({call: "thumbsDown", link: linkedin_url}, function(response) {
                console.log(response);
            });
        });
    });  
}

function editLead(res){
    shadowRoot.getElementById('app_container').innerHTML = leadEditHTML;
    changeLangEditLead(lang);
    var linkedin_url = location.origin+location.pathname;
    chrome.runtime.sendMessage({call: "getProfileData", link: linkedin_url}, function(response) {
        var res = JSON.parse(response);
        console.log(res);
        if(res.dynamowebs_status == "success"){
            shadowRoot.getElementById('name').value = res.data.name; //res.data.full_name;
            // shadowRoot.getElementById('lastName').value = res.data.last_name;
            shadowRoot.getElementById('job').value = res.data.title;
            shadowRoot.getElementById('location').value = res.data.address;
            shadowRoot.getElementById('description').value = res.data.description;
        }
    })
    if(res.companyInformation.length > 0){
        shadowRoot.getElementById('companyBlock').style.display = "block";
        shadowRoot.getElementById('companyName').innerText = res.companyInformation[0].name;
        if(res.companyInformation[0].website === null || res.companyInformation[0].website == ''){
            shadowRoot.getElementById('companyWebsite').parentElement.style.display = "none";
        }else{
            shadowRoot.getElementById('companyWebsite').parentElement.style.display = "block";
            shadowRoot.getElementById('companyWebsite').href = res.companyInformation[0].website;
        }
    }else{
        shadowRoot.getElementById('companyBlock').style.display = "none";
    }
    // if(typeof res.otherSocialMedia === "object" && res.otherSocialMedia.length > 0){
    if(res.otherSocialMedia.facebook !== null || res.otherSocialMedia.linkedin !== null || res.otherSocialMedia.instagram !== null || res.otherSocialMedia.twitter !== null){
        let ul_socialMedia = shadowRoot.getElementById('social_media');
        ul_socialMedia.innerHTML = null;
        var li = document.createElement('li');
        if(res.otherSocialMedia.facebook !== null){
            var li = document.createElement('li');
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30.033" height="30.033" viewBox="0 0 30.033 30.033"><path id="Icon_awesome-facebook-square" data-name="Icon awesome-facebook-square" d="M26.816,2.25H3.218A3.218,3.218,0,0,0,0,5.468v23.6a3.218,3.218,0,0,0,3.218,3.218h9.2V22.073H8.2V17.267h4.223V13.6c0-4.166,2.48-6.468,6.28-6.468a25.587,25.587,0,0,1,3.722.324V11.55h-2.1a2.4,2.4,0,0,0-2.71,2.6v3.121h4.611l-.737,4.806H17.614V32.283h9.2a3.218,3.218,0,0,0,3.218-3.218V5.468A3.218,3.218,0,0,0,26.816,2.25Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.facebook;
            ul_socialMedia.appendChild(li);
        }
        if(res.otherSocialMedia.linkedin !== null){
            var li = document.createElement('li');
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="29.139" height="29.139" viewBox="0 0 29.139 29.139"><path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M27.057,2.25H2.075A2.09,2.09,0,0,0,0,4.351V29.288a2.09,2.09,0,0,0,2.075,2.1H27.057a2.1,2.1,0,0,0,2.081-2.1V4.351A2.1,2.1,0,0,0,27.057,2.25ZM8.807,27.226H4.488V13.32H8.813V27.226ZM6.647,11.421a2.5,2.5,0,1,1,2.5-2.5A2.505,2.505,0,0,1,6.647,11.421ZM25,27.226H20.677V20.462c0-1.613-.033-3.688-2.244-3.688-2.25,0-2.6,1.756-2.6,3.571v6.881H11.519V13.32h4.143v1.9h.059a4.549,4.549,0,0,1,4.091-2.244C24.183,12.975,25,15.857,25,19.6Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.linkedin;
            ul_socialMedia.appendChild(li);
        }
        if(res.otherSocialMedia.instagram !== null){
            var li = document.createElement('li');
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.instagram;
            ul_socialMedia.appendChild(li);
        }
        if(res.otherSocialMedia.twitter !== null){
            var li = document.createElement('li');
            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.twitter;
            ul_socialMedia.appendChild(li);
        }
        shadowRoot.getElementById('socialMediaBlock').style.display = "block";
    }else{
        shadowRoot.getElementById('socialMediaBlock').style.display = "none"
    }
    // shadowRoot.getElementById('btnBack').addEventListener('click', (event) => {
    $(shadowRoot.getElementById('btnBack')).off('click').on('click', (event) => {
        backDetails(res);
        changeLangContactDetail(lang);
        event.target.style.display = "none";
    })
    // shadowRoot.getElementById('saveLead').addEventListener('click', () => {
    $(shadowRoot.getElementById('saveLead')).off('click').on('click', () => {
    
        chrome.runtime.sendMessage(
            {
                call: "updateProfileData",
                link: linkedin_url,
                full_name: shadowRoot.getElementById('name').value,
                // last_name: shadowRoot.getElementById('lastName').value,
                title: shadowRoot.getElementById('job').value,
                address: shadowRoot.getElementById('location').value,
                description: shadowRoot.getElementById('description').value
            }, function(response) {
            var res = JSON.parse(response);
            // console.log(res);
            // alert('test');
            if(res.dynamowebs_status == "success"){
                $(shadowRoot.getElementById('editStatusMsg')).fadeIn();
                setTimeout(() => {
                    $(shadowRoot.getElementById('editStatusMsg')).fadeOut();
                }, 1000);
            }
        });
    })
}

const getLinkedInProfile = () => {
    try{
        if(document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]').length > 0){
           profile_image = document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]')[0].src;
        }else if(document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]').length > 0){
            profile_image = document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]')[0].src;
        }else if(document.querySelector('[class="member-profile-photo"]')!==null){
            if(document.querySelector('[class="member-profile-photo"]').querySelector('img[role="button"]')!==null){
                profile_image = document.querySelector('[class="member-profile-photo"]').querySelector('img[role="button"]').src
            }else{
                profile_image = chrome.runtime.getURL('assets/img/no_profile.png');
            }
        }
        else{
            profile_image = chrome.runtime.getURL('assets/img/no_profile.png');
        }
        if(document.querySelectorAll('h1[class*="text-heading-xlarge"]').length > 0){
            profile_name = document.querySelectorAll('h1[class*="text-heading-xlarge"]')[0].innerText;
        }else{
            profile_name = document.querySelector('dt[class="member-name extra-extra-large-semibold"]').querySelectorAll('span')[0].innerText
        }
        shadowRoot.getElementById('linkedInProfileName').innerText = profile_name;
        shadowRoot.getElementById('linkedInProfileImg').src = profile_image;
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
        $(shadowRoot.getElementById('loginMsg')).fadeIn();
    }else{
        chrome.runtime.sendMessage({call: "validateUser", email: login_email, password: login_pass}, function(response) {
            let res = JSON.parse(response);
            if(res.dynamowebs_status == "success"){
                var session_obj = {
                    token: res.token,
                    id: res.id,
                    email: login_email,
                    pass: login_pass
                }
                chrome.storage.local.set({loggedin: true,session:JSON.stringify(session_obj)}, function() {
                    // console.log('Session is set to ' + JSON.stringify(session_obj));
                });
                shadowRoot.getElementById('popup').innerHTML = account_html;
                accountDropdown();
                getUserInfoFromAPI();
                getCredits();
                shadowRoot.getElementById('logout').addEventListener('click',() => {
                   logout();
                });
            }
            shadowRoot.getElementById('loginMsg').innerText = res.dynamowebs_msg;
        });
    }
}

function getUserInfoFromAPI(){
    getCredits();
    chrome.runtime.sendMessage({call: "getUser",}, function(response) {
        userObj = JSON.parse(response);
        if(userObj.dynamowebs_msg=="token_expired"){
            if(userObj.token!==undefined && userObj.token == "expired"){
                chrome.storage.local.get(['session'], function(result) {
                    var session = JSON.parse(result.session);
                    chrome.runtime.sendMessage({call: "validateUser", email: session.email, password: session.pass}, function(response) {
                        var res = JSON.parse(response);
                        if(res.dynamowebs_status == "success"){
                            var session_obj = {
                                token: res.token,
                                id: res.id,
                                email: session.email,
                                pass:  session.pass
                            }
                            chrome.storage.local.set({loggedin: true,session:JSON.stringify(session_obj)}, function() {
                                // console.log('Session is set to ' + JSON.stringify(session_obj));
                            });
                            shadowRoot.getElementById('popup').innerHTML = account_html;
                            accountDropdown();
                            getUserInfoFromAPI();
                            shadowRoot.getElementById('logout').addEventListener('click',() => {
                                logout();
                            })
                        }
                    });

                });
            }
            
        }else{
            shadowRoot.getElementById('account_dropdown').src = userObj.image;
            shadowRoot.getElementById('accountImg').src = userObj.image;
            shadowRoot.getElementById('accountName').innerHTML = userObj.firstName + '&nbsp;' + userObj.lastName;
            if(shadowRoot.getElementById('userName')!==null)
            shadowRoot.getElementById('userName').innerHTML = userObj.firstName + '&nbsp;' + userObj.lastName;

            shadowRoot.getElementById('accountEmail').innerText = userObj.email;
            // shadowRoot.getElementById('autoSaveWidget').checked = userObj.autoSaveLead;
            // shadowRoot.getElementById('autoOpenLead').checked = userObj.autoOpen;
        }
    })
}

chrome.storage.local.get(['loggedin'], function(result) {
    if(result.loggedin){
        getUserInfoFromAPI();
        shadowRoot.getElementById('popup').innerHTML = account_html;
        changeLangNoProfile(lang);
        accountDropdown();
        shadowRoot.getElementById('logout').addEventListener('click',() => {
          logout();
        })
    }
})

function unlockLead(){
    if(parseInt(shadowRoot.getElementById('cAmount').innerText)>1){
        var linkedin_url = location.origin+location.pathname;
        chrome.runtime.sendMessage({call: "deductCredits", link: linkedin_url}, function(response) {
            console.log(response);
            var res = JSON.parse(response);
            if(res.dynamowebs_status=="success"){
                getCredits();
                var linkedin_url = location.origin+location.pathname;
                chrome.runtime.sendMessage({call: "getProfile", link: linkedin_url}, function(response) {
                    if(response!== null || response!= '' || response!== 'null' ){
                        let res = JSON.parse(response);
                        if(res.dynamowebs_status=="success"){
                            shadowRoot.getElementById('app_container').innerHTML = leadUnlocked;
                            shadowRoot.getElementById('addLeadDiv').innerHTML = '<button class="btn btn-secondary add-lead" id="addLead">Add lead</button>';
                            // shadowRoot.getElementById('addLead').addEventListener('click', () => {
                            $(shadowRoot.getElementById('addLead')).off('click').on('click', () => {
                                clickedLeadAdd(res);
                            });
                            chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
                                let msg = JSON.parse(response);
                                shadowRoot.getElementById('addLeadDiv').innerHTML = `<button class="btn btn-secondary add-lead" id="addLead">${msg.alBtn.message}</button>`;
                                $(shadowRoot.getElementById('addLead')).off('click').on('click', () => {
                                    clickedLeadAdd(res);
                                });
                            });
                            setTimeout(function(){
                                // if(document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]').length > 0){
                                //     profile_image = document.querySelectorAll('img[class="pv-top-card-profile-picture__image pv-top-card-profile-picture__image--show ember-view"]')[0].src;
                                //  }else if(document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]').length > 0){
                                //      profile_image = document.querySelectorAll('img[class="ember-view profile-photo-edit__preview"]')[0].src;
                                //  }else if(document.querySelector('[class="member-profile-photo"]')!==null){
                                //      if(document.querySelector('[class="member-profile-photo"]').querySelector('img[role="button"]')!==null){
                                //          profile_image = document.querySelector('[class="member-profile-photo"]').querySelector('img[role="button"]').src
                                //      }else{
                                //          profile_image = chrome.runtime.getURL('assets/img/no_profile.png');
                                //      }
                                //  }
                                //  else{
                                //      profile_image = chrome.runtime.getURL('assets/img/no_profile.png');
                                //  }
                                // if(document.querySelectorAll('h1[class*="text-heading-xlarge"]').length > 0){
                                //     profile_name = document.querySelectorAll('h1[class*="text-heading-xlarge"]')[0].innerText;
                                // }else{
                                //     profile_name = document.querySelector('dt[class="member-name extra-extra-large-semibold"]').querySelectorAll('span')[0].innerText
                                // }
                                if(document.getElementById('experience')!== null){
                                    var jobTitle = document.getElementById('experience').nextElementSibling.nextElementSibling.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].innerText;
                                }else{
                                    var jobTitle = '';
                                }
                                //res['name'] = name[0].innerText;
                                if(res.name === undefined || res.name === '' || res.name === null){
                                    res['name'] = profile_name;
                                   
                                }
                                if(res.image === undefined || res.image === '' || res.image === null){
                                    res['image'] = profile_image;
                                }
                                res['jobtitle'] = jobTitle;
                                shadowRoot.getElementById('jobTitle').innerText = jobTitle;
                                shadowRoot.getElementById('linkedInProfileName').innerText = res.name;
                                shadowRoot.getElementById('linkedInProfileImg').src = res.image;
                                if(res.phoneNumbers.length>0){
                                    shadowRoot.getElementById('phoneNumbers').style.display = "block";
                                    let ul_phones = shadowRoot.getElementById('phoneNumbers');
                                    ul_phones.innerHTML = null;
                                    res.phoneNumbers.forEach(el => {   
                                        var li = document.createElement('li');
                                        if(el.verified == true)
                                            li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> ' + el.countryCode + el.number + '</div>' + '<button class="btn-small btn-thumbs-up"></button> <button class="btn-small btn-thumbs-down"></button>';
                                        else{
                                            li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.countryCode + el.number + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                                            li.className = 'not-verified';
                                        }
                                        ul_phones.appendChild(li);
                                    });
                                }else{
                                    shadowRoot.getElementById('phoneNumbers').style.display = "none";
                                }
                                if(res.professionalEmail.length > 0){
                                    shadowRoot.getElementById('proEmailsBlock').style.display = "block";
                                    let ul_proEmails = shadowRoot.getElementById('proEmails');
                                    ul_proEmails.innerHTML = null;
                                    res.professionalEmail.forEach(el =>{
                                        var li = document.createElement('li');
                                        if(el.verified == true)
                                            li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> ' + el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                                        else{
                                            li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                                            li.className = 'not-verified';
                                        }
                                        ul_proEmails.appendChild(li);
                                    });
                                }else{
                                    shadowRoot.getElementById('proEmailsBlock').style.display = "none";
                                }
                                if(res.personalEmail.length > 0){
                                    shadowRoot.getElementById('perEmailsBlock').style.display = "block";
                                    let ul_perEmails = shadowRoot.getElementById('perEmails');
                                    ul_perEmails.innerHTML = null;
                                    res.personalEmail.forEach(el =>{
                                        var li = document.createElement('li');
                                        if(el.verified == true)
                                            li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> ' + el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                                        else{
                                            li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                                            li.className = 'not-verified';
                                        }
                                        ul_perEmails.appendChild(li);
                                    })
                                }else{
                                    shadowRoot.getElementById('perEmailsBlock').style.display = "none";
                                }
                                if(res.companyInformation.length > 0 || (res.companyInformation[0].mainIndustry !== "" && res.companyInformation[0].employees !== "" && res.companyInformation[0].headQuarters !== "" && res.companyInformation[0].founded !== "")){
                                    shadowRoot.getElementById('companyName').innerText = res.companyInformation[0].name;
                                    if(res.companyInformation[0].website === null || res.companyInformation[0].website == ''){
                                        shadowRoot.getElementById('companyWebsite').parentElement.style.display = "none";
                                    }else{
                                        shadowRoot.getElementById('companyWebsite').parentElement.style.display = "block";
                                        shadowRoot.getElementById('companyWebsite').href = res.companyInformation[0].website;
                                    }
                                    if(res.companyInformation[0].mainIndustry===undefined || res.companyInformation[0].mainIndustry == "" || res.companyInformation[0].mainIndustry === null){
                                        shadowRoot.getElementById('industryBlock').style.display = "none";
                                    }else{
                                        shadowRoot.getElementById('industryBlock').style.display = "block";
                                        shadowRoot.getElementById('industry').innerText = res.companyInformation[0].mainIndustry;
                                    }
                                    if(res.companyInformation[0].employees===undefined || res.companyInformation[0].employees == "" || res.companyInformation[0].employees === null){
                                        shadowRoot.getElementById('employeeBlock').style.display = "none";
                                    }else{
                                        shadowRoot.getElementById('employeeBlock').style.display = "block";
                                        shadowRoot.getElementById('employeeCount').innerText = res.companyInformation[0].employees;
                                    }
                                    if(res.companyInformation[0].headQuarters===undefined || res.companyInformation[0].headQuarters == "" || res.companyInformation[0].headQuarters === null){
                                        shadowRoot.getElementById('headquarterBlock').style.display = "none";
                                    }else{
                                        shadowRoot.getElementById('headquarterBlock').style.display = "block";
                                        shadowRoot.getElementById('hq').innerText = res.companyInformation[0].headQuarters;
                                    }
                                    if(res.companyInformation[0].founded===undefined || res.companyInformation[0].founded == '' || res.companyInformation[0].founded ===null){
                                        shadowRoot.getElementById('historyBlock').style.display = "none";
                                    }
                                    else{
                                        shadowRoot.getElementById('historyBlock').style.display = "block";
                                        shadowRoot.getElementById('foundedIn').innerHTML = `<label class="social-media-icon">Founded in : ${res.companyInformation[0].founded}</label>`;
                                    }
                                    shadowRoot.getElementById('companyBlock').style.display = "block";
        
                                    // shadowRoot.getElementById('companyDetailsToggle').addEventListener('click', () => {
                                    $(shadowRoot.getElementById('companyDetailsToggle')).off('click').on('click', () => {
                                        $(shadowRoot.getElementById('companyDetails')).slideToggle(800);
                                        // if (shadowRoot.getElementById('companyDetailsToggle').innerText === "Show company details") {
                                        //     shadowRoot.getElementById('companyDetailsToggle').innerText = "Hide company details";
                                        // }else{
                                        //     shadowRoot.getElementById('companyDetailsToggle').innerText = "Show company details";
                                        // }
                                        chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
                                            let msg = JSON.parse(response);
                                            if (shadowRoot.getElementById('companyDetailsToggle').innerText === msg.scd.message) {
                                                shadowRoot.getElementById('companyDetailsToggle').innerText = msg.hcd.message;
                                            }else{
                                                shadowRoot.getElementById('companyDetailsToggle').innerText = msg.scd.message;
                                            }
                                        });
                                    })
                                }else{
                                    shadowRoot.getElementById('companyBlock').style.display = "none"
                                    shadowRoot.getElementById('companyDetails').style.display = "none";
                                    shadowRoot.getElementById('companyToggleBtnBlock').style.display = "none";
                                }
                                if (res.companyInformation[0].mainIndustry.toString() == "" && res.companyInformation[0].employees.toString() == "" && res.companyInformation[0].headQuarters.toString() == "" && res.companyInformation[0].founded.toString() == ""){
                                    shadowRoot.getElementById('companyDetails').style.display = "none";
                                    shadowRoot.getElementById('companyToggleBtnBlock').style.display = "none";
                                }
                                // if(typeof res.otherSocialMedia === "object" && res.otherSocialMedia.length > 0){
                                if(res.otherSocialMedia.facebook !== undefined || res.otherSocialMedia.linkedin !== undefined || res.otherSocialMedia.instagram !== undefined || res.otherSocialMedia.twitter !== undefined){
                                    let ul_socialMedia = shadowRoot.getElementById('social_media');
                                    ul_socialMedia.innerHTML = null;
                                    var li = document.createElement('li');
                                    if(res.otherSocialMedia.facebook !== undefined){
                                        var li = document.createElement('li');
                                        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30.033" height="30.033" viewBox="0 0 30.033 30.033"><path id="Icon_awesome-facebook-square" data-name="Icon awesome-facebook-square" d="M26.816,2.25H3.218A3.218,3.218,0,0,0,0,5.468v23.6a3.218,3.218,0,0,0,3.218,3.218h9.2V22.073H8.2V17.267h4.223V13.6c0-4.166,2.48-6.468,6.28-6.468a25.587,25.587,0,0,1,3.722.324V11.55h-2.1a2.4,2.4,0,0,0-2.71,2.6v3.121h4.611l-.737,4.806H17.614V32.283h9.2a3.218,3.218,0,0,0,3.218-3.218V5.468A3.218,3.218,0,0,0,26.816,2.25Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.facebook;
                                        ul_socialMedia.appendChild(li);
                                    }
                                    if(res.otherSocialMedia.linkedin !== undefined){
                                        var li = document.createElement('li');
                                        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="29.139" height="29.139" viewBox="0 0 29.139 29.139"><path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M27.057,2.25H2.075A2.09,2.09,0,0,0,0,4.351V29.288a2.09,2.09,0,0,0,2.075,2.1H27.057a2.1,2.1,0,0,0,2.081-2.1V4.351A2.1,2.1,0,0,0,27.057,2.25ZM8.807,27.226H4.488V13.32H8.813V27.226ZM6.647,11.421a2.5,2.5,0,1,1,2.5-2.5A2.505,2.505,0,0,1,6.647,11.421ZM25,27.226H20.677V20.462c0-1.613-.033-3.688-2.244-3.688-2.25,0-2.6,1.756-2.6,3.571v6.881H11.519V13.32h4.143v1.9h.059a4.549,4.549,0,0,1,4.091-2.244C24.183,12.975,25,15.857,25,19.6Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.linkedin;
                                        ul_socialMedia.appendChild(li);
                                    }
                                    if(res.otherSocialMedia.instagram !== undefined){
                                        var li = document.createElement('li');
                                        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.instagram;
                                        ul_socialMedia.appendChild(li);
                                    }
                                    if(res.otherSocialMedia.twitter !== undefined){
                                        var li = document.createElement('li');
                                        li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.twitter;
                                        ul_socialMedia.appendChild(li);
                                    }
                                    shadowRoot.getElementById('socialMediaBlock').style.display = "block";
                                }else{
                                    shadowRoot.getElementById('socialMediaBlock').style.display = "none";
                                }
                                // shadowRoot.getElementById('addLead').addEventListener('click', () => {
                                //     clickedLeadAdd(res);
                                // })
                                shadowRoot.querySelectorAll('.btn-thumbs-up').forEach(function(element) {
                                    element.addEventListener('click', () => {
                                        var linkedin_url = location.origin+location.pathname;
                                        chrome.runtime.sendMessage({call: "thumbsUp", link: linkedin_url}, function(response) {
                                            console.log(response);
                                        });
                                    });
                                });
                                shadowRoot.querySelectorAll('.btn-thumbs-down').forEach(function(element) {
                                    element.addEventListener('click', () => {
                                        var linkedin_url = location.origin+location.pathname;
                                        chrome.runtime.sendMessage({call: "thumbsDown", link: linkedin_url}, function(response) {
                                            console.log(response);
                                        });
                                    });
                                });  
                            },1000);
                            getLinkedInProfile();
                            // var myInterval = setInterval(function () {
                            //     if(getLinkedInProfile()){
                            //         console.log("Got DOM")
                            //         clearInterval(myInterval);
                            //     }else{
                            //         console.log("Not found!")
                            //     }
                            // }, 5000);
                        }
                        else if(res.dynamowebs_msg=="token_expired"){
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
                                            accountDropdown();
                                            shadowRoot.getElementById('logout').addEventListener('click',() => {
                                              logout();
                                            })
                                        }
                                        unlockLead();
                                    });
                                });
                            } 
                        }else{
                            shadowRoot.getElementById('unlockbuttoncontainer').innerHTML = null;
                            shadowRoot.getElementById('contact_found_detail').innerHTML = contact_detail_linkedIn;
                            changeLangContactFound(lang);
                        }
                    }
                })
            }
        });
    }else{
       $(shadowRoot.getElementById('noCreditAlert')).fadeIn(400);
       setTimeout(function(){
            $(shadowRoot.getElementById('noCreditAlert')).fadeOut(400);
       },5000)
    }
   
}

function accountDropdown(){
    changeLangDropdown(lang);
    shadowRoot.getElementById('account_dropdown').addEventListener('click', () => {
        $(shadowRoot.getElementById('drop_down')).slideToggle(800);
        // $(shadowRoot.getElementById('app_container')).fadeToggle(200);
        shadowRoot.getElementById('logout').addEventListener('click',() => {
            logout();
        });
       
    })
    shadowRoot.getElementById('notificationBell').addEventListener('click', () => {
        $(shadowRoot.getElementById('notificationContainer')).slideToggle(800);
        chrome.runtime.sendMessage({call: "getNotification"}, function(response) {
            var res = JSON.parse(response);
            if(res.dynamowebs_status == "success"){
                shadowRoot.getElementById('notifications').innerHTML = '';
                res.data.forEach((data) => {
                    console.log(data.description)
                    var li = document.createElement('li');
                    li.innerHTML = data.description;
                    shadowRoot.getElementById('notifications').appendChild(li);
                })
            }
        })
    });
    shadowRoot.getElementById('appSettings').addEventListener('click', () => {
        chrome.storage.local.get(['session'], function(result) {
            var session = JSON.parse(result.session);
            console.log(`https://app.socontact.com/api/login-extension?token=${session.token}&redirect_url=https://app.socontact.com/user/settings`);
            let URL = `https://app.socontact.com/api/login-extension?token=${session.token}&redirect_url=https://app.socontact.com/user/settings`
            window.open(URL, '_blank');
        })
    });
    shadowRoot.getElementById('editUser').addEventListener('click', () => {
        chrome.storage.local.get(['session'], function(result) {
            var session = JSON.parse(result.session);
            let URL = `https://app.socontact.com/api/login-extension?token=${session.token}&redirect_url=https://app.socontact.com/user/settings`
            window.open(URL, '_blank');
        })
    });
    shadowRoot.getElementById('btnIntegration').addEventListener('click', () => {
        chrome.storage.local.get(['session'], function(result) {
            var session = JSON.parse(result.session);
            let URL = `https://app.socontact.com/api/login-extension?token=${session.token}&redirect_url=https://app.socontact.com/user/setting_integration`
            window.open(URL, '_blank');
        })
    });
    shadowRoot.getElementById('btnTeamMembers').addEventListener('click', () => {
        chrome.storage.local.get(['session'], function(result) {
            var session = JSON.parse(result.session);
            let URL = `https://app.socontact.com/api/login-extension?token=${session.token}&redirect_url=https://app.socontact.com/user/organization`
            window.open(URL, '_blank');
        })
    });
    shadowRoot.getElementById('btnNewLead').addEventListener('click', () => {
        chrome.storage.local.get(['session'], function(result) {
            var session = JSON.parse(result.session);
            let URL = `https://app.socontact.com/api/login-extension?token=${session.token}&redirect_url=https://app.socontact.com/user/leads`
            window.open(URL, '_blank');
        })
    });

    shadowRoot.getElementById('autoOpenWidget').addEventListener('click', (event) => {
        chrome.storage.local.set({autoOpen: event.target.checked}, function() {
            console.log('Auto open is set');
        });
    })
    chrome.storage.local.get('autoOpen', function(result){
        shadowRoot.getElementById('autoOpenWidget').checked = result.autoOpen;
    })
    shadowRoot.getElementById('autoSaveLead').addEventListener('click', (event) => {
        chrome.storage.local.set({autoSave: event.target.checked}, function() {
            console.log('Auto save is set');
        });
    })
    chrome.storage.local.get('autoSave', function(result){
        shadowRoot.getElementById('autoSaveLead').checked = result.autoSave;
    })

}
function showIntegrationPage(){
    shadowRoot.getElementById('drop_down').innerHTML = integrationHTML;
        // shadowRoot.getElementById('btnBack').addEventListener('click', () => {
        $(shadowRoot.getElementById('btnBack')).off('click').on('click', (event) => {
            shadowRoot.getElementById('drop_down').innerHTML = dropdownContentHTML;
            getUserInfoFromAPI();
            shadowRoot.getElementById('btnIntegration').addEventListener('click', () => {
                showIntegrationPage();
            });
            shadowRoot.getElementById('logout').addEventListener('click',() => {
                logout();
            });
        })
}
function getCredits(){
    chrome.runtime.sendMessage({call: "getCredits"}, function(response) {
        var  res = JSON.parse(response);
        shadowRoot.getElementById('cAmount').innerText = res.personalCredits.amount;
    })
}
// $(document).ready(init());

function init(){
    // chrome.runtime.sendMessage({call: "setBadge", count: ''});
    chrome.storage.local.get(['loggedin'], function(result) {
        if(result.loggedin){
            var pattern = /linkedin.com\/in/;
            if(location.href.match(pattern)!= null){
                getProfileDetailsFromAPI();
            }else{
                shadowRoot.getElementById('app_container').innerHTML = noProfileHTML;
            }
            getCredits();
        }
    });
}

function refresh(){
    var linkedin_url = location.origin+location.pathname;
    chrome.runtime.sendMessage({call: "getProfile", link: linkedin_url}, function(response) {
        if(response!== null || response!= '' || response!== 'null' ){
            let  res = JSON.parse(response);
            if(res.dynamowebs_status=="success"){
                shadowRoot.getElementById('app_container').innerHTML = leadUnlocked;
                shadowRoot.getElementById('addLeadDiv').classList.remove('text-center');
                shadowRoot.getElementById('addLeadDiv').innerHTML = ` 
                <!--div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="leadAdded" checked>
                    <label class="form-check-label">Lead Added</label>
                </div-->
                <div class="d-flex leadAddMsg" id="leadAddMsg">
                    <div class="tick-mark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/></svg>
                    </div>
                    <label class="form-check-label" id="lblLeadAdded">Lead Added</label>
                </div>
                <div class="d-flex justify-content-between">
                    <div class="p-2">
                        <select id="bookmarkLists">
                        </select>
                    </div>
                    <!--button class="btn-export">Export</button-->
                    <div class="p-0">
                        <button class="m-2 round-small-button btn-edit" id="editLead"></button>
                        <button class="m-2 round-small-button btn-refresh" id="refresh"></button>
                    </div>
                </div>
                    `;
                chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
                    let msg = JSON.parse(response);
                    $(shadowRoot.getElementById('lblLeadAdded')).text(msg.lblLeadAdded.message);
                });
                setTimeout(function(){
                    // shadowRoot.getElementById('editLead').addEventListener('click', () => {
                    $(shadowRoot.getElementById('editLead')).off('click').on('click', () => {
                        editLead(res);
                        shadowRoot.getElementById('btnBack').style.display = "block";
                    });
                    // shadowRoot.getElementById('refresh').addEventListener('click', () => {
                    $(shadowRoot.getElementById('refresh')).off('click').on('click', () => {
                        refresh();
                    });
                   
                    if(document.getElementById('experience')!== null){
                        var jobTitle = document.getElementById('experience').nextElementSibling.nextElementSibling.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].innerText;
                    }else{
                        var jobTitle = '';
                    }
                    if(res.name === undefined || res.name === '' || res.name === null){
                        res['name'] = profile_name;
                    }
                    if(res.image === undefined || res.image === '' || res.image === null){
                        res['image'] = profile_image;
                    }
                    res['jobtitle'] = jobTitle;
                    shadowRoot.getElementById('jobTitle').innerText = jobTitle;
                    shadowRoot.getElementById('linkedInProfileName').innerText = res.name;
                    shadowRoot.getElementById('linkedInProfileImg').src = res.image;
                    if(res.phoneNumbers.length>0){
                        shadowRoot.getElementById('phoneNumbers').style.display = "block";
                        let ul_phones = shadowRoot.getElementById('phoneNumbers');
                        ul_phones.innerHTML = null;
                        res.phoneNumbers.forEach(el => {   
                            var li = document.createElement('li');
                            if(el.verified == true)
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> ' + el.countryCode + el.number + '</div>' + '<button class="btn-small btn-thumbs-up"></button> <button class="btn-small btn-thumbs-down"></button>';
                            else{
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.countryCode + el.number + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                                li.className = 'not-verified';
                            }
                            ul_phones.appendChild(li);
                        });
                    }else{
                        shadowRoot.getElementById('phoneNumbers').style.display = "none";
                    }
                    if(res.professionalEmail.length>0){
                        shadowRoot.getElementById('proEmailsBlock').style.display = "block";
                        let ul_proEmails = shadowRoot.getElementById('proEmails');
                        ul_proEmails.innerHTML = null;
                        res.professionalEmail.forEach(el =>{
                            var li = document.createElement('li');
                            if(el.verified == true)
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> ' + el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                            else{
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                                li.className = 'not-verified';
                            }
                            ul_proEmails.appendChild(li);
                        });
                    }else{
                        shadowRoot.getElementById('proEmailsBlock').style.display = "none";
                    }
                    if(res.personalEmail.length > 0){
                        shadowRoot.getElementById('perEmailsBlock').style.display = "block";
                        let ul_perEmails = shadowRoot.getElementById('perEmails');
                        ul_perEmails.innerHTML = null;
                        res.personalEmail.forEach(el =>{
                            var li = document.createElement('li');
                            if(el.verified == true)
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> ' + el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                            else{
                                li.innerHTML = '<div class="d-flex justify-content-between"><div class="p-1">'+ el.email + '</div>' + '<div class="p-0"><button class="p-1 btn-small btn-thumbs-up"></button> <button class="p-1 btn-small btn-thumbs-down"></button></div></div>';
                                li.className = 'not-verified';
                            }
                            ul_perEmails.appendChild(li);
                        })
                    }else{
                        shadowRoot.getElementById('perEmailsBlock').style.display = "none";
                    }
                    if(res.companyInformation.length > 0 || (res.companyInformation[0].mainIndustry !== "" && res.companyInformation[0].employees !== "" && res.companyInformation[0].headQuarters !== "" && res.companyInformation[0].founded !== "")){
                        shadowRoot.getElementById('companyName').innerText = res.companyInformation[0].name;
                        if(res.companyInformation[0].website === null || res.companyInformation[0].website == ''){
                            shadowRoot.getElementById('companyWebsite').parentElement.style.display = "none";
                        }else{
                            shadowRoot.getElementById('companyWebsite').parentElement.style.display = "block";
                            shadowRoot.getElementById('companyWebsite').href = res.companyInformation[0].website;
                        }
                        if(res.companyInformation[0].mainIndustry===undefined || res.companyInformation[0].mainIndustry == "" || res.companyInformation[0].mainIndustry === null){
                            shadowRoot.getElementById('industryBlock').style.display = "none";
                        }else{
                            shadowRoot.getElementById('industryBlock').style.display = "block";
                            shadowRoot.getElementById('industry').innerText = res.companyInformation[0].mainIndustry;
                        }
                        if(res.companyInformation[0].employees===undefined || res.companyInformation[0].employees == "" || res.companyInformation[0].employees === null){
                            shadowRoot.getElementById('employeeBlock').style.display = "none";
                        }else{
                            shadowRoot.getElementById('employeeBlock').style.display = "block";
                            shadowRoot.getElementById('employeeCount').innerText = res.companyInformation[0].employees;
                        }
                        if(res.companyInformation[0].headQuarters===undefined || res.companyInformation[0].headQuarters == "" || res.companyInformation[0].headQuarters === null){
                            shadowRoot.getElementById('headquarterBlock').style.display = "none";
                        }else{
                            shadowRoot.getElementById('headquarterBlock').style.display = "block";
                            shadowRoot.getElementById('hq').innerText = res.companyInformation[0].headQuarters;
                        }
                        if(res.companyInformation[0].founded===undefined || res.companyInformation[0].founded == '' || res.companyInformation[0].founded ===null){
                            shadowRoot.getElementById('historyBlock').style.display = "none";
                        }
                        else{
                            shadowRoot.getElementById('historyBlock').style.display = "block";
                            shadowRoot.getElementById('foundedIn').innerHTML = `<label class="social-media-icon">Founded in : ${res.companyInformation[0].founded}</label>`;
                        }
                        shadowRoot.getElementById('companyBlock').style.display = "block";

                        // shadowRoot.getElementById('companyDetailsToggle').addEventListener('click', () => {
                        $(shadowRoot.getElementById('companyDetailsToggle')).off('click').on('click', () => {
                            $(shadowRoot.getElementById('companyDetails')).slideToggle(800);
                            // if (shadowRoot.getElementById('companyDetailsToggle').innerText === "Show company details") {
                            //     shadowRoot.getElementById('companyDetailsToggle').innerText = "Hide company details";
                            // }else{
                            //     shadowRoot.getElementById('companyDetailsToggle').innerText = "Show company details";
                            // }
                            chrome.runtime.sendMessage({call: "changeLang", url: chrome.runtime.getURL("_locales/" + lang + "/messages.json")}, function(response) {
                                let msg = JSON.parse(response);
                                if (shadowRoot.getElementById('companyDetailsToggle').innerText === msg.scd.message) {
                                    shadowRoot.getElementById('companyDetailsToggle').innerText = msg.hcd.message;
                                }else{
                                    shadowRoot.getElementById('companyDetailsToggle').innerText = msg.scd.message;
                                }
                            });
                        })
                    }else{
                        shadowRoot.getElementById('companyBlock').style.display = "none"
                        shadowRoot.getElementById('companyDetails').style.display = "none";
                        shadowRoot.getElementById('companyToggleBtnBlock').style.display = "none";
                    }
                    if (res.companyInformation[0].mainIndustry.toString() == "" && res.companyInformation[0].employees.toString() == "" && res.companyInformation[0].headQuarters.toString() == "" && res.companyInformation[0].founded.toString() == ""){
                        shadowRoot.getElementById('companyDetails').style.display = "none";
                        shadowRoot.getElementById('companyToggleBtnBlock').style.display = "none";
                    }
                    // if(typeof res.otherSocialMedia === "object" && res.otherSocialMedia.length > 0){
                    if(res.otherSocialMedia.facebook !== null || res.otherSocialMedia.linkedin !== null || res.otherSocialMedia.instagram !== null || res.otherSocialMedia.twitter !== null){
                        let ul_socialMedia = shadowRoot.getElementById('social_media');
                        ul_socialMedia.innerHTML = null;
                        var li = document.createElement('li');
                        if(res.otherSocialMedia.facebook !== null){
                            var li = document.createElement('li');
                            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30.033" height="30.033" viewBox="0 0 30.033 30.033"><path id="Icon_awesome-facebook-square" data-name="Icon awesome-facebook-square" d="M26.816,2.25H3.218A3.218,3.218,0,0,0,0,5.468v23.6a3.218,3.218,0,0,0,3.218,3.218h9.2V22.073H8.2V17.267h4.223V13.6c0-4.166,2.48-6.468,6.28-6.468a25.587,25.587,0,0,1,3.722.324V11.55h-2.1a2.4,2.4,0,0,0-2.71,2.6v3.121h4.611l-.737,4.806H17.614V32.283h9.2a3.218,3.218,0,0,0,3.218-3.218V5.468A3.218,3.218,0,0,0,26.816,2.25Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.facebook;
                            ul_socialMedia.appendChild(li);
                        }
                        if(res.otherSocialMedia.linkedin !== null){
                            var li = document.createElement('li');
                            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="29.139" height="29.139" viewBox="0 0 29.139 29.139"><path id="Icon_awesome-linkedin" data-name="Icon awesome-linkedin" d="M27.057,2.25H2.075A2.09,2.09,0,0,0,0,4.351V29.288a2.09,2.09,0,0,0,2.075,2.1H27.057a2.1,2.1,0,0,0,2.081-2.1V4.351A2.1,2.1,0,0,0,27.057,2.25ZM8.807,27.226H4.488V13.32H8.813V27.226ZM6.647,11.421a2.5,2.5,0,1,1,2.5-2.5A2.505,2.505,0,0,1,6.647,11.421ZM25,27.226H20.677V20.462c0-1.613-.033-3.688-2.244-3.688-2.25,0-2.6,1.756-2.6,3.571v6.881H11.519V13.32h4.143v1.9h.059a4.549,4.549,0,0,1,4.091-2.244C24.183,12.975,25,15.857,25,19.6Z" transform="translate(0 -2.25)" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.linkedin;
                            ul_socialMedia.appendChild(li);
                        }
                        if(res.otherSocialMedia.instagram !== null){
                            var li = document.createElement('li');
                            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.instagram;
                            ul_socialMedia.appendChild(li);
                        }
                        if(res.otherSocialMedia.twitter !== null){
                            var li = document.createElement('li');
                            li.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" fill="#7e84a3"/></svg>&nbsp;&nbsp;'+res.otherSocialMedia.twitter;
                            ul_socialMedia.appendChild(li);
                        }
                        shadowRoot.getElementById('socialMediaBlock').style.display = "block";
                    }else{
                        shadowRoot.getElementById('socialMediaBlock').style.display = "none";
                    }
                   
                    shadowRoot.querySelectorAll('.btn-thumbs-up').forEach(function(element) {
                        element.addEventListener('click', () => {
                            var linkedin_url = location.origin+location.pathname;
                            chrome.runtime.sendMessage({call: "thumbsUp", link: linkedin_url}, function(response) {
                                console.log(response);
                            });
                        });
                    });
                    shadowRoot.querySelectorAll('.btn-thumbs-down').forEach(function(element) {
                        element.addEventListener('click', () => {
                            var linkedin_url = location.origin+location.pathname;
                            chrome.runtime.sendMessage({call: "thumbsDown", link: linkedin_url}, function(response) {
                                console.log(response);
                            });
                        });
                    });  
                    chrome.runtime.sendMessage({call: "getAllList"}, function(response) {
                        lists = JSON.parse(response);
                        lists.list.forEach((list) =>{
                            var opt = document.createElement('option');
                            opt.innerText = list.list_name;
                            opt.value = list.list_id;
                            shadowRoot.getElementById('bookmarkLists').appendChild(opt);
                        })
                      
                    })
                },1000);
                
            }
            else if(res.dynamowebs_msg=="token_expired"){
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
                                accountDropdown();
                                shadowRoot.getElementById('logout').addEventListener('click',() => {
                                  logout();
                                })
                            }
                        });
                    });
                } 
            }else{
                shadowRoot.getElementById('unlockbuttoncontainer').innerHTML = null;
                shadowRoot.getElementById('contact_found_detail').innerHTML = contact_detail_linkedIn;
                changeLangContactFound(lang);
            }
        }
    });
}