init();
// dragElement(shadowRoot.getElementById("icon"));
dragElement(shadowRoot.getElementById("icon_button"));



let login_html = `
<div class="login-container">
<div class="p-6 pt-26 pb-0">
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
            <a href="https://app.socontact.com/register" target="_blank">Create an account</a>
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
        <div id="loginMsg" class="col-sm-12 text-center login-msg"></div>
    </div>
    <!--div class="row pt-3 pb-2">
    <div class="col-sm-4"><hr class="login-divider"></div>
    <div class="col-sm-4 pt-2 lbl-oauth">Or Sign In With</div>
    <div class="col-sm-4"><hr class="login-divider"></div>
    </div>
    <div class="row footer-icons p-4 pt-3 pb-2">
    <div class="col-sm-3"><img src="${chrome.runtime.getURL('assets/icons/google.png')}" /> </div>
    <div class="col-sm-3"><img src="${chrome.runtime.getURL('assets/icons/fb.png')}" /> </div>
    <div class="col-sm-3"><img src="${chrome.runtime.getURL('assets/icons/linkedin.png')}" /> </div>
    <div class="col-sm-3"><img src="${chrome.runtime.getURL('assets/icons/twitter.png')}" /> </div>
    </div-->
</div></div>`;

let contact_detail_api = ` 
<div class="row white-container p-1">
    <div class="col-sm-12 pt-4">
        <div class="d-flex dotted-box">
            <div class="p-4"><img class="avatar big" id="linkedInProfileImg" src="${chrome.runtime.getURL('assets/icons/spinner.gif')}" /></div> <!--https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80-->
            <div class="p-4 account">
                <label>Contact Found</label><h6 id="linkedInProfileName"> <div class="load-2">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
              </div></h6> <!-- John Doe-->
            </div>
        </div>
    </div>
    <div id="phoneNumbersBlock" class="col-sm-12">
        <div class="row dotted-box pt-2 pb-2">
            <div class="col-sm-12"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg><label> PHONE NUMBERS</label></div>
            <div class="col-sm-12">
                <ul id="phoneNumbers">
                    <!--li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> +33 00 ** ** ** ** </li-->
                    <li><!--class="not-verified"-->
                    <div class="load-2"> 
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                  </div></li><!--+33 00 ** ** ** **-->
                </ul>
            </div>
        </div>
    </div>
    <div id="proEmailsBlock" class="col-sm-12">
        <div class="row dotted-box pt-2 pb-2">
            <div class="col-sm-12"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><label> PROFESSIONAL MAILS</label></div>
            <div class="col-sm-12">
                <ul id="proEmails">
                    <!--li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> *******@********.com</li-->
                    <li><!--class="not-verified"-->
                    <div class="load-2"> 
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                  </div></li><!--*******@********.com-->
                </ul>
            </div>
        </div>
    </div>
    <div id="perEmailsBlock" class="col-sm-12">
        <div class="row dotted-box pt-2 pb-2">
            <div class="col-sm-12"><svg width="48pt" height="48pt" version="1.0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 48) scale(.1 -.1)"><path d="m12 408c-17-17-17-319 0-336s439-17 456 0 17 319 0 336-439 17-456 0zm188-68c11-11 20-29 20-40 0-26-34-60-60-60s-60 34-60 60 34 60 60 60c11 0 29-9 40-20zm240-40v-60h-80-80v60 60h80 80v-60zm-200-118c22-10 36-26 38-39 3-23 2-23-118-23s-121 0-118 23c4 29 61 57 118 57 25 0 61-8 80-18z"/><path d="m300 331c0-5 14-19 30-31l30-21 30 21c17 12 30 26 30 31 0 6-13 1-30-11l-30-21-30 21c-16 12-30 17-30 11z"/></g></svg><label> PERSONAL MAIL</label></div>
            <div class="col-sm-12">
                <ul id="perEmails">
                    <!--li><svg width="48pt" height="48pt" version="1.0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 48) scale(.1 -.1)"><path d="m12 408c-17-17-17-319 0-336s439-17 456 0 17 319 0 336-439 17-456 0zm188-68c11-11 20-29 20-40 0-26-34-60-60-60s-60 34-60 60 34 60 60 60c11 0 29-9 40-20zm240-40v-60h-80-80v60 60h80 80v-60zm-200-118c22-10 36-26 38-39 3-23 2-23-118-23s-121 0-118 23c4 29 61 57 118 57 25 0 61-8 80-18z"/><path d="m300 331c0-5 14-19 30-31l30-21 30 21c17 12 30 26 30 31 0 6-13 1-30-11l-30-21-30 21c-16 12-30 17-30 11z"/></g></svg> *******@********.com</li-->
                    <li><!--class="not-verified"-->
                    <div class="load-2"> 
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                  </div></li> <!--*******@********.com -->
                </ul>
            </div>
        </div>
    </div>
    <div id="companyBlock" class="col-sm-12">
        <div class="d-flex pt-4 pb-4">
            <div class="p-2"><div class="company-logo-circle"></div></div>
            <div class="p-2"><div class="company-title" id="companyName" style="overflow:hidden;max-width:196px;">Company name</div></div>
            <div class="pt-2 pb-2"><a class="go-to-website" id="companyWebsite" target="_blank">Go to website</a></div>
        </div>
    </div>
    <div id="socialMediaBlock">
        <div class="col-sm-12 p-4 pt-0 pb-0">
            <label class="other-social-media">Other social media</label>
        </div>
        <div class="col-sm-12 p-4">
            <div class="row social-media-icon">
                <div class="col-sm-1"><svg xmlns="http://www.w3.org/2000/svg" width="30.033" height="30.033" viewBox="0 0 30.033 30.033">
                <path id="Icon_awesome-facebook-square" data-name="Icon awesome-facebook-square" d="M26.816,2.25H3.218A3.218,3.218,0,0,0,0,5.468v23.6a3.218,3.218,0,0,0,3.218,3.218h9.2V22.073H8.2V17.267h4.223V13.6c0-4.166,2.48-6.468,6.28-6.468a25.587,25.587,0,0,1,3.722.324V11.55h-2.1a2.4,2.4,0,0,0-2.71,2.6v3.121h4.611l-.737,4.806H17.614V32.283h9.2a3.218,3.218,0,0,0,3.218-3.218V5.468A3.218,3.218,0,0,0,26.816,2.25Z" transform="translate(0 -2.25)" fill="#7e84a3"/>
            </svg></div>
                <div class="col-sm-11">
                    <div id="fbURL">
                        <div class="load-2"> 
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

let contact_detail_linkedIn = `
<div class="row white-container padding-contact-found">
    <div clas="col-sm-12">
        <div class="d-flex">
            <div class="p-4"><img class="avatar big" id="linkedInProfileImg" src="${chrome.runtime.getURL('assets/icons/spinner.gif')}" /></div><!--https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80-->
            <div class="p-4 account">
                <label id="cf">Contact Found</label><h6 id="linkedInProfileName">
                <div class="load-2">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                </div></h6><!--John Doe-->
            </div>
        </div>
    </div>
    <div class="col-sm-12 text-center pt-4 pb-2"><h4 class="msg" id="head">It appears that we don’t have enough informations about this contact…yet ;)</h4></div>
    <div class="col-sm-12 text-center"><p class="sub-msg" id="sub">No worries, you can add it to your waiting list,<br> We’ll send you a notification when the contact is updated</p></div>
    <div class="col-sm-12 pt-4 text-center">
        <button class="btn btn-secondary add-to-waiting-list" id="addToWaiting">Add to waiting list</button>
    </div>
