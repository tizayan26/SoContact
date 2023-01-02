// const api_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjYzMzc0NjgsImV4cCI6MTY2NjM0MTA2OCwiZW1haWwiOiJzYW1hZGRkQGdtYWlsLmNvbSJ9.";
chrome.action.onClicked.addListener(tab => {
    chrome.tabs.sendMessage(tab.id, "toggle");
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.call) {
        case "validateUser":
            var formData = new FormData();
            formData.append("email",request.email);
            formData.append("password",request.password); 
            return fetch("https://app.socontact.com/api/auth/validateUser",
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
                // formData.append("token",api_token); 
                fetch("https://app.socontact.com/api/getProfile",
                {
                    body: formData,
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + session.token,
                        },
                }
                )
                // .then((response) => {
                //     if(response.status == 200){
                //        return response.text();
                //     }
                // })
                .then(response => response.text())
                .then(text =>sendResponse(text))
                .catch(error => console.log(error))
            }), !0;

        case "getUser":
            return chrome.storage.local.get(['session'], function(result) {
                var session = JSON.parse(result.session); 
                fetch("https://app.socontact.com/api/getUser",
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
                fetch("https://app.socontact.com/api/credits",
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
                fetch("https://app.socontact.com/api/deductCredit",
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
                fetch("https://app.socontact.com/api/new-lead-add",
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
                fetch("https://app.socontact.com/api/new-lead-update",
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
                fetch("https://app.socontact.com/api/profile-mark-up",
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
                fetch("https://app.socontact.com/api/profile-mark-down",
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
                fetch("https://app.socontact.com/api/assign-user-a-profile",
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
                fetch("https://app.socontact.com/api/get-user-lists",
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
                fetch("https://app.socontact.com/api/is-profile-assigned-to-list",
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
                fetch("https://app.socontact.com/api/profileData",
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
                fetch("https://app.socontact.com/api/updateProfile",
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
                fetch("https://app.socontact.com/api/get-notifications",
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
    }
})