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
    style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
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
        border: 1px solid #F4FAFF;
        box-shadow: 0px 1px 24px #B4C5D346;
        border-radius: 10px;
        opacity: 1;
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        background: #F4FAFF 0% 0% no-repeat padding-box;
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

    .logo{
        vertical-align: middle;
        width: 150px;
        height: 150px;
        box-shadow: 0px 1px 24px #b4c5d346;
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
        background-color: #D9EDFF;
        border: none;
        color: #007DED!important;
        width:100%;
        text-align: initial;
    }
    .btn-primary:hover{
        background-color: rgba(171,214,253,90%)
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
    .msg{
        background-color: #FFEAEA;
        padding: 10px;
        color: rgb(54 54 54 / 90%);
        font-size: 14px;
        margin: 15px 0;
    }
    .result-list > li > .icon{
        float: right;
    }
    .line{
        padding-top:10px;
        border-top: 1px solid #BEBEBE;
    }
    #entry_content,#edit_content{
        padding-bottom: 10px;
    }
    .form-control,.form-select{
        background-color:#F6F6F6;
        color:rgb(58,58,58,90%);
        border: none;
    }
    .form-control:focus,.form-control:hover,.form-select:hover,.form-select:focus{
        color: #212529;
        background-color: #b7b7b7;
        border: none;
        outline: 0;
        box-shadow: none;
    }
    .custom-file-input::-webkit-file-upload-button {
        visibility: hidden;
    }
    .custom-file-input::before {
        content: 'Add New Attachment';
        display: inline-block;
        background-color: #F6F6F6;
        color: rgb(58,58,58,90%);
        border: none;
        width: 100%;
        padding: 0.375rem 0.75rem;
        font-size: 12px;
        font-weight: 400;
        line-height: 1.5;
        outline: none;
        -webkit-user-select: none;
        cursor: pointer;
        border-radius: 0.25rem;
        background-image: url("data:image/svg+xml,%3Csvg width='13' height='13' viewBox='0 0 13 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.5 0C6.01055 0 5.61361 0.396919 5.61361 0.886387V5.61361H0.886387C0.396935 5.61361 0 6.01053 0 6.5C0 6.98947 0.396919 7.38639 0.886387 7.38639H5.61361V12.1136C5.61361 12.6031 6.01053 13 6.5 13C6.98947 13 7.38639 12.6033 7.38639 12.1136V7.38639H12.1136C12.6031 7.38639 13 6.98947 13 6.5C13 6.01053 12.6031 5.61361 12.1136 5.61361H7.38639V0.886387C7.38639 0.396935 6.98967 0 6.5 0Z' fill='%23767676'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right;
        background-position-x: 205px;
        background-size: 10px;
    }
    .custom-file-input:hover::before {
        color: #212529;
        background-color: #b7b7b7;
        border: none;
        outline: 0;
        box-shadow: none;
    }
    .custom-file-input:active::before {
        background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
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

    button.reboot{
        position: absolute;
        top: 8px;
        right: 10px;
        height: 18px;
        width: 15px;
        background-repeat: no-repeat;
        background-position: center;
        border: none;
        background: transparent url("data:image/svg+xml,%3Csvg width='15' height='18' viewBox='0 0 15 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.50241 0V2.2836C4.00686 2.2836 0.963827 4.8247 0.187253 8.39561C-0.589037 11.9668 1.10275 15.64 4.25365 17.2262C7.40444 18.8122 11.1964 17.9012 13.3722 15.0345C15.548 12.168 15.542 8.089 13.3576 5.22977L11.8931 6.45726C13.5374 8.60948 13.5429 11.6546 11.9057 13.812C10.268 15.9697 7.43583 16.6503 5.06434 15.4564C2.69277 14.2625 1.43139 11.5209 2.01591 8.83304C2.60015 6.14508 4.87157 4.24773 7.50264 4.24773V6.60308L11.2516 3.30152L7.50241 0Z' fill='%23686868'/%3E%3C/svg%3E");
    }
    button.reboot:hover {
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
            <div class="col-sm-12">
                New User? <a href="#">Create an account</a>
            </div>
        </div>
        <div class="row pt-3 pb-1">
            <div class="col-sm-12">
                <input type="text" placeholder="Username or email">
            </div>
        </div>
        <div class="row pt-3 pb-1">
            <div class="col-sm-12">
                <input type="password" placeholder="Password">
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