</div>`;

let contactSearchHTML = `
<div class="no-credit-alert" id="noCreditAlert">You don't have enough credit to unlock details</div>
<div class="col-sm-12 pt-5 pb-2 text-center">
<img class="logoQ" src="${chrome.runtime.getURL('assets/icons/logoQ.png')}" />
</div>
<div class="col-sm-12 pt-3 pb-2 text-center">
    <h4 class="title-contact-search">Contact Search</h4>
</div>
<div class="col-sm-12" id="unlockbuttoncontainer">
</div>
<div class="col-sm-12 p-4" id="contact_found_detail">
    ${contact_detail_linkedIn}
</div>`

let noProfileHTML = `
    <div class="col-sm-12 pt-4 pb-2 text-center">
    <div class="intro-container">
        <h2><span id="gheading">Hello</span> <span id="userName">[user name]<span></h2>
        <span id="gsub">Welcome back, we’re happy to see you again ;)</span>
    </div>
    </div>
    <div class="col-sm-12 pt-2 pb-2 text-center">
    <div class="intro-container">
        <div class="row">
            <div class="col-sm-12">
                <h3 id="instheading">Navigate to a profile page</h3>
                <span id="instsub">No worries, you can add it to your waiting list, Visit any LinkedIn profile and click on the so contact plugin to get contact information.</span>
                
            </div>
            <div class="col-sm-12 pt-3">
                <img src="${chrome.runtime.getURL('assets/img/intro_img1.png')}" width="120px">
            </div>
        </div>
    </div>
</div>
`;

let dropdownContentHTML =`
<div class="row pt-3 pb-2">
    <div class="d-flex">
        <div class="p-4"><img class="avatar big" id="accountImg" src="${chrome.runtime.getURL('assets/icons/spinner.gif')}" /></div>
        <div class="p-2 account">
            <label id="acc">Account</label><h6 id="accountName">
            <div class="load-2"> 
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
            </h6>
            <label id="email">Email</label><p id="accountEmail"></p>
        </div>
        <div class="p-2">
            <div class="d-flex account-icons">
                <div class="p-2" id="notificationBell">
                    <svg id="ic-bell" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path id="Tracé_401" data-name="Tracé 401" d="M0,0H24V24H0Z" fill="none"/>
                    <path id="Tracé_402" data-name="Tracé 402" d="M10,5a2,2,0,1,1,4,0,7,7,0,0,1,4,6v3a4,4,0,0,0,2,3H4a4,4,0,0,0,2-3V11a7,7,0,0,1,4-6" fill="none" stroke="#7e84a3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <path id="Tracé_403" data-name="Tracé 403" d="M9,17v1a3,3,0,0,0,6,0V17" fill="none" stroke="#7e84a3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </svg>
                </div>
                <div class="notification-container" id="notificationContainer">
                    <div class="notification-content">    
                        <ul id="notifications">
                        </ul>
                    </div>
                </div>
                <div class="p-2" id="appSettings">
                    <svg id="ic_setting" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path id="Tracé_386" data-name="Tracé 386" d="M0,0H24V24H0Z" fill="none"/>
                    <path id="Tracé_387" data-name="Tracé 387" d="M10.325,4.317a1.724,1.724,0,0,1,3.35,0,1.724,1.724,0,0,0,2.573,1.066,1.725,1.725,0,0,1,2.37,2.37,1.724,1.724,0,0,0,1.065,2.572,1.724,1.724,0,0,1,0,3.35,1.724,1.724,0,0,0-1.066,2.573,1.725,1.725,0,0,1-2.37,2.37,1.724,1.724,0,0,0-2.572,1.065,1.724,1.724,0,0,1-3.35,0,1.724,1.724,0,0,0-2.573-1.066,1.725,1.725,0,0,1-2.37-2.37,1.724,1.724,0,0,0-1.065-2.572,1.724,1.724,0,0,1,0-3.35A1.724,1.724,0,0,0,5.383,7.752a1.725,1.725,0,0,1,2.37-2.37,1.723,1.723,0,0,0,2.572-1.065Z" fill="none" stroke="#B4C5D3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <circle id="Ellipse_2" data-name="Ellipse 2" cx="3" cy="3" r="3" transform="translate(9 9)" fill="none" stroke="#B4C5D3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </svg>
                </div>
                <div class="p-2" id="editUser">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="150.003 246.71 12.927 12.296"><g data-name="Icon feather-edit-3"><path d="M156.467 259.007h6.463" stroke-linejoin="round" stroke-linecap="round" stroke="#b4c5d3" fill="transparent" data-name="Tracé 25"/><path d="M159.698 247.157a1.524 1.524 0 0 1 2.155 2.154l-8.977 8.978-2.873.718.718-2.873 8.977-8.977Z" stroke-linejoin="round" stroke-linecap="round" stroke="#b4c5d3" fill="transparent" data-name="Tracé 26"/></g></svg>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row pt-4 pb-4">
<div class="col-sm-12">
    <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="autoOpenWidget">
        <label class="form-check-label">
        <span id="aoHead">Auto open widget ?</span>
        <p class="sub" id="aoSub">When socontact finds contact informations</p>
        </label>
    </div>
</div>
</div>
<div class="row pt-4 pb-2 pt-2">
<hr class="divider">
</div>
<div class="row pt-4 pb-4">
<div class="col-sm-12">
    <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="autoSaveLead">
        <label class="form-check-label">
        <span id="asHead">Auto save lead ?</span>
        <p class="sub" id="asSub">When socontact finds a new lead</p>
        </label>
    </div>
