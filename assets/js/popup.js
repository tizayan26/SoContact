window.onload = () => {

}

init();
dragElement(shadowRoot.getElementById("icon"));

let login_html = `
<div class="p-4 pt-5 pb-0">
    <div class="row pt-3 pb-2">
        <div class="col-sm-12 text-center">
            <img class="logo" src="${chrome.runtime.getURL('assets/icons/logo.png')}" /> 
        </div>
    </div>
    <div class="row pt-3 pb-2">
        <div class="col-sm-12">
            <h2>Welcome</h2>
        </div>
    </div>
    <div class="row pt-3 pb-2">
        <div class="col-sm-12">
            <label class="lbl-new-user">New User?</label>
            &nbsp;
            <a href="#">Create an account</a>
        </div>
    </div>
    <div class="row pt-3 pb-2">
        <div class="col-sm-12">
            <input class="form-control form-input" type="text" placeholder="Username or email" id="email">
        </div>
    </div>
    <div class="row pt-3 pb-2">
        <div class="col-sm-12">
            <input class="form-control form-password" type="password" placeholder="Password" id="password">
        </div>
    </div>
    <div class="row pt-3 pb-2">
        <div class="col-sm-12">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="keepme">
                <label class="form-check-label">
                Keep me signed in
                </label>
            </div>
        </div>
    </div>
    <div class="row pt-3 pb-2">
        <div class="col-sm-12">
        <button class="btn btn-primary" id="signin">Sign In</button>
        </div>
        <div id="loginMsg" class="col-sm-12 text-ceter"></div>
    </div>
    <div class="row pt-3 pb-2">
    <div class="col-sm-4"><hr></div>
    <div class="col-sm-4 pt-2 lbl-oauth">Or Sign In With</div>
    <div class="col-sm-4"><hr></div>
    </div>
    <div class="row pt-3 pb-2">
    <div class="col-sm-3"><img src="${chrome.runtime.getURL('assets/icons/google.png')}" /> </div>
    <div class="col-sm-3"><img src="${chrome.runtime.getURL('assets/icons/fb.png')}" /> </div>
    <div class="col-sm-3"><img src="${chrome.runtime.getURL('assets/icons/linkedin.png')}" /> </div>
    <div class="col-sm-3"><img src="${chrome.runtime.getURL('assets/icons/twitter.png')}" /> </div>
    </div>
</div>`;

