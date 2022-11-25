// const api_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjYzMzc0NjgsImV4cCI6MTY2NjM0MTA2OCwiZW1haWwiOiJzYW1hZGRkQGdtYWlsLmNvbSJ9.";
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
    }
})