</div>
</div>
<div class="row pb-2">
<div class="col-sm-12">
    <ul class="options">
        <li id="btnTeamMembers"> 
            <svg id="ic_users" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path id="Tracé_393" data-name="Tracé 393" d="M0,0H24V24H0Z" fill="none"/>
            <circle id="Ellipse_3" data-name="Ellipse 3" cx="4" cy="4" r="4" transform="translate(5 3)" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            <path id="Tracé_394" data-name="Tracé 394" d="M3,21V19a4,4,0,0,1,4-4h4a4,4,0,0,1,4,4v2" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            <path id="Tracé_395" data-name="Tracé 395" d="M16,3.13a4,4,0,0,1,0,7.75" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            <path id="Tracé_396" data-name="Tracé 396" d="M21,21V19a4,4,0,0,0-3-3.85" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg> <label id="atm">Add teams member</label>
        </li>
        <li id="btnNewLead"> 
            <svg id="ic_inbox" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path id="Tracé_376" data-name="Tracé 376" d="M0,0H24V24H0Z" fill="none"/>
            <rect id="Rectangle_603" data-name="Rectangle 603" width="18" height="14" rx="2" transform="translate(3 5)" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            <path id="Tracé_377" data-name="Tracé 377" d="M3,7l9,6,9-6" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg> <label id="anl">Add new leads</label>
        </li>
        <li class="grad" id="btnIntegration">              
            <svg id="ic_setting" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path id="Tracé_386" data-name="Tracé 386" d="M0,0H24V24H0Z" fill="none"/>
            <path id="Tracé_387" data-name="Tracé 387" d="M10.325,4.317a1.724,1.724,0,0,1,3.35,0,1.724,1.724,0,0,0,2.573,1.066,1.725,1.725,0,0,1,2.37,2.37,1.724,1.724,0,0,0,1.065,2.572,1.724,1.724,0,0,1,0,3.35,1.724,1.724,0,0,0-1.066,2.573,1.725,1.725,0,0,1-2.37,2.37,1.724,1.724,0,0,0-2.572,1.065,1.724,1.724,0,0,1-3.35,0,1.724,1.724,0,0,0-2.573-1.066,1.725,1.725,0,0,1-2.37-2.37,1.724,1.724,0,0,0-1.065-2.572,1.724,1.724,0,0,1,0-3.35A1.724,1.724,0,0,0,5.383,7.752a1.725,1.725,0,0,1,2.37-2.37,1.723,1.723,0,0,0,2.572-1.065Z" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            <circle id="Ellipse_2" data-name="Ellipse 2" cx="3" cy="3" r="3" transform="translate(9 9)" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg> <label id="itgrn">Integrations</label>
        </li>
    </ul>
</div>
</div>
<div class="row pt-3 pb-2">
<div class="col-sm-6 account-bottom-text">
    <span id="inv">Invite and earn Credit</span><br>
    <span id="hc">Help center</span><br>
    <p class="highlight" id="fc">Free credits</p>
</div>
</div>
<div class="row pt-3 pb-2 text-center">
<div class="col-sm-12"><button class="btn-logout" id="logout">Log out</div>
</div>
`;

let account_html = `
<div class="d-flex pt-3 pb-2" style="justify-content: space-between;">
    <div class="p-1">
        <img class="logo-small" src="${chrome.runtime.getURL('assets/icons/logo.png')}" /> 
    </div>
    <div class="p-1">
        <div class="coin-container">
            <img src="${chrome.runtime.getURL('assets/icons/coin.png')}" /> <span id="cAmount">
            <div class="spinner-grow spinner-grow-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            </span> <span id="cr">credits</span>
        </div>
    </div>
    <div class=p-1">
        <img class="avatar" id="account_dropdown" src="${chrome.runtime.getURL('assets/icons/spinner.gif')}" />
    </div>
</div>
<div id="drop_down" class="drop-down">
    ${dropdownContentHTML}
</div>
<div id="app_container" class="row app-container-main">
   ${noProfileHTML}
</div>
`;

let leadEditHTML = `
<div class="col-sm-12 pt-2 pb-2 p-4">
    <div class="row white-container p-2">
        <div class="col-sm-1 btn-back" id="btnBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25.243" viewBox="0 0 24 25.243">
            <g id="Icon_feather-arrow-left" data-name="Icon feather-arrow-left" transform="translate(-6 -5.379)">
            <path id="Tracé_509" data-name="Tracé 509" d="M28.5,18H7.5" fill="none" stroke="#b4c5d3" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
            <path id="Tracé_510" data-name="Tracé 510" d="M18,28.5,7.5,18,18,7.5" fill="none" stroke="#b4c5d3" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
            </g>
            </svg>
        </div>
        <div class="col-sm-1 ">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="150.003 246.71 12.927 12.296"><g data-name="Icon feather-edit-3"><path d="M156.467 259.007h6.463" stroke-linejoin="round" stroke-linecap="round" stroke="#FF7400" fill="transparent" data-name="Tracé 25"></path><path d="M159.698 247.157a1.524 1.524 0 0 1 2.155 2.154l-8.977 8.978-2.873.718.718-2.873 8.977-8.977Z" stroke-linejoin="round" stroke-linecap="round" stroke="#FF7400" fill="transparent" data-name="Tracé 26"></path></g></svg>
        </div>
        <div class="col-sm-10 app-container-title">
            Edit contact
        </div>
        <div class="col-sm-12">
            <div class="form-group">
                <label class="label-sm">Name</label>
                <input type="text" class="form-control form-control-sm" id="name" placeholder="Enter name">
            </div>
            <!--div class="form-group">
                <label class="label-sm">Last Name</label>
                <input type="text" class="form-control form-control-sm" id="lastName" placeholder="Last Name">
            </div-->
            <div class="form-group">
                <label class="label-sm">Job</label>
                <input type="text" class="form-control form-control-sm" id="job" placeholder="Enter Job">
            </div>
            <div class="form-group">
                <label class="label-sm">Loction</label>
                <input type="text" class="form-control form-control-sm" id="location" placeholder="Enter Location">
            </div>
            <div class="form-group">
                <label class="label-sm">Descriptions</label>
                <textarea class="form-control form-control-sm" id="description" rows="6"></textarea>
            </div>
        </div>
        <div id="companyBlock">
            <div class="col-sm-12">
                <label class="other-social-media">Compagny</label>
            </div>
            <div class="col-sm-12">
                <div class="row pt-2 pb-4">
                    <div class="col-sm-2"><div class="company-logo-circle"></div></div>
                    <div class="col-sm-5"><div class="company-title" id="companyName">Company name</div></div>
                    <div class="col-sm-5"><a class="go-to-website" id="companyWebsite" target="_blank">Go to website</a></div>
                </div>
            </div>
            <!--div class=col-sm-12>
                <button class="btn-add">Add +</button>
            </div-->
        </div>
        <!--div class="col-sm-12 pt-2">
            <label class="other-social-media">Compagny categories</label>
            <button class="btn-add">Add +</button>
        </div-->
        <div id="socialMediaBlock" class="col-sm-12">
            <label class="other-social-media">Social medias</label>
            <div class="col-sm-12 pb-4">
                <ul id="social_media" class="social-media-icon">
                    <li>
                        <div class="load-2"> 
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-sm-12 pt-4 text-center lead">
            <button class="btn btn-secondary save-lead" id="saveLead">Save modifications</button>
        </div>
        <div class="col-sm-12 text-center login-msg" id="editStatusMsg" style="display:none">Updated Successfully!</div>
    </div>
