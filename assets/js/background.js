const api_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjYzMzc0NjgsImV4cCI6MTY2NjM0MTA2OCwiZW1haWwiOiJzYW1hZGRkQGdtYWlsLmNvbSJ9.";
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
            var formData = new FormData();
            formData.append("link",request.link);
            formData.append("token",api_token); 
            return fetch("https://app.socontact.com/api/getProfile",
            {
                body: formData,
                method: "POST",
            }
            ).then(response => response.text())
                .then(text =>sendResponse(text))
                .catch(error => console.log(error)), !0;

    }
})