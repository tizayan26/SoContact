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
    hr{
        margin: 0 0 5px 0;
        border-top: 1px solid #BEBEBE;
    }
    .container-sc{
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgb(0 0 0 / 25%);
        border-radius: 10px;
        background: #fff;
        width: 100%;
        display:none;
    }
    ul.result-list{
        overflow: auto;
        list-style: none;
        padding: 0;
    }
    ul.result-list > li{
        margin: 6px 0;
        padding: 10px;
        font-size: 14px;
        color: rgb(54 54 54 / 90%);
    
    }
    ul.result-list > li.add{
        background-color: #F3F3F3;
    }
    ul.result-list > li.add:hover{
        background-color: #E3E3E3;
    }
    ul.result-list > li.edit{
        background-color: #D9EDFF;
    }
    ul.result-list > li.edit:hover{
        background-color: #ABD6FD;
    }
    ul.result-list:first-child{
        margin-top:0;
    }
    ul.result-list:last-child{
        margin-bottom:0;
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
    .text-muted{
        font-size:10px;
    }
    .suggestion-links{
        list-style: none;
    }
    #btn_add,#btn_update{
        margin-top: 10px;
        font-size: 12px!important;
        padding: 8px 12px!important;
        border-radius: 4px!important;
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
    .blue-logo-bar{
        border: 2px solid #007DED;
        position: relative;
        top: 12px;
        right: 4px;
    }
    .top-right-head{
        position: relative;
        top: 2px;
        /*left: 40px;*/
        left: 18px;
        font-size: 12px;
        color: #686868;
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
    <div class="container container-sc" id="popup">
    <div class="row pt-3 pb-1">
        <div class="col-sm-1">
            <img class="logo" src="${chrome.runtime.getURL('assets/icons/sv-16x16.png')}" /> 
        </div>
        <div class="col-sm-7">
            <div class="blue-logo-bar"></div>
        </div>
        <div class="col-sm-3">
        <span class="top-right-head">Deal CRM</span><button class="reboot" id="reboot"></button>
        </div>
    </div>
   
    <!-- start home -->
    <div id="home_content">
        <div class="row search-section">
        <div class="search-box">
        <input type="search" placeholder="Search By Startup Name" id="search"/><button id="submit_search" class="btn-search">Search</button>
        </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <div class="form-group">
                    <div class="msg" id="msg"></div>
                    <ul id="crm_result" class="result-list">
                    </ul>
                </div>


            </div>
        </div>
    </div>
    <!-- end home -->
    <!-- start entry -->
    <div id="entry_content">
        <span class="close" id="close_add">&times;</span>
        <div class="row">
            <div class="col-sm">
                <div class="form-group">
                    <label class="form-text">Startup Name</label>
                    <input type="text" class="form-control" id="startup_name_new" placeholder="Enter company name">
                </div>
                <div class="form-group">
                    <label class="form-text">Lead</label>
                    <select class="form-select" id="lead_new">
                    <option value="Alex" selected>Alex</option>
                    <option value="Aditya">Aditya</option>
                    <option value="Julian">Julian</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-text">Vertical</label>
                    <select class="form-select" id="vertical_new">
                    <option value="Aerospace">Aerospace</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Construction">Construction</option>
                    <option value="Ecommerce">Ecommerce</option>
                    <option value="Energy">Energy</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Food">Food</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Maritime">Maritime</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Material Science">Material Science</option>
                    <option value="Mining">Mining</option>
                    <option value="Other">Other</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Retail">Retail</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Supply Chain" selected>Supply Chain</option>
                    <option value="Transportation">Transportation</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-text">Stage</label>
                    <select class="form-select" id="stage_new">
                        <option value="Lead" selected>Lead</option>
                        <option value="Prospecting">Prospecting</option>
                        <option value="First Meeting - Pending">First Meeting - Pending</option>
                        <option value="First Meeting - Complete">First Meeting - Complete</option>
                        <option value="Second Meeting - Pending">Second Meeting - Pending</option>
                        <option value="Second Meeting - Complete">Second Meeting - Complete</option>
                        <option value="Active">Active</option>
                        <option value="Dilligence">Dilligence</option>
                        <option value="Send Pass">Send Pass</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Future Reconnect">Future Reconnect</option>
                        <option value="No Meeting - Response">No Meeting - Response</option>
                        <option value="No Meeting - No Response">No Meeting - No Response</option>
                        <option value="Passed">Passed</option>
                        <option value=""> </option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-text">URL</label>
                    <input type="text" class="form-control" id="url_new" placeholder="Enter URL">
                </div>
                <div class="form-group">
                    <label class="form-text">Description</label>
                    <textarea class="form-control" id="desc_new" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-text">CEO Email</label>
                    <input type="email" class="form-control" id="ceo_email_new" placeholder="Enter CEO Email">
                </div>
                <div class="form-group">
                    <label class="form-text">CEO LinkedIn</label>
                    <input type="text" class="form-control" id="ceo_linkedin_new" placeholder="Enter CEO LinkedIn">
                </div>
                <div class="form-group">
                    <label class="form-text">Status</label>
                    <input type="text" class="form-control" id="status_new" placeholder="Enter Status">
                </div>
                <div class="form-group">
                    <label class="form-text">Source</label>
                    <input type="text" class="form-control" id="source_new" placeholder="Enter Source">
                </div>
                <div class="form-group">
                <label class="form-text">Source By</label>
                <select class="form-select" id="source_by_new">
                    <option value='{"id": "usryeWEW8DpNhtoMn","email": "alexey@schematicventures.com","name": "Alex Freed"}'>Alex Freed</option>
                </select>
                </div>
                <div class="form-group">
                <label class="form-text">Attachment</label><br>
                <input class="custom-file-input" id="file_add" type="file" />
                <div><span id="progress_add"></span></div>
                </div>
                <button class="btn btn-primary" id="btn_add">Save Record <span class="icon btn-icon"><svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.4001 10.6578H13.3235V13.9234H1.15846V1.75836H4.424V0.681747H0.0819092V14.9999H14.4L14.4001 10.6578Z" fill="#007DED"/>
                <path d="M5.14174 7.177L4.06512 11.0167L7.90482 9.94008L15.0818 2.78102L12.3008 3.05176e-05L5.14174 7.177ZM7.34864 8.98916L5.60821 9.47364L6.09269 7.73322L10.4168 3.40908L11.6728 4.66502L7.34864 8.98916ZM12.4264 3.91143L11.1704 2.65549L12.3008 1.52508L13.5568 2.78102L12.4264 3.91143Z" fill="#007DED"/>
                </svg></span></button>
                <small class="form-text text-muted" id="add-msg"></small>
            </div>
        </div>
    </div>
    <!-- end entry -->
    <!-- start edit -->
    <div id="edit_content">
        <span class="close" id="close_edit">&times;</span>
        <div class=" row">
            <div class="col-sm">
                <div class="form-group">
                    <label class="form-text">Startup Name</label>
                    <input type="text" class="form-control" id="startup_name" placeholder="Enter company name">
                </div>
                <div class="form-group">
                    <label class="form-text">Lead</label>
                    <select class="form-select" id="lead">
                    <option value="Alex" selected>Alex</option>
                    <option value="Aditya">Aditya</option>
                    <option value="Julian">Julian</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-text">Vertical</label>
                    <select class="form-select" " id="vertical">
                    <option value="Aerospace">Aerospace</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Construction">Construction</option>
                    <option value="Ecommerce">Ecommerce</option>
                    <option value="Energy">Energy</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Food">Food</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Maritime">Maritime</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Material Science">Material Science</option>
                    <option value="Mining">Mining</option>
                    <option value="Other">Other</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Retail">Retail</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Supply Chain" selected>Supply Chain</option>
                    <option value="Transportation">Transportation</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-text">Stage</label>
                    <select class="form-select" id="stage">
                        <option value="Lead">Lead</option>
                        <option value="Prospecting">Prospecting</option>
                        <option value="First Meeting - Pending">First Meeting - Pending</option>
                        <option value="First Meeting - Complete">First Meeting - Complete</option>
                        <option value="Second Meeting - Pending">Second Meeting - Pending</option>
                        <option value="Second Meeting - Complete">Second Meeting - Complete</option>
                        <option value="Active">Active</option>
                        <option value="Dilligence">Dilligence</option>
                        <option value="Send Pass">Send Pass</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Future Reconnect">Future Reconnect</option>
                        <option value="No Meeting - Response">No Meeting - Response</option>
                        <option value="No Meeting - No Response">No Meeting - No Response</option>
                        <option value="Passed">Passed</option>
                        <option value=""> </option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-text">URL</label>
                    <input type="text" class="form-control" id="url" placeholder="Enter URL">
                </div>
                <div class="form-group">
                    <label class="form-text">Description</label>
                    <textarea class="form-control" id="desc" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-text">CEO Email</label>
                    <input type="email" class="form-control" id="ceo_email" placeholder="Enter CEO Email">
                </div>
                <div class="form-group">
                    <label class="form-text">CEO LinkedIn</label>
                    <input type="text" class="form-control" id="ceo_linkedin" placeholder="Enter CEO LinkedIn">
                </div>
                <div class="form-group">
                    <label class="form-text">Status</label>
                    <input type="text" class="form-control" id="status" placeholder="Enter Status">
                </div>
                <div class="form-group">
                    <label class="form-text">Source</label>
                    <input type="text" class="form-control" id="source" placeholder="Enter Source">
                </div>
                <div class="form-group">
                    <label class="form-text">Source By</label>
                    <select class="form-select" id="source_by">
                        <option value='{"id": "usryeWEW8DpNhtoMn","email": "alexey@schematicventures.com","name": "Alex Freed"}'>Alex Freed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-text">Attachment</label><br>
                    <input class="custom-file-input" id="file_update" type="file" />
                    <div><span id="progress_update"></span></div>
                </div>
                <button class="btn btn-primary" id="btn_update">Save Record <span class="icon btn-icon"><svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.4001 10.6578H13.3235V13.9234H1.15846V1.75836H4.424V0.681747H0.0819092V14.9999H14.4L14.4001 10.6578Z" fill="#007DED"/>
                <path d="M5.14174 7.177L4.06512 11.0167L7.90482 9.94008L15.0818 2.78102L12.3008 3.05176e-05L5.14174 7.177ZM7.34864 8.98916L5.60821 9.47364L6.09269 7.73322L10.4168 3.40908L11.6728 4.66502L7.34864 8.98916ZM12.4264 3.91143L11.1704 2.65549L12.3008 1.52508L13.5568 2.78102L12.4264 3.91143Z" fill="#007DED"/>
                </svg></span></button>
                <small class="form-text text-muted" id="update-msg"></small>
            </div>
        </div>
    </div>
    <!-- end edit -->
</div>
`;
    body.innerHTML = html_content;

    let script = document.createElement('script');
    script.type = 'javascript';
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
    body.appendChild(script);
    shadowRoot.append(html);
}