</div>`;

let integrationHTML = `
<div class="col-sm-12 pt-2 pb-2">
    <div class="row p-2">
        <div class="col-sm-1 btn-back" id="btnBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25.243" viewBox="0 0 24 25.243">
            <g id="Icon_feather-arrow-left" data-name="Icon feather-arrow-left" transform="translate(-6 -5.379)">
            <path id="Tracé_509" data-name="Tracé 509" d="M28.5,18H7.5" fill="none" stroke="#b4c5d3" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
            <path id="Tracé_510" data-name="Tracé 510" d="M18,28.5,7.5,18,18,7.5" fill="none" stroke="#b4c5d3" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
            </g>
            </svg>
        </div>
        <div class="col-sm-1 ">
            <svg id="ic_setting" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path id="Tracé_386" data-name="Tracé 386" d="M0,0H24V24H0Z" fill="none"></path>
            <path id="Tracé_387" data-name="Tracé 387" d="M10.325,4.317a1.724,1.724,0,0,1,3.35,0,1.724,1.724,0,0,0,2.573,1.066,1.725,1.725,0,0,1,2.37,2.37,1.724,1.724,0,0,0,1.065,2.572,1.724,1.724,0,0,1,0,3.35,1.724,1.724,0,0,0-1.066,2.573,1.725,1.725,0,0,1-2.37,2.37,1.724,1.724,0,0,0-2.572,1.065,1.724,1.724,0,0,1-3.35,0,1.724,1.724,0,0,0-2.573-1.066,1.725,1.725,0,0,1-2.37-2.37,1.724,1.724,0,0,0-1.065-2.572,1.724,1.724,0,0,1,0-3.35A1.724,1.724,0,0,0,5.383,7.752a1.725,1.725,0,0,1,2.37-2.37,1.723,1.723,0,0,0,2.572-1.065Z" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            <circle id="Ellipse_2" data-name="Ellipse 2" cx="3" cy="3" r="3" transform="translate(9 9)" fill="none" stroke="#ff7400" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
            </svg>
        </div>
        <div class="col-sm-10 app-container-title">
            Integrations
        </div>
    </div>
    <div class="row pt-2">
        <ul class="options options-lg">
            <li> 
                <div class="row">
                <div class="col-sm-3"><div class="company-logo-circle company-logo-circle-lg">Logo</div></div> 
                <div class="col-sm-7"><label>Integration Name</label><small class="connected">Connected</small></div>
                <div class="col-sm-2"><div class="form-check"><input class="form-check-input" type="checkbox" value=""></div></div>
                </div>
            </li>
            <li> 
                <div class="row">
                <div class="col-sm-3"><div class="company-logo-circle company-logo-circle-lg">Logo</div></div> 
                <div class="col-sm-7"><label>Integration Name</label><small class="not-connected">Not connected</small></div>
                <div class="col-sm-2"><div class="form-check"><input class="form-check-input" type="checkbox" value=""></div></div>
                </div>
            </li>
            <li>              
                <div class="row">
                <div class="col-sm-3"><div class="company-logo-circle company-logo-circle-lg">Logo</div></div> 
                <div class="col-sm-7"><label>Integration Name</label><small class="pending">Pending</small></div>
                <div class="col-sm-2"><div class="form-check"><input class="form-check-input" type="checkbox" value=""></div></div>
                </div>
            </li>
        </ul>
    </div>
