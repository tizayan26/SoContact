window.onload = () => {

}

init();
dragElement(shadowRoot.getElementById("icon"));
loadPopup();

function init() {

    shadowRoot.innerHTML = '<style>.icon-head{position:fixed;top: 50%;left: 50%;z-index:99999999999;cursor:pointer;}</style>';
    let icon_head = document.createElement('img');
    icon_head.className = "icon-head";
    icon_head.id = "icon";
    icon_head.title = "SoContact";
    icon_head.draggable = "true";
    icon_head.src = chrome.runtime.getURL("assets/icons/icon48.png");
    icon_head.addEventListener('click', () => {
        // shadowRoot.getElementById('popup').style.display = "block";
        $(shadowRoot.getElementById('popup')).fadeIn();
    })
    shadowRoot.append(icon_head);
}

function loadPopup() {
    const html = document.createElement('html');
    let head = document.createElement('head');

    let link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
    head.appendChild(link);
    let style = document.createElement('style');
    style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&family=Poppins:wght@400;500;600;700&display=swap');
    *{
        font-family: 'Poppins', sans-serif;
    }
    body{
        font-size: 12px;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9999999999!important;
    }

    .container-sc{
        background: #F4FAFF 0% 0% no-repeat padding-box;
        box-shadow: 0px 1px 24px #B4C5D346;
        border-radius: 10px;
        opacity: 1;
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        width: 400px;
        padding:40px;
        display:none;
    }
    h2{
        text-align: left;
        font: normal normal bold 35px/60px Poppins;
        letter-spacing: 0.53px;
        color: #121C31;
        opacity: 1;
    }

    .form-control{
        background: #FCFEFF 0% 0% no-repeat padding-box;
        border-radius: 10px;
        border: none;
        text-align: left;
        font: normal normal normal 26px/39px Poppins;
        letter-spacing: 0px;
        color: #121C31;
        opacity: 1;
    }

    .form-control:focus,.form-control:hover,.form-select:hover,.form-select:focus{
        background-color: #E6E9F4;
        border: none;
        outline: 0;
        box-shadow: none;
    }

    .form-check-input:checked {
        background: #FF7400 0% 0% no-repeat padding-box;
        
    }
    .form-check-input[type=checkbox] {
        border-radius: 4px;
        opacity: 1;
        width: 26px;
        height: 26px;
        outline: none
    }

    .form-check-label{
        padding: 0 0 0 10px;
        text-align: left;
        font: normal normal normal 14px/32px Poppins;
        letter-spacing: 0px;
        color: #121C31;
        opacity: 1;
    }

    .logo{
        vertical-align: middle;
        width: 150px;
        height: 150px;
        box-shadow: 0px 1px 10px #b4c5d346;
        border-radius: 10px;
    }
  
    /* The Close Button */
    .close {
        color: #aaa;
        font-size: 25px;
        font-weight: bold;
        position: relative;
        left: 95%;
    }
    .close:hover,.close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
    h4{
        font-size: 20px;
        display: inline;
    }
   
    .btn-primary{
        background: #FF7400 0% 0% no-repeat padding-box;
        border-radius: 7px;
        opacity: 1;
        text-align: center;
        font: normal normal 600 18px/41px Noto Sans;
        letter-spacing: 0px;
        color: #FFFFFF;
        opacity: 1;
        outline: none;
        border: none;
        width: 100%
    }
    .btn-primary:hover{
        background-color: #F99600;
    }

    a{
        font: normal normal 600 14px/32px Poppins;
        letter-spacing: 0px;
        color: #0058FF;
        opacity: 1;
        text-decoration:none;
    }
    .lbl-new-user{
        text-align: left;
        font: normal normal normal 14px/32px Poppins;
        letter-spacing: -0.17px;
        color: #121C31;
        opacity: 1;
    }
    .btn-icon{
        float: right;
    }
    .form-control,.form-select { font-size: 14px;}
    h5{
        font-size: 1.05rem;
    }
   
  
    .search-section{
        border-top: 1px solid #BEBEBE;
        border-bottom: 1px solid #BEBEBE;
        padding: 15px 10px;
    }
    .search-section > input[type=text]{
        border: 1px solid #BEBEBE;
        color:#3A3A3A;
        font-size: 14px;
        outline: none;
        padding: 8px 12px
    }
   

    
    
    textarea::-webkit-scrollbar {
        height: 6px;
        width: 6px;
        background-color: #D4D4D4;
    }
    textarea::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }   
    textarea::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background-color: #505050;
    }
    .search-box {
        display: flex;
        /*margin: 0 0 30px;*/
        border: 1px solid #BEBEBE;
        outline: none;
        padding: 8px 12px
    }
      
    input[type="search"] {
        border: none;
        margin: 0;
        /*padding: 7px 8px;*/
        font-size: 14px;
        color:#3A3A3A;
        border: 1px solid transparent;
        outline:none;
        width:90%;
    }
    button.btn-search {
        text-indent: -999px;
        overflow: hidden;
        width: 40px;
        padding: 0;
        margin: 0;
        border: 1px solid transparent;
        border-radius: inherit;
        background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E") no-repeat center;
        cursor: pointer;
        opacity: 0.7;
    }
      
    button.btn-search:hover {
        opacity: 1;
    }

    `;
    head.appendChild(style);
    let body = document.createElement('body');

    html.appendChild(head);
    html.appendChild(body);
    let html_content = `
    <div class="close" id="close">&times;</div>
    <div class="container container-sc" id="popup">
        <div class="row pt-3 pb-1">
            <div class="col-sm-12 text-center">
                <img class="logo" src="${chrome.runtime.getURL('assets/icons/logo.png')}" /> 
            </div>
        </div>
        <div class="row pt-3 pb-1">
            <div class="col-sm-12">
                <h2>Welcome</h2>
            </div>
        </div>
        <div class="row pt-3 pb-1">
            <div class="col-sm-6">
                <label class="lbl-new-user">New User?</label>
            </div>
            <div class="col-sm-6">
                <a href="#">Create an account</a>
            </div>
        </div>
        <div class="row pt-3 pb-1">
            <div class="col-sm-12">
                <input class="form-control form-input" type="text" placeholder="Username or email">
            </div>
        </div>
        <div class="row pt-3 pb-1">
            <div class="col-sm-12">
                <input class="form-control form-password" type="password" placeholder="Password">
            </div>
        </div>
        <div class="row pt-3 pb-1">
            <div class="col-sm-12">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="keepme">
                    <label class="form-check-label">
                    Keep me signed in
                    </label>
                </div>
            </div>
        </div>
        <div class="row pt-3 pb-1">
            <div class="col-sm-12">
               <button class="btn-primary">Sign In</button>
            </div>
        </div>
    </div>
`;
    body.innerHTML = html_content;

    let script = document.createElement('script');
    script.type = 'javascript';
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
    body.appendChild(script);
    shadowRoot.append(html);
    shadowRoot.getElementById('close').addEventListener('click',() => {
        $(shadowRoot.getElementById('popup')).fadeOut();
    }) 
}