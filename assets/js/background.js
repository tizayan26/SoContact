const API_URL = 'https://app.socontact.com/api/';
chrome.action.onClicked.addListener(tab => {
    chrome.tabs.sendMessage(tab.id, "toggle");
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.call) {
        case "validateUser":
            var formData = new FormData();
            formData.append("email",request.email);
            formData.append("password",request.password); 
            return fetch(API_URL + "auth/validateUser",
            {
                body: formData,
                method: "POST",
            }
            ).then(response => response.text())
                .then(text =>sendResponse(text))
                .catch(error => console.log(error)), !0;
        
        case "getProfile":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session);
                var formData = new FormData();
                formData.append("link",request.link);
                fetch(API_URL + "getProfile",{
                    body: formData,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }).then(response => response.text())
                .then(text =>sendResponse(text))
                .catch(error => console.log(error))
            }), !0;

        case "getUser":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                fetch(API_URL + "getUser",
                {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;

        case "getCredits":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                fetch(API_URL + "credits",
                {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;

        case "deductCredits":
            var formData = new FormData();
            formData.append("profile",request.link);
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                fetch(API_URL + "deductCredit",
                {
                    body: formData,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;


        case "addProfile":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                fetch(API_URL + "new-lead-add",
                {
                    body: request.body,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        'Content-Type': 'application/json'
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;

        case "sendScrapedProfile":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                fetch(API_URL + "new-lead-update",
                {
                    body: request.body,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        'Content-Type': 'application/json'
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;

        case "thumbsUp":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                var formData = new FormData();
                formData.append("profile",request.link);
                fetch(API_URL + "profile-mark-up",
                {
                    body: formData,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;

        case "thumbsDown":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                var formData = new FormData();
                formData.append("profile",request.link);
                fetch(API_URL + "profile-mark-down",
                {
                    body: formData,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;

        case "addLeadToList":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                var formData = new FormData();
                formData.append("link",request.link);
                formData.append("id",request.id);
                fetch(API_URL + "assign-user-a-profile",
                {
                    body: formData,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;

        case "getAllList":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                fetch(API_URL + "get-user-lists",
                {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;

        case "isOnList":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                var formData = new FormData();
                formData.append("link",request.link);
                fetch(API_URL + "is-profile-assigned-to-list",
                {
                    body: formData,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;

        case "getProfileData":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                var formData = new FormData();
                formData.append("link",request.link);
                fetch(API_URL + "profileData",
                {
                    body: formData,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0; 

        case "updateProfileData":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                var formData = new FormData();
                formData.append("link",request.link);
                if(request.full_name){
                    formData.append("full_name",request.full_name);
                }
                if(request.last_name){
                    formData.append("last_name",request.last_name);
                }
                if(request.title){
                    formData.append("title",request.title);
                }
                if(request.address){
                    formData.append("address",request.address);
                }
                if(request.description){
                    formData.append("description",request.description);
                }
                fetch(API_URL + "updateProfile",
                {
                    body: formData,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0; 
            
        case "getNotification":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                fetch(API_URL + "get-notifications",
                {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.text())
                    .then(text =>sendResponse(text))
                    .catch(error => console.log(error))
            }), !0;

        case "setBadge":
            return chrome.action.setBadgeText({text: request.count.toString()}),chrome.action.setBadgeBackgroundColor({color: 'red'}), !0;

        case "changeLang":
            return fetch(request.url).then(response => response.text())
                .then(text =>sendResponse(text))
                .catch(error => console.log(error)),!0;
        case "currentLang":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                fetch(API_URL + "current-language",
                {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                ).then(response => response.json())
                .then(data => sendResponse(data))
                .catch(error => console.log(error))
            }), !0;
    }
});
chrome.tabs.onUpdated.addListener(function (tabId , info, tab) {
    if(tab.url.indexOf('www.linkedin.com/in')>0){
        if (info.status === 'complete') {
            chrome.tabs.sendMessage(tabId, "complete");
        }
    }
});