</div>`;

let leadUnlocked = `
<div class="col-sm-12 pt-2 pb-2 p-4">
    <div class="row white-container p-2 pt-5 pb-5">
        <div class="d-flex">
            <div class="p-4">
                <img class="avatar big" id="linkedInProfileImg" src="${chrome.runtime.getURL('assets/icons/spinner.gif')}" />
            </div>
            <div class="p-4 account">
                <h6 id="linkedInProfileName">
                <div class="load-2"> 
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
                </h6><label id="jobTitle">
                    <div class="load-2"> 
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                    </div>
                </label>
            </div>
        </div>
        <div class="col-sm-12 pt-4 text-center lead" id="addLeadDiv">
            <!--button class="btn btn-secondary add-lead" id="addLead">Add lead</button-->
            <div class="load-2"> 
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>
        <div id="phoneNumbersBlock" class="col-sm-12 pt-4">
            <div class="row dotted-box pt-2 pb-2">
                <div class="col-sm-12"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg><label> PHONE NUMBERS</label></div>
                <div class="col-sm-12">
                    <ul id="phoneNumbers">
                        <!--li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> +33 00 ** ** ** ** </li-->
                        <li>
                        <div class="load-2"> 
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
                        </div></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div id="proEmailsBlock" class="col-sm-12">
            <div class="row dotted-box pt-2 pb-2">
                <div class="col-sm-12"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><label> PROFESSIONAL MAILS</label></div>
                <div class="col-sm-12">
                    <ul id="proEmails">
                        <!--li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z"/></svg> *******@********.com</li-->
                        <li><!--class="not-verified"-->
                        <div class="load-2"> 
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
                    </div></li><!--*******@********.com-->
                    </ul>
                </div>
            </div>
        </div>
        <div id="perEmailsBlock" class="col-sm-12">
            <div class="row dotted-box pt-2 pb-2">
                <div class="col-sm-12"><svg width="48pt" height="48pt" version="1.0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 48) scale(.1 -.1)"><path d="m12 408c-17-17-17-319 0-336s439-17 456 0 17 319 0 336-439 17-456 0zm188-68c11-11 20-29 20-40 0-26-34-60-60-60s-60 34-60 60 34 60 60 60c11 0 29-9 40-20zm240-40v-60h-80-80v60 60h80 80v-60zm-200-118c22-10 36-26 38-39 3-23 2-23-118-23s-121 0-118 23c4 29 61 57 118 57 25 0 61-8 80-18z"/><path d="m300 331c0-5 14-19 30-31l30-21 30 21c17 12 30 26 30 31 0 6-13 1-30-11l-30-21-30 21c-16 12-30 17-30 11z"/></g></svg><label> PERSONAL MAIL</label></div>
                <div class="col-sm-12">
                    <ul id="perEmails">
                        <!--li><svg width="48pt" height="48pt" version="1.0" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 48) scale(.1 -.1)"><path d="m12 408c-17-17-17-319 0-336s439-17 456 0 17 319 0 336-439 17-456 0zm188-68c11-11 20-29 20-40 0-26-34-60-60-60s-60 34-60 60 34 60 60 60c11 0 29-9 40-20zm240-40v-60h-80-80v60 60h80 80v-60zm-200-118c22-10 36-26 38-39 3-23 2-23-118-23s-121 0-118 23c4 29 61 57 118 57 25 0 61-8 80-18z"/><path d="m300 331c0-5 14-19 30-31l30-21 30 21c17 12 30 26 30 31 0 6-13 1-30-11l-30-21-30 21c-16 12-30 17-30 11z"/></g></svg> *******@********.com</li-->
                        <li><!--class="not-verified"-->
                        <div class="load-2"> 
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
                    </div></li> <!--*******@********.com -->
                    </ul>
                </div>
            </div>
        </div>
        <div id="socialMediaBlock" class="col-sm-12">
            <label class="other-social-media">Social medias</label>
            <div class="col-sm-12 pb-4">
                <!--div class="row social-media-icon">
                    <div class="col-sm-1"><svg xmlns="http://www.w3.org/2000/svg" width="30.033" height="30.033" viewBox="0 0 30.033 30.033">
                    <path id="Icon_awesome-facebook-square" data-name="Icon awesome-facebook-square" d="M26.816,2.25H3.218A3.218,3.218,0,0,0,0,5.468v23.6a3.218,3.218,0,0,0,3.218,3.218h9.2V22.073H8.2V17.267h4.223V13.6c0-4.166,2.48-6.468,6.28-6.468a25.587,25.587,0,0,1,3.722.324V11.55h-2.1a2.4,2.4,0,0,0-2.71,2.6v3.121h4.611l-.737,4.806H17.614V32.283h9.2a3.218,3.218,0,0,0,3.218-3.218V5.468A3.218,3.218,0,0,0,26.816,2.25Z" transform="translate(0 -2.25)" fill="#7e84a3"/>
                    </svg></div>
                    <div class="col-sm-11">
                        <div id="fbURL">
                            <div class="load-2"> 
                                <div class="line"></div>
                                <div class="line"></div>
                                <div class="line"></div>
                            </div>
                        </div>
                    </div>
                </div-->
                <ul id="social_media" class="social-media-icon">
                    <li>
                        <div class="load-2"> 
                            <div class="line"></div>
                            <div class="line"></div>
                            <div class="line"></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div id="companyBlock">
            <div class="col-sm-12">
                <label class="other-social-media">Compagny</label>
            </div>
            <div class="col-sm-12">
                <div class="d-flex pt-2 pb-4">
                    <div class="p-2"><div class="company-logo-circle"></div></div>
                    <div class="p-2"><div class="company-title" id="companyName">Company name</div></div>
                    <div class="pt-2 pb-2"><a class="go-to-website" id="companyWebsite" target="_blank">Go to website</a></div>
                </div>
            </div>
        </div>
        <div class="col-sm-12 company-details" id="companyDetails">
            <div class="row pt-2 pb-2">
                <div class="row" id="historyBlock">
                    <div class="col-sm-12">
                        <label class="other-social-media">History</label>
                    </div>
                    <div class="col-sm-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="9.1846" height="9.1846" viewBox="0 0 24.167 24.167"><path data-name="Icon material-access-time" d="M12.071 0a12.083 12.083 0 1 0 12.095 12.083A12.077 12.077 0 0 0 12.071 0Zm.012 21.75a9.667 9.667 0 1 1 9.667-9.667 9.664 9.664 0 0 1-9.667 9.667Zm.6-15.708h-1.808v7.25l6.344 3.806.906-1.486-5.442-3.229Z" fill="#7e84a3"/></svg>
                    </div>
                    <div class="col-sm-11" id="foundedIn">
                        <label class="social-media-icon">Founded in : 2004</label>
                    </div>
                </div>
                <div class="row" id="industryBlock">
                    <div class="col-sm-12">
                        <label class="other-social-media">Industry</label>
                    </div>
                    <div class="col-sm-12">
                        <label class="social-media-icon" id="industry">Software</label>
                    </div>
                </div>
                <div class="row" id="employeeBlock">
                    <div class="col-sm-12">
                        <label class="other-social-media">Employees</label>
                    </div>
                    <div class="col-sm-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10.8414" height="7.5886" viewBox="0 0 28.529 19.97"><path data-name="Icon awesome-users" d="M4.279 8.558a2.853 2.853 0 1 0-2.853-2.853 2.856 2.856 0 0 0 2.853 2.853Zm19.971 0a2.853 2.853 0 1 0-2.85-2.853 2.856 2.856 0 0 0 2.85 2.853Zm1.426 1.429h-2.853a2.845 2.845 0 0 0-2.01.829 6.52 6.52 0 0 1 3.348 4.871H27.1a1.425 1.425 0 0 0 1.426-1.426v-1.423a2.856 2.856 0 0 0-2.85-2.851Zm-11.412 0a4.993 4.993 0 1 0-4.992-4.995 4.99 4.99 0 0 0 4.993 4.995Zm3.424 1.426h-.37a6.893 6.893 0 0 1-6.107 0h-.37a5.137 5.137 0 0 0-5.135 5.135v1.284a2.14 2.14 0 0 0 2.14 2.14h12.838a2.14 2.14 0 0 0 2.14-2.14v-1.286a5.137 5.137 0 0 0-5.136-5.135Zm-9.972-.6a2.845 2.845 0 0 0-2.01-.829H2.853A2.856 2.856 0 0 0 0 12.838v1.426a1.425 1.425 0 0 0 1.426 1.423h2.938a6.537 6.537 0 0 1 3.352-4.873Z" fill="#7e84a3"/></svg>
                    </div>
                    <div class="col-sm-11">
                        <label class="social-media-icon" id="employeeCount">224</label>
                    </div>
                </div>
                <div class="row" id="headquarterBlock">
                    <div class="col-sm-12">
                        <label class="other-social-media">Headquarter</label>
                    </div>
                    <div class="col-sm-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="6.42846" height="9.18346" viewBox="0 0 16.917 24.167"><path id="Icon_material-location-on" data-name="Icon material-location-on" d="M14.5,2.417a8.452,8.452,0,0,0-8.458,8.458c0,6.344,8.458,15.708,8.458,15.708s8.458-9.365,8.458-15.708A8.452,8.452,0,0,0,14.5,2.417Zm0,11.479a3.021,3.021,0,1,1,3.021-3.021A3.022,3.022,0,0,1,14.5,13.9Z" transform="translate(-6.042 -2.417)" fill="#7e84a3"/></svg>
                    </div>
                    <div class="col-sm-11">
                        <label class="social-media-icon" id="hq"></label>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-12 text-center" id="companyToggleBtnBlock">
            <button class="btn btn-show-company-detail" id="companyDetailsToggle">Show company details</button>
        </div>
    </div>
</div>`;

let html_back_content = `
<div class="col-sm-12 pt-5 pb-2 text-center">
<img class="logoQ" src="${chrome.runtime.getURL('assets/icons/logoQ.png')}" />
</div>
<div class="col-sm-12 pt-3 pb-2 text-center">
    <h4 class="title-contact-search">Contact Search</h4>
</div>
<div class="col-sm-12" id="unlockbuttoncontainer">
</div>
<div class="col-sm-12 p-4" id="contact_found_detail">
    ${contact_detail_api}