let contact_detail_api = ` 
<div class="row white-container p-1">
    <div class="col-sm-12 pt-4">
        <div class="row dotted-box pt-2 pb-2">
            <div class="col-sm-4"><img class="avatar big" id="linkedInProfileImg" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80" /></div>
            <div class="col-sm-8 account">
                <label>Contact Found</label><h6 id="linkedInProfileName">John Doe</h6>
            </div>
        </div>
    </div>
    <div class="col-sm-12">
        <div class="row dotted-box pt-2 pb-2">
            <div class="col-sm-12"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg><label> PHONE NUMBERS</label></div>
            <div class="col-sm-12">
                <ul id="phoneNumbers">
                    <li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> +33 00 ** ** ** ** </li>
                    <li class="not-verified"> +33 00 ** ** ** ** </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="col-sm-12">
        <div class="row dotted-box pt-2 pb-2">
            <div class="col-sm-12"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><label> PROFESSIONAL MAILS</label></div>
            <div class="col-sm-12">
                <ul id="proEmails">
                    <li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> *******@********.com</li>
                    <li class="not-verified"> *******@********.com </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="col-sm-12">
        <div class="row dotted-box pt-2 pb-2">
            <div class="col-sm-12"><svg width="48pt" height="48pt" version="1.0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 48) scale(.1 -.1)"><path d="m12 408c-17-17-17-319 0-336s439-17 456 0 17 319 0 336-439 17-456 0zm188-68c11-11 20-29 20-40 0-26-34-60-60-60s-60 34-60 60 34 60 60 60c11 0 29-9 40-20zm240-40v-60h-80-80v60 60h80 80v-60zm-200-118c22-10 36-26 38-39 3-23 2-23-118-23s-121 0-118 23c4 29 61 57 118 57 25 0 61-8 80-18z"/><path d="m300 331c0-5 14-19 30-31l30-21 30 21c17 12 30 26 30 31 0 6-13 1-30-11l-30-21-30 21c-16 12-30 17-30 11z"/></g></svg><label> PERSONAL MAIL</label></div>
            <div class="col-sm-12">
                <ul id="perEmails">
                    <li><svg width="48pt" height="48pt" version="1.0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 48) scale(.1 -.1)"><path d="m12 408c-17-17-17-319 0-336s439-17 456 0 17 319 0 336-439 17-456 0zm188-68c11-11 20-29 20-40 0-26-34-60-60-60s-60 34-60 60 34 60 60 60c11 0 29-9 40-20zm240-40v-60h-80-80v60 60h80 80v-60zm-200-118c22-10 36-26 38-39 3-23 2-23-118-23s-121 0-118 23c4 29 61 57 118 57 25 0 61-8 80-18z"/><path d="m300 331c0-5 14-19 30-31l30-21 30 21c17 12 30 26 30 31 0 6-13 1-30-11l-30-21-30 21c-16 12-30 17-30 11z"/></g></svg> *******@********.com</li>
                    <li class="not-verified"> *******@********.com </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="col-sm-12">
        <div class="row pt-4 pb-4">
            <div class="col-sm-2"><div class="company-logo-circle"></div></div>
            <div class="col-sm-5"><div class="company-title" id="companyName">Company name</div></div>
            <div class="col-sm-5"><a class="go-to-website" id="companyWebsite" target="_blank">Go to website</a></div>
        </div>
    </div>
    <div class="col-sm-12">
        <label class="other-social-media">Other social media</label>
    </div>
    <div class="col-sm-12 pb-4">
        <div class="row social-media-icon">
            <div class="col-sm-1"><svg xmlns="http://www.w3.org/2000/svg" width="30.033" height="30.033" viewBox="0 0 30.033 30.033">
            <path id="Icon_awesome-facebook-square" data-name="Icon awesome-facebook-square" d="M26.816,2.25H3.218A3.218,3.218,0,0,0,0,5.468v23.6a3.218,3.218,0,0,0,3.218,3.218h9.2V22.073H8.2V17.267h4.223V13.6c0-4.166,2.48-6.468,6.28-6.468a25.587,25.587,0,0,1,3.722.324V11.55h-2.1a2.4,2.4,0,0,0-2.71,2.6v3.121h4.611l-.737,4.806H17.614V32.283h9.2a3.218,3.218,0,0,0,3.218-3.218V5.468A3.218,3.218,0,0,0,26.816,2.25Z" transform="translate(0 -2.25)" fill="#7e84a3"/>
          </svg></div>
            <div class="col-sm-11"><div id="fbURL"></div></div>
        </div>
    </div>
</div>
`;
let contact_detail_linkedIn = `<div class="row white-container p-4">
<div class="col-sm-4"><img class="avatar big" id="linkedInProfileImg" src="${chrome.runtime.getURL('assets/icons/spinner.gif')}" /></div><!--https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80-->
<div class="col-sm-8 account">
    <label>Contact Found</label><h6 id="linkedInProfileName"><div class="load-2">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </div></h6><!--John Doe-->
</div>
<div class="col-sm-12 text-center pt-4 pb-2"><h4 class="msg">It appears that we don’t have enough informations about this contact…yet ;)</h4></div>
<div class="col-sm-12 text-center"><p class="sub-msg">No worries, you can add it to your waiting list,<br> We’ll send you a notification when the contact is updated</p></div>
<div class="col-sm-12 pt-4 text-center">
    <button class="btn btn-secondary add-to-waiting-list" id="signin">Add to waiting list</button>
</div>
</div>`;