</div>`;


loadPopup();


function init() {

    shadowRoot.innerHTML = '<style>.button-main{position:fixed;top: 50%;right: 10px;z-index:99999999999;}.icon-head{cursor:pointer;border-radius: 10px;}.widget-notification {color: rgb(255, 255, 255);width: 20px;height: 20px;font-weight: 700;display: flex;align-items: center;justify-content: center;font-size: 13px;position: relative;right:12px;top: 12px;background: red;border-radius: 50%;z-index:99999999999;}</style>';
    let button = document.createElement('div');
    button.className = "button-main";
    button.id = "icon_button";
    button.draggable = "true";
    let icon_head = document.createElement('img');
    icon_head.className = "icon-head";
    icon_head.id = "icon";
    icon_head.title = "SoContact";
    // icon_head.draggable = "true";
    icon_head.src = chrome.runtime.getURL("assets/icons/icon48.png");
    // icon_head.src = chrome.runtime.getURL("assets/img/logo.gif");
    // icon_head.addEventListener('click', () => {
    button.appendChild(icon_head);
    button.addEventListener('click', () => {
        // shadowRoot.getElementById('popup').style.display = "block";
        $(shadowRoot.getElementById('popup')).fadeIn();
    })
    shadowRoot.append(button);
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
    

    .pt-26{
        padding-top: 8rem!important;
    }
    
    *{
        font-family: 'poppins', sans-serif!important;
    }
    
    body{
        font-size: 16px;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9999999999!important;
    }

    .container-sc{
        background: #F4FAFF 0% 0% no-repeat padding-box;
        box-shadow: 0px 1px 24px #B4C5D346;
        border-radius: 4px;
        opacity: 1;
        backdrop-filter: blur(25px);
        -webkit-backdrop-filter: blur(25px);
        max-width: 400px;
        width: 100%;
        min-height: 95vh;
        padding:10px;
        display:none;
    }
    .login-container{
        overflow:auto;
        min-height: 300px;
        min-width: 400px;
    }
    h2{
        text-align: left;
        font: normal normal bold 36px/51px Poppins;
        /*font: normal normal bold 25.08px/30.78px Poppins;*/
        letter-spacing: 0.53px;
        color: #121C31;
        opacity: 1;
    }

    .form-control{
        border-radius: 8px;
        font: normal normal normal 15px/18.82px Poppins;
        height:50px;
        padding:0 2rem;
        background: #FCFEFF 0% 0% no-repeat padding-box;
        border: none;
        text-align: left;
        letter-spacing: 0px;
        color: #121C31!important;
        opacity: 1;
 
    }
    .p-6{
        padding: 4rem;
    }
    .form-control-sm{
        background: #FFFFFF 0% 0% no-repeat padding-box;
        border: 1px solid #B4C5D3;
        border-radius: 2px;
        text-align: left;
        font: normal normal 500 12px/16px Poppins;
        letter-spacing: 0.16px;
        color: #131523;
    }
    .label-sm{
        text-align: left;
        font: normal normal normal 11px/17px Poppins;
        letter-spacing: 0px;
        color: #7E84A3;
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
        opacity: 1;
        outline: none;
        border: 1px solid #B4C5D3;
        border-radius: 5px;
        width: 25px;
        height: 24px;
    }

    .form-check-label{
        padding: 0 0 0 12px;
        font: normal normal normal 15.4px/28.48px Poppins;
        text-align: left;
        letter-spacing: 0px;
        color: #121C31;
        opacity: 1;
    }

    .logo{
        vertical-align: middle;
        width: 154px;
        height: auto;
        box-shadow: 0px 1px 10px #b4c5d346;
        border-radius: 30%;
    }
    .logo-small{
        vertical-align: middle;
        box-shadow: 0px 1px 10px #b4c5d346;
        width: 50px;
        height: 50px;
        border-radius: 12px;
    }

    .logoQ{
        width:75.1632px;
        height:75.1632px;
    }

    .coin-container{
        padding: 10px 0;
        background: #FF7400 0% 0% no-repeat padding-box;
        border-radius: 4px;
        opacity: 1;
        text-align: center;
        font: normal normal bold 14px/15.54px Muli;
        letter-spacing: 0px;
        color: #FFFFFF;
        width: 150px;
        margin-left: 80px;
    }
    .coin-container img{
        width: 16px;
        height: auto;
    }

    .avatar{
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor:pointer;
    }

    .avatar.big{
        width: 80px;
        height: 80px;
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
        letter-spacing: 0px;
        color: #FFFFFF;
        opacity: 1;
        outline: none;
        border: none;
        width: 100%;
        font: normal normal 600 14.4px/17.58px Noto Sans;
        height:45px;
    }
    .btn-primary:hover{
        background-color: #F99600;
    }

    .btn-primary:focus{
        box-shadow:none;
        background: #FF7400 0% 0% no-repeat padding-box;
        border:none;
    }

    .add-to-waiting-list {
        width: 175.9px;
        height: 40.22px;
    }

    .btn-secondary{
        background: #0058FF 0% 0% no-repeat padding-box;
        box-shadow: 0px 3px 11px #0058FF4A;
        border-radius: 4px;
        width: 80%;
        outline: none;
        border: none;
        font: normal normal 600 12px/13px Muli;
        letter-spacing: 0px;
        color: #FFFFFF;
    }
    .btn-secondary:hover{
        background-color: #7E84A3;
    }

    .btn-add{
        display:block;
        width: 35.82px;
        height: 20.14px;
        background: #FFFFFF 0% 0% no-repeat padding-box;
        border: 1px solid #0058FF;
        font: normal normal 600 7.6px/8.36px Muli;
        letter-spacing: 0px;
        color: #0058FF;
    }

    .add-lead{
        height: 40px;
        width: 130px;
        font: normal normal 400 12.5px/13.26px Muli;
        letter-spacing: 0px;
    }
    .save-lead{
        height: 40px;
        width: 185px;
        font: normal normal 400 12.5px/13.26px Muli;
        letter-spacing: 0px;
    }
    .social-media-icon svg{
        width:14.4114px;
        height:14.4114px;
    }
    .btn-unlock{
        width: 172.4px;
        height: 35.22px;
        font: normal normal 600 11.5px/11.26px Muli;
        background-position-x: 35px;
        background-size: 10px;
        background-position-y: 9px;
        border: 1px solid #0058FF;
        border-radius: 2px;
        letter-spacing: 0px;
        color: #0058FF;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath fill='%230058FF' d='M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-clip: padding-box;
        background-color: #F4FAFF;
        text-align: center;
        padding-left: 12px;
    }

    .btn-show-company-detail{
        background: #F4FAFF 0% 0% no-repeat padding-box;
        border: 1px solid #0058FF;
        border-radius: 4px;
        font: normal normal 500 13.5px/14.26px Muli;
        letter-spacing: 0px;
        color: #0058FF;
        width: 100%;
        height: 40px;
    }

    .btn-back svg{
        width: 16px;
        cursor: pointer;
    }

    .lbl-oauth{
        text-align: center;
        font: normal normal normal 9.12px/12px Poppins;
        letter-spacing: 0.72px;
        color: #121C31;
        padding:0;
    }

    a{
        font: normal normal 600 15px/21px Poppins;

        letter-spacing: 0px;
        color: #0058FF;
        opacity: 1;
        text-decoration:none;
    }
    .lbl-new-user{
        text-align: left;
        font: normal normal normal 18px/33px Poppins;
        letter-spacing: -0.17px;
        color: #121C31;
        opacity: 1;
    }

    .divider{
        color: #b4c5d36e;
    }

    .login-divider{
        color: #7E84A3;
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
    .padding-contact-found{
        padding:6rem 1.5rem;
    }
    .account > label{
        text-align: left;
        font: normal normal normal 15px/38px Poppins;
        letter-spacing: 0px;
        color: #7E84A3;
    }
    .account h6{
        text-align: left;
        font: normal normal 800 18px/15.02px Gilroy;
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
        font: normal normal normal 14px/12px Poppins;
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
        padding: 28px 12px;
        margin: 6px 0;
        height: 80px;
    }
    ul.options>li>label{
        margin-left:15px;
        font: normal normal 500 18px/18px Poppins;
    }
    ul.options-lg>li{
        background: #F4FAFF 0% 0% no-repeat padding-box;
        box-shadow: 0px 1px 4px #15223214;
        border-radius: 2px;
        height: 70.68px;
    }
    ul.options-lg>li label{
        font: normal normal bold 10.26px/15.2px Poppins;
        letter-spacing: 0.17px;
        color: #5A607F;
    }
    ul.options-lg>li small{
        display:block;
        font: normal normal normal 6px/7.6px Poppins;
        letter-spacing: 0px;
    }
    ul.options-lg>li small.not-connected{
        color: #7E84A3;
    }
    ul.options-lg>li small.connected{
        color: #6ED19D;
    }
    ul.options-lg>li small.pending{
        color: #FF7400;
    }

    .grad{
        background: transparent linear-gradient(90deg, #00BDF50F 0%, #F4FAFF 100%) 0% 0% no-repeat padding-box!important;
    }
    .account-bottom-text{
        font: normal normal 500 16px/20px Poppins;
        text-align: left;
        letter-spacing: 0.17px;
        color: #171725;
    }
    .account-bottom-text .highlight{
        font: normal normal bold 16px/20px Poppins;
        color: #FF7400;
    }
    .btn-logout {
        border: 1px solid #D7DBEC;
        border-radius: 4px;
        text-align: left;
        font: normal normal 400 14px/10px Noto Sans;
        letter-spacing: 0px;
        color: #7E84A3;
        padding: 16px 70px;
        background: transparent;
    }
    .btn-small{
        width: 26.94px;
        height: 15.92px;
        border: 1px solid #D7DBEC;
        border-radius: 2px;
        background-color:#FFFFFF;
    }
    .btn-small-active{
        background: #0058FF 0% 0% no-repeat padding-box;
        box-shadow: 0px 3px 7px #0058FF50;
        fill:#ffffff;
    }
    .btn-thumbs-up{
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:8.36px;height:8.36px' viewBox='0 0 24 24'%3E%3Cpath fill='%23B4C5D3' d='M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z' /%3E%3C/svg%3E");
        background-repeat: no-repeat no-repeat;
        background-position: center center;
        // right: 60px;
        // position: absolute;
    }
    .btn-thumbs-up:hover{
        background-color: #0058FF;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:8.36px;height:8.36px' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z' /%3E%3C/svg%3E");
    }
    .btn-thumbs-down{
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:8.36px;height:8.36px' viewBox='0 0 24 24'%3E%3Cpath fill='%23B4C5D3' d='M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.77 8.33,20.88C8.33,21.3 8.5,21.67 8.77,21.94L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z' /%3E%3C/svg%3E");
        background-repeat: no-repeat no-repeat;
        background-position: center center;
        // right: 30px;
        // position: absolute;
    }
    .btn-thumbs-down:hover{
        background-color: #0058FF;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:8.36px;height:8.36px' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M19,15H23V3H19M15,3H6C5.17,3 4.46,3.5 4.16,4.22L1.14,11.27C1.05,11.5 1,11.74 1,12V14A2,2 0 0,0 3,16H9.31L8.36,20.57C8.34,20.67 8.33,20.77 8.33,20.88C8.33,21.3 8.5,21.67 8.77,21.94L9.83,23L16.41,16.41C16.78,16.05 17,15.55 17,15V5C17,3.89 16.1,3 15,3Z' /%3E%3C/svg%3E");
    }
    .round-small-button{
        width:20.52px;
        height:20.52px;
        border-radius:50%;
    }
    .btn-edit{
        background: #FFFFFF 0% 0% no-repeat padding-box;
        box-shadow: 0px 3px 26px #0058FF4A;
        border: 1px solid #0058FF;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='150.003 246.71 12.927 12.296'%3E%3Cg data-name='Icon feather-edit-3'%3E%3Cpath d='M156.467 259.007h6.463' stroke-linejoin='round' stroke-linecap='round' stroke='%230058FF' fill='transparent' data-name='Trac%C3%A9 25'%3E%3C/path%3E%3Cpath d='M159.698 247.157a1.524 1.524 0 0 1 2.155 2.154l-8.977 8.978-2.873.718.718-2.873 8.977-8.977Z' stroke-linejoin='round' stroke-linecap='round' stroke='%230058FF' fill='transparent' data-name='Trac%C3%A9 26'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
        background-repeat: no-repeat no-repeat;
        background-position: center center;
        // right: 60px;
        // position: absolute;
    }
    .btn-edit:hover{
        background: #0058FF 0% 0% no-repeat padding-box;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='150.003 246.71 12.927 12.296'%3E%3Cg data-name='Icon feather-edit-3'%3E%3Cpath d='M156.467 259.007h6.463' stroke-linejoin='round' stroke-linecap='round' stroke='%23b4c5d3' fill='transparent' data-name='Trac%C3%A9 25'%3E%3C/path%3E%3Cpath d='M159.698 247.157a1.524 1.524 0 0 1 2.155 2.154l-8.977 8.978-2.873.718.718-2.873 8.977-8.977Z' stroke-linejoin='round' stroke-linecap='round' stroke='%23ffffff' fill='transparent' data-name='Trac%C3%A9 26'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
        background-repeat: no-repeat no-repeat;
        background-position: center center;
      
    }
    .btn-refresh{
        background: #FFFFFF 0% 0% no-repeat padding-box;
        border: 1px solid #0058FF;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%230058FF' viewBox='0 0 512 512'%3E%3Cpath d='M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z'/%3E%3C/svg%3E");
        background-repeat: no-repeat no-repeat;
        background-position: center center;
        // right: 30px;
        // position: absolute;
    }
    .btn-refresh:hover{
        background: #0058FF 0% 0% no-repeat padding-box;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23FFFFFF' viewBox='0 0 512 512'%3E%3Cpath d='M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z'/%3E%3C/svg%3E");
        background-repeat: no-repeat no-repeat;
        background-position: center center;
    }
    .btn-export{
        width:42.24px;
        height:18.24px;
        background: #FFFFFF 0% 0% no-repeat padding-box;
        border: 1px solid #FF7400;
        font: normal normal 600 9.12px/10.5px Muli;
        letter-spacing: 0px;
        color: #FF7400;  
    }
    .leadAddMsg{
        display:none;
    }
    .account-icons{
        display: flex;
        align-items: center;
        position: relative;
        top: 48px;
    }
    .drop-down{
        display:none;
        position: fixed;     
        width: 95%;
        background: #F4FAFF 0% 0% no-repeat padding-box;
        z-index:9999;
        padding: 0 0 15px 0;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 90%
    }
    .drop-down input[type=checkbox], .lead input[type=checkbox]{
        width:22px;
        height:22px;
    }
    .drop-down .form-check-label{
        font: normal normal 600 15px/16px Muli;
        letter-spacing: 0px;
        color: #121C31;
    }
    .lead .form-check-label{
        font: normal normal bold 12px/20px Muli;
        letter-spacing: 0px;
        color: #121C31;
    }
    .drop-down .form-check-label>.sub{
        font: normal normal 300 15px/15px Muli;
    }
    .title-contact-search{
        text-align: center;
        font: normal normal bold 14.64px/19.96px Poppins;
        letter-spacing: 0.2px;
        color: #FF7400
    }
    
    .white-container{
        background: #FFFFFF 0% 0% no-repeat padding-box;
        border-radius: 5px;
    }
    
    .white-container .msg{
        text-align: center;
        font: normal normal bold 16.4px/22.48px Poppins;
        letter-spacing: 0.21px;
        color: #121C31;
    }
    .white-container .sub-msg{
        text-align: center;
        font: normal normal normal 12.84px/16.26px Poppins;
        letter-spacing: 0.13px;
        color: #121C31;
    }
   
    .dotted-box{
        border: 1px dashed #B4C5D3;
        border-radius: 2px;
        margin: 4px 0;
        padding:1vw;
    }
    .dotted-box label:not(.account>label){
        font: normal normal bold 10.22px/15.16px Poppins;
        letter-spacing: 0px;
        color: #7E84A3;
        margin-left: 4px;
    }
    .dotted-box svg{
        width: 10px;
        height: 10px;
        fill: #7E84A3;
    }
    .dotted-box ul{
        list-style:none;
        padding:0;
    }
    .dotted-box ul li{
        text-align: left;
        font: normal normal bold 10.36px/15.54px Poppins;
        letter-spacing: 0.16px;
        color: #0058FF;
    }
    .dotted-box ul li.not-verified{
        color: #7E84A3;
        padding-left:10px
    }
    .dotted-box ul li svg{
        width: 10px;
        height: 10px;
        fill: #0058FF;
    }
 
    .company-logo-circle{
        background: #0058FF 0% 0% no-repeat padding-box;
        border: 1px solid #0058FF19;
        border-radius:50%;
        width:35px;
        height:35px;
    }
    .company-logo-circle-lg{
        width:45.22px;
        height:45.22px;
        font: normal normal bold 8.36px/12.54px Poppins;
        letter-spacing: 0.14px;
        color: #FFFFFF;
        padding: 16px 0 0 10px;
    }
    .company-title{
        font: normal normal 600 12px/36.54px Poppins;
        text-align: left;
        letter-spacing: 0.16px;
        color: #131523;
        width: 190px;
    }
    .go-to-website{
        font: normal normal 600 10.22px/28.02px Poppins;
        text-align: right;
        letter-spacing: 0.14px;
        color: #00BDF5;
         margin-left: 35px;
    }
    .other-social-media{
        font: normal normal normal 10.22px/15.16px Poppins;
        text-align: left;
        letter-spacing: 0px;
        color: #7E84A3;
    }
    .social-media-icon{
        font: normal normal 500 11.36px/15.54px Poppins;
        text-align: left;
        letter-spacing: 0.16px;
        color: #131523;
    }
   

    ul.social-media-icon{
        list-style:none;
        padding:0;
    }
    ul.social-media-icon>li{
        padding: 4px 0;
    }

    .login-msg{
        color:#7E84A3;
    }
    .intro-container{
        background: #F4FAFF 0% 0% no-repeat padding-box;
        box-shadow: 0px 1px 4px #15223214;
        border-radius: 3px;
        opacity: 1;
        backdrop-filter: blur(10px);
        text-align: center;
        font: normal normal normal 12px/18px Poppins;
        letter-spacing: 0.13px;
        color: #121C31;
        padding: 17.4px 0;
    }
    .intro-container h2{
        text-align: center;
        font: normal normal bold 20px/27px Poppins;
        letter-spacing: 0.26px;
        color: #0058FF;
    }
    .intro-container h3{
        text-align: center;
        font: normal normal bold 14px/20px Poppins;
        letter-spacing: 0.21px;
        color: #121C31;
    }

    .intro-container .row{
        padding: 0 45px;
    }

    .footer-icons img{
        width:34.3824px;
        height:34.3824px;
    }
    .company-details{
        display:none;
    }

    .app-container-title{
        font: normal normal bold 14px/27px Poppins;
        letter-spacing: 0px;
        color: #FF7400;
    }
    .notification-container{
        display: none;
        position: absolute;
        top: 30px;
        min-width: 260px;
        background-color: #fff;
        box-shadow: 0px 1px 24px #b4c5d346;
        border-radius: 2px;
        text-align: left;
        font: normal normal normal 9.46px/6.88px Poppins;
        letter-spacing: 0.12px;
        right: 40px;
        padding:0;
    }
    .notification-content{
        padding: 10px 0;
        overflow: auto;
        max-height: 45vh;
    }
    .notification-content > ul{
        margin: 0;
        padding: 0;
        list-style:none;
        color: #121C31;
    }
    .notification-content > ul a{
        font: normal normal normal 9.12px/13.3px Poppins;
        color: #FF7400;
    }
    .notification-content > ul > li{
        padding: 10px 5px;
    }
    .notification-content > ul > li:hover{
        background: #e5eef1f5;
    }
    .account-icons svg{
        cursor:pointer;
    }
    .app-container-main{
        overflow-y: auto;
        max-height: 85vh;
    }
    .app-container-main::-webkit-scrollbar {
        height: 6px;
        width: 6px;
        //background-color: #D4D4D4;
        background-color: transparent;
    }
    .app-container-main::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }   
    .app-container-main::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background-color: #FF7400;
    }
    .tick-mark {
        position: relative;
        display: inline-block;
        width: 18px;
        height: 18px;
        background-color: #FF7400;
        border-radius: 6px;
    }
    .no-credit-alert{
        background-color: #FF7400;
        position: absolute;
        padding: 14px;
        width: 99%;
        text-align: center;
        display:none;
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
    
    shadowRoot.getElementById('signin').addEventListener('click',()=>{signedIn()});
}