let account_html = `
<div class="row pt-3 pb-2">
    <div class="col-sm-5">
        <img class="logo-small" src="${chrome.runtime.getURL('assets/icons/logo.png')}" /> 
    </div>
    <div class="col-sm-5">
        <div class="coin-container">
            <img src="${chrome.runtime.getURL('assets/icons/coin.png')}" /> 100 credits
        </div>
    </div>
    <div class="col-sm-2">
        <img class="avatar" id="account_dropdown" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80" />
    </div>
</div>
<div id="drop_down" class="drop-down">
    <div class="row pt-3 pb-2">
        <div class="col-sm-3"><img class="avatar big" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80" /></div>
        <div class="col-sm-6 account">
            <label>Account</label><h6>John Doe</h6>
            <label>Email</label><p>mail@mail.com</p>
        </div>
        <div class="col-sm-3">
            <div class="row account-icons">
                <div class="col-sm-4">
                    <svg id="ic-bell" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path id="Tracé_401" data-name="Tracé 401" d="M0,0H24V24H0Z" fill="none"/>
                    <path id="Tracé_402" data-name="Tracé 402" d="M10,5a2,2,0,1,1,4,0,7,7,0,0,1,4,6v3a4,4,0,0,0,2,3H4a4,4,0,0,0,2-3V11a7,7,0,0,1,4-6" fill="none" stroke="#7e84a3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Tracé_403" data-name="Tracé 403" d="M9,17v1a3,3,0,0,0,6,0V17" fill="none" stroke="#7e84a3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </svg>
                </div>
                <div class="col-sm-4">
                    <svg id="ic_setting" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path id="Tracé_386" data-name="Tracé 386" d="M0,0H24V24H0Z" fill="none"/>
                    <path id="Tracé_387" data-name="Tracé 387" d="M10.325,4.317a1.724,1.724,0,0,1,3.35,0,1.724,1.724,0,0,0,2.573,1.066,1.725,1.725,0,0,1,2.37,2.37,1.724,1.724,0,0,0,1.065,2.572,1.724,1.724,0,0,1,0,3.35,1.724,1.724,0,0,0-1.066,2.573,1.725,1.725,0,0,1-2.37,2.37,1.724,1.724,0,0,0-2.572,1.065,1.724,1.724,0,0,1-3.35,0,1.724,1.724,0,0,0-2.573-1.066,1.725,1.725,0,0,1-2.37-2.37,1.724,1.724,0,0,0-1.065-2.572,1.724,1.724,0,0,1,0-3.35A1.724,1.724,0,0,0,5.383,7.752a1.725,1.725,0,0,1,2.37-2.37,1.723,1.723,0,0,0,2.572-1.065Z" fill="none" stroke="#B4C5D3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <circle id="Ellipse_2" data-name="Ellipse 2" cx="3" cy="3" r="3" transform="translate(9 9)" fill="none" stroke="#B4C5D3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </svg>
                </div>
                <div class="col-sm-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="150.003 246.71 12.927 12.296"><g data-name="Icon feather-edit-3"><path d="M156.467 259.007h6.463" stroke-linejoin="round" stroke-linecap="round" stroke="#b4c5d3" fill="transparent" data-name="Tracé 25"/><path d="M159.698 247.157a1.524 1.524 0 0 1 2.155 2.154l-8.977 8.978-2.873.718.718-2.873 8.977-8.977Z" stroke-linejoin="round" stroke-linecap="round" stroke="#b4c5d3" fill="transparent" data-name="Tracé 26"/></g></svg>
                </div>
            </div>
        </div>
    </div>
    <div class="row pt-3 pb-2">
        <div class="col-sm-12">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="keepme">
                <label class="form-check-label">
                Auto save widget ? <br>
                When socontact finds contact informations
                </label>
            </div>
        </div>
    </div>
    <div class="row pt-3 pb-2 pt-2">
    <hr class="divider">
    </div>
    <div class="row pt-3 pb-2">
        <div class="col-sm-12">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="" id="keepme">
                <label class="form-check-label">
                Auto save lead ? <br>
                When socontact finds a new lead
                </label>
            </div>
        </div>
    </div>
    <div class="row pb-2">
        <div class="col-sm-12">
            <ul class="options">
                <li> 
                    <svg id="ic_users" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path id="Tracé_393" data-name="Tracé 393" d="M0,0H24V24H0Z" fill="none"/>
                    <circle id="Ellipse_3" data-name="Ellipse 3" cx="4" cy="4" r="4" transform="translate(5 3)" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Tracé_394" data-name="Tracé 394" d="M3,21V19a4,4,0,0,1,4-4h4a4,4,0,0,1,4,4v2" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Tracé_395" data-name="Tracé 395" d="M16,3.13a4,4,0,0,1,0,7.75" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Tracé_396" data-name="Tracé 396" d="M21,21V19a4,4,0,0,0-3-3.85" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </svg> <label>Add teams member</label>
                </li>
                <li> 
                    <svg id="ic_inbox" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path id="Tracé_376" data-name="Tracé 376" d="M0,0H24V24H0Z" fill="none"/>
                    <rect id="Rectangle_603" data-name="Rectangle 603" width="18" height="14" rx="2" transform="translate(3 5)" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Tracé_377" data-name="Tracé 377" d="M3,7l9,6,9-6" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </svg> <label>Add new leads</label>
                </li>
                <li class="grad">              
                    <svg id="ic_setting" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path id="Tracé_386" data-name="Tracé 386" d="M0,0H24V24H0Z" fill="none"/>
                    <path id="Tracé_387" data-name="Tracé 387" d="M10.325,4.317a1.724,1.724,0,0,1,3.35,0,1.724,1.724,0,0,0,2.573,1.066,1.725,1.725,0,0,1,2.37,2.37,1.724,1.724,0,0,0,1.065,2.572,1.724,1.724,0,0,1,0,3.35,1.724,1.724,0,0,0-1.066,2.573,1.725,1.725,0,0,1-2.37,2.37,1.724,1.724,0,0,0-2.572,1.065,1.724,1.724,0,0,1-3.35,0,1.724,1.724,0,0,0-2.573-1.066,1.725,1.725,0,0,1-2.37-2.37,1.724,1.724,0,0,0-1.065-2.572,1.724,1.724,0,0,1,0-3.35A1.724,1.724,0,0,0,5.383,7.752a1.725,1.725,0,0,1,2.37-2.37,1.723,1.723,0,0,0,2.572-1.065Z" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <circle id="Ellipse_2" data-name="Ellipse 2" cx="3" cy="3" r="3" transform="translate(9 9)" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </svg> <label>Integrations</label>
                </li>
            </ul>
        </div>
    </div>
    <div class="row pt-3 pb-2">
        <div class="col-sm-6 account-bottom-text">
            Invit and earn Credit
            Help center
            <p class="highlight">Free credits</p>
        </div>
    </div>
    <div class="row pt-3 pb-2 text-center">
        <div class="col-sm-12"><button class="btn-logout" id="logout">Log out</div>
    </div>
</div>
<div id="app_container" class="row">
    <div class="col-sm-12 pt-5 pb-2 text-center">
    <img class="logoQ" src="${chrome.runtime.getURL('assets/icons/logoQ.png')}" />
    </div>
    <div class="col-sm-12 pt-3 pb-2 text-center">
        <h4 class="title-contact-search">Contact Search</h4>
    </div>
    <div class="col-sm-12 p-4" id="contact_found_detail">
        ${contact_detail_linkedIn}
    </div>
    
</div>
`;

let leadUnlocked = `<div class="col-sm-12 pt-2 pb-2 p-4 text-center">
<div class="row white-container p-2">
    <div class="col-sm-4"><img class="avatar big" id="linkedInProfileImg" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80" /></div><!--https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80-->
    <div class="col-sm-8 account">
    <h6 id="linkedInProfileName">John Doe</h6><label>Job Title</label>
    </div>
</div>
</div>`;
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

    let meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1";
    head.appendChild(meta);

    let link = document.createElement('link');
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
    head.appendChild(link);

    let style = document.createElement('style');
    style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&family=Poppins:wght@400;500;600;700&display=swap');/* @import url("https://use.typekit.net/nbf5bjj.css"); */
    *{
        font-family: 'poppins', sans-serif!important;
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
        width: 285px;
        /*height: 616.6108px;*/
        padding:10px;
        display:none;
    }
    h2{
        text-align: left;
        font: normal normal bold 25.08px/30.78px Poppins;
        letter-spacing: 0.53px;
        color: #121C31;
        opacity: 1;
    }

    .form-control{
        background: #FCFEFF 0% 0% no-repeat padding-box;
        border-radius: 4px;
        border: none;
        text-align: left;
        font: normal normal normal 10px/14.82px Poppins;
        letter-spacing: 0px;
        color: #121C31!important;
        opacity: 1;
        height:34.2px;
    }
    .form-control::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #121C31!important;
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
        width: 21px;
        height: 20px;
        outline: none;
        border: 1px solid #B4C5D3;
    }

    .form-check-label{
        padding: 0 0 0 10px;
        text-align: left;
        font: normal normal normal 11.4px/24.48px Poppins;
        letter-spacing: 0px;
        color: #121C31;
        opacity: 1;
    }

    .logo{
        vertical-align: middle;
        width: 105.1536px;
        height: 105.1536px;
        box-shadow: 0px 1px 10px #b4c5d346;
        border-radius: 12px;
    }
    .logo-small{
        vertical-align: middle;
        width: 35.8112px;
        height: 35.8112px;
        box-shadow: 0px 1px 10px #b4c5d346;
        border-radius: 4px;
    }

    .coin-container{
        padding: 5px;
        background: #FF7400 0% 0% no-repeat padding-box;
        border-radius: 4px;
        opacity: 1;
        text-align: left;
        font: normal normal bold 11.78px/15.54px Muli;
        letter-spacing: 0px;
        color: #FFFFFF;
        width: 90px;
        margin-left: 18px;
    }
    .coin-container img{
        width: 11.02px;
        height: auto;
    }

    .avatar{
        width: auto;
        height: 24.32px;
        border-radius: 50%;
        cursor:pointer;
    }

    .avatar.big{
        width: 60px;
        height: 60px;
        cursor:none;
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
        font: normal normal 600 11.4px/15.58px Noto Sans;
        letter-spacing: 0px;
        color: #FFFFFF;
        opacity: 1;
        outline: none;
        border: none;
        width: 100%;
        height:34.2px;
    }
    .btn-primary:hover{
        background-color: #F99600;
    }

    .btn-primary:focus{
        box-shadow:none;
        background: #FF7400 0% 0% no-repeat padding-box;
        border:none;
    }

    .btn-secondary{
        background: #0058FF 0% 0% no-repeat padding-box;
        box-shadow: 0px 3px 11px #0058FF4A;
        border-radius: 4px;
        width: 80%;
        outline: none;
        border: none;
        font: normal normal 600 10px/11px Muli;
        letter-spacing: 0px;
        color: #FFFFFF;
    }
    .btn-secondary:hover{
        background-color: #7E84A3;
    }

    .lbl-oauth{
        text-align: center;
        font: normal normal normal 9.12px/12px Poppins;
        letter-spacing: 0.72px;
        color: #121C31;
        padding:0;
    }

    a{
        font: normal normal 600 11.4px/17.48px Poppins;
        letter-spacing: 0px;
        color: #0058FF;
        opacity: 1;
        text-decoration:none;
    }
    .lbl-new-user{
        text-align: left;
        font: normal normal normal 12.54px/18.24px Poppins;
        letter-spacing: -0.17px;
        color: #121C31;
        opacity: 1;
    }

    .divider{
        color: #b4c5d36e;
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
  

    .account > label{
        text-align: left;
        font: normal normal normal 8px/18.76px Poppins;
        letter-spacing: 0px;
        color: #7E84A3;
    }
    .account h6{
        text-align: left;
        font: normal normal 800 11px/8.02px Gilroy;
        letter-spacing: 0.72px;
        color: #121C31;
        opacity: 1;
    }
    .account h7{
    
        text-align: left;
        font: normal normal bold 18px/25px Muli;
        letter-spacing: 0px;
        color: #121C31;
    }
    .account p{
        text-align: left;
        font: normal normal normal 9.46px/6.88px Poppins;
        letter-spacing: 0.12px;
        color: #131523;
    }
    ul.options{
        list-style: none;
        margin: 0;
        padding: 0;
    }
    ul.options>li{
        background: #F4FAFF 0% 0% no-repeat padding-box;
        box-shadow: 0px 1px 4px #15223214;
        border-radius: 6px;
        text-align: left;
        letter-spacing: 0.2px;
        color: #121C31;
        padding:16px 12px;
        margin:6px 0;
        height: 52.44px;
    }
    ul.options>li>label{
        margin-left:15px;
    }
    .grad{
        background: transparent linear-gradient(90deg, #00BDF50F 0%, #F4FAFF 100%) 0% 0% no-repeat padding-box!important;
    }
    .account-bottom-text{
        font: normal normal medium 14px/35px Poppins;
        text-align: left;
        letter-spacing: 0.17px;
        color: #171725;
    }
    .account-bottom-text .highlight{
        font: normal normal normal 11px/15px Poppins;
        color: #FF7400;
    }
    .btn-logout{
        border: 1px solid #D7DBEC;
        border-radius: 4px;
        text-align: left;
        font: normal normal 600 9.6px/4.56px Noto Sans;
        letter-spacing: 0px;
        color: #7E84A3;
        padding: 12px 40px;
        background: transparent;
    }
    .account-icons{
        display: flex;
        align-items: center;
        position: relative;
        top: 48px;
    }
    .drop-down{
        display:none;
    }
    .title-contact-search{
        text-align: center;
        font: normal normal bold 10.64px/15.96px Poppins;
        letter-spacing: 0.2px;
        color: #FF7400
    }
    
    .white-container{
        background: #FFFFFF 0% 0% no-repeat padding-box;
        border-radius: 5px;
    }
    
    .white-container .msg{
        text-align: center;
        font: normal normal bold 11.4px/17.48px Poppins;
        letter-spacing: 0.21px;
        color: #121C31;
    }
    .white-container .sub-msg{
        text-align: center;
        font: normal normal normal 6.84px/10.26px Poppins;
        letter-spacing: 0.13px;
        color: #121C31;
    }
    .add-to-waiting-list{
        width:134.9px;
        height:26.22px;
    }
    .dotted-box{
        border: 1px dashed #B4C5D3;
        border-radius: 2px;
        margin: 4px 0;
    }
    .dotted-box label:not(.account>label){
        font: normal normal bold 7.22px/12.16px Poppins;
        letter-spacing: 0px;
        color: #7E84A3;
        margin-left: 4px;
    }
    .dotted-box svg{
        width: 7px;
        height: 7px;
        fill: #7E84A3;
    }
    .dotted-box ul{
        list-style:none;
        padding:0;
    }
    .dotted-box ul li{
        text-align: left;
        font: normal normal bold 8.36px/12.54px Poppins;
        letter-spacing: 0.16px;
        color: #0058FF;
    }
    .dotted-box ul li.not-verified{
        color: #7E84A3;
        padding-left:10px
    }
    .dotted-box ul li svg{
        width: 7px;
        height: 7px;
        fill: #0058FF;
    }
    .logoQ{
        width:51.1632px;
        height:51.1632px;
    }
    .company-logo-circle{
        background: #0058FF 0% 0% no-repeat padding-box;
        border: 1px solid #0058FF19;
        border-radius:50%;
        width:25.08px;
        height:25.08px;
    }
    .company-title{
        text-align: left;
        font: normal normal 600 8.36px/25.54px Poppins;
        letter-spacing: 0.16px;
        color: #131523;
    }
    .go-to-website{
        text-align: right;
        font: normal normal 600 7.22px/25.02px Poppins;
        letter-spacing: 0.14px;
        color: #00BDF5;
         margin-left: 35px;
    }
    .other-social-media{
        text-align: left;
        font: normal normal normal 7.22px/12.16px Poppins;
        letter-spacing: 0px;
        color: #7E84A3;
    }
    .social-media-icon{
        text-align: left;
        font: normal normal 500 8.36px/12.54px Poppins;
        letter-spacing: 0.16px;
        color: #131523;
    }
    .social-media-icon svg{
        width:11.4114px;
        height:11.4114px;
    }

    /* line loading */
    .load-wrapp {
        float: left;
        width: 100px;
        height: 100px;
        margin: 0 10px 10px 0;
        padding: 20px 20px 20px;
        border-radius: 5px;
        text-align: center;
        background-color: #d8d8d8;
      }
      
      .load-wrapp p {
        padding: 0 0 20px;
      }
      .load-wrapp:last-child {
        margin-right: 0;
      }
    .line {
        display: inline-block;
        width: 15px;
        height: 15px;
        border-radius: 15px;
        background-color: #4b9cdb;
      }

      .load-2 .line:nth-last-child(1) {
        animation: loadingB 1.5s 1s infinite;
      }
      .load-2 .line:nth-last-child(2) {
        animation: loadingB 1.5s 0.5s infinite;
      }
      .load-2 .line:nth-last-child(3) {
        animation: loadingB 1.5s 0s infinite;
      }
      
      @keyframes loadingB {
        0 {
          width: 15px;
        }
        50% {
          width: 35px;
        }
        100% {
          width: 15px;
        }
      }
    /* line loading */
    `;
    head.appendChild(style);
    let body = document.createElement('body');

    html.appendChild(head);
    html.appendChild(body);

 
    let html_content = `
    <div class="close" id="close">&times;</div>
    <div class="container container-sc" id="popup">
       ${login_html}
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
    
    shadowRoot.getElementById('signin').addEventListener('click',()=>{signedIn()})
}