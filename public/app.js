/*
 * Frontend Logic for application
 *
 */


// Container for all app related objects
 var app = {};


// Display live clock
app.startTime = function () {
    app.client.request(undefined, 'ping', 'GET', undefined, undefined, function (statusCode, responsePayload) {
        if (statusCode == 200){
            var time = document.getElementById('hiddenTitle').innerHTML + responsePayload.Time;
            document.getElementById('clock').innerHTML = time;
            var t = setTimeout(app.startTime, 500);
        } else {
            console.log('error: ' + statusCode);
        }
    });
};



 // Check if the userAgent is compatible, if not display error image
app.userAgent = function () {
    var chromeAgent = false;
    var agents = navigator.userAgent.split(' ');
    agents.forEach(function (element) {
        if (element.indexOf('Chrome') > -1)
        {
            chromeAgent = element.split('/')[1].split('.')[0];
        }
    });
    if(chromeAgent){
        if(chromeAgent > 58){
            return true;
        } else {
            // Fall back to error
            return false;
        }
    } else {
        return true;
    }
};





// Define global variables
var editSvg = '<svg class="editSvg" width="24" height="24" viewBox="0 0 24 24">\n' +
    '    <path d="M3 17.25v3.75h3.75l11.06-11.06-3.75-3.75-11.06 11.06zm17.71-10.21c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>\n' +
    '    <path d="M0 0h24v24h-24z" fill="none"/>\n' +
    '</svg>';

var reportSvg = '<svg class="reportSvg" width="48" height="48" viewBox="0 0 48 48">\n' +
    '    <path d="M31.46 6h-14.92l-10.54 10.54v14.91l10.54 10.55h14.91l10.55-10.54v-14.92l-10.54-10.54zm-7.46 28.6c-1.43 0-2.6-1.16-2.6-2.6 0-1.43 1.17-2.6 2.6-2.6 1.43 0 2.6 1.16 2.6 2.6 0 1.44-1.17 2.6-2.6 2.6zm2-8.6h-4v-12h4v12z"/>\n' +
    '    <path d="M0 0h48v48h-48z" fill="none"/>\n' +
    '</svg>\n';

 // Retrieve QueryString value
app.UrlQuery = function(key) {
    var urlParams = new URLSearchParams(window.location.search);
    return(urlParams.get(key));
};

// Validate object is not empty
app.objectValidate = function(obj){
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

 // AJAX client for the RESTful API:
app.client = {};

app.client.request = function (header, path, method, queryStringObject, payload, callback) {
// Set defaults
    headers = typeof(headers) == 'object' && headers !== null ? headers : {};
    path = typeof(path) == 'string' ? path : '/';
    method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof(payload) == 'object' && payload !== null ? payload : {};
    callback = typeof(callback) == 'function' ? callback : false;

    // For each query string parameter sent, add it to the path
    var requestUrl = path+'?';
    var counter = 0;
    for(var queryKey in queryStringObject){
        if(queryStringObject.hasOwnProperty(queryKey)){
            counter++;
            // If at least one query string parameter has already been added, preprend new ones with an ampersand
            if(counter > 1){
                requestUrl+='&';
            }
            // Add the key and value
            requestUrl+=queryKey+'='+queryStringObject[queryKey];
        }
    }

    // Form the http request as a JSON type
    var xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader("Content-type", "application/json");

    // For each header sent, add it to the request
    for(var headerKey in headers){
        if(headers.hasOwnProperty(headerKey)){
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    }


    // When the request comes back, handle the response
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE) {
            var statusCode = xhr.status;
            var responseReturned = xhr.responseText;

            // Callback if requested
            if(callback){
                try{
                    var parsedResponse = JSON.parse(responseReturned);
                    callback(statusCode,parsedResponse);
                } catch(e){
                    console.log('error caught');
                    callback(statusCode,false);
                }

            }
        }
    };

    // Send the payload as JSON
    var payloadString = JSON.stringify(payload);
    xhr.send(payloadString);
};

// Bind the forms
app.bindForms = function(){
    if(document.querySelector("form")){
        var allForms = document.querySelectorAll("form");
        for(var i = 0; i < allForms.length; i++){
            allForms[i].addEventListener("submit", function(e){

                // Stop it from submitting
                e.preventDefault();
                var formId = this.id;
                var path = this.action;
                var method = this.method.toUpperCase();

                // Hide the error message (if it's currently shown due to a previous error)
                document.querySelector("#"+formId+" .formError").style.display = 'none';

                // Hide the success message (if it's currently shown due to a previous error)
                if(document.querySelector("#"+formId+" .formSuccess")){
                    document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
                }


                // Turn the inputs into a payload
                var payload = {};
                var elements = this.elements;
                for(var i = 0; i < elements.length; i++){
                    if(elements[i].type !== 'submit'){
                        // Determine class of element and set value accordingly
                        var classOfElement = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
                        var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
                        var elementIsChecked = elements[i].checked;
                        // Override the method of the form if the input's name is _method
                        var nameOfElement = elements[i].name;
                        if(nameOfElement == '_method'){
                            method = valueOfElement;
                        } else {
                            // Create an payload field named "method" if the elements name is actually httpmethod
                            if(nameOfElement == 'httpmethod'){
                                nameOfElement = 'method';
                            }
                            // Create an payload field named "id" if the elements name is actually uid
                            if(nameOfElement == 'uid'){
                                nameOfElement = 'id';
                            }
                            // If the element has the class "multiselect" add its value(s) as array elements
                            if(classOfElement.indexOf('multiselect') > -1){
                                if(elementIsChecked){
                                    payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                                    payload[nameOfElement].push(valueOfElement);
                                }
                            } else {
                                payload[nameOfElement] = valueOfElement;
                            }

                        }
                    }
                }


                // If the method is DELETE, the payload should be a queryStringObject instead
                var queryStringObject = method == 'DELETE' ? payload : {};

                // Call the API
                app.client.request(undefined,path,method,queryStringObject,payload,function(statusCode,responsePayload){
                    // Display an error on the form if needed
                    if(statusCode !== 200){

                        if(statusCode == 403){
                            // log the user out
                            app.logUserOut();

                        } else {

                            // Try to get the error from the api, or set a default error message
                            var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

                            // Set the formError field with the error text
                            document.querySelector("#"+formId+" .formError").innerHTML = error;

                            // Show (unhide) the form error field on the form
                            document.querySelector("#"+formId+" .formError").style.display = 'block';
                        }
                    } else {
                        // If successful, send to form response processor
                        app.formResponseProcessor(formId,payload,responsePayload);
                    }

                });
            });
        }
    }
};


// Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
    if(formId == 'systemCreate'){
        // If forms saved successfully and they have success messages, show them
        requestPayload.domain = requestPayload.domain ? requestPayload.domain : '';
        requestPayload.system = requestPayload.system.replace(/\_/g,'.');
        document.querySelector("#"+formId+" .formSuccess").innerHTML = 'created ' + requestPayload.system + '.' + requestPayload.domain + ' successfully';
        document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
    }
    if(formId == 'systemDelete'){
        // If deleted the system, redirect to the home page
        window.location.replace('/');
    }
    if(formId == 'serverCreate'){
        window.location.replace(document.URL);
    }
    if(formId == 'adminPanel'){
        app.admin.good();
    }
};


// Load data on the page
app.loadDataOnPage = function(){
    // Get the current page from the body class
    var bodyClasses = document.querySelector("body").classList;
    var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

    // Logic for System delete
    if(primaryClass == 'index'){
        app.loadIndexPage();
    }
    if(primaryClass == 'systemEdit'){
        app.loadEditSystemPage();
    }
    if(primaryClass == 'dashboard'){
        app.loadDashboardPage();
    }
    if(primaryClass == 'marked'){
        app.loadMarkedPage();
    }
    if(primaryClass == 'Bulk'){
        app.loadBulk();
    }
    if(primaryClass == 'admin'){
        app.admin.load();
    }

};


app.loadBulk = function () {
    // Fetch all systems data
    var queryStringObject = {
        'system': 'all',
        'domain': 'all.idf'
    };
    app.client.request(undefined, 'api/sys', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
        if (statusCode == 200) {
            // Determine if there are any systems
            var sysList = typeof(responsePayload) == 'object' && responsePayload instanceof Array && responsePayload.length > 0 ? responsePayload : [];
            if (sysList.length > 0) {

                // Show each created check as a new row in the table
                sysList.forEach(function (sys) {
                    var sysList = document.getElementById('sysList');
                    var option = document.createElement("option");
                    option.text = sys.system + '.' + sys.domain;
                    option.value = sys.system + '_' + sys.domain;
                    sysList.add(option);
                });
            }
        }
    });

};


// Load the index page specifically
app.loadIndexPage = function() {
    // Fetch all systems data
    var queryStringObject = {
        'system': 'all',
        'domain': 'all.idf'
    };
    app.client.request(undefined, 'api/sys', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
        if (statusCode == 200) {
            // Determine if there are any systems
            var sysList = typeof(responsePayload) == 'object' && responsePayload instanceof Array && responsePayload.length > 0 ? responsePayload : [];
            if (sysList.length > 0) {

                // Show each created check as a new row in the table
                sysList.forEach(function (sys) {
                    if (sys.status == "good"){
                        // Make the check data into a table row
                        var table = document.getElementById("systemsListTable");
                        var tr = table.insertRow(-1);
                        tr.classList.add(sys.status); // adds a class to the table raw
                        var td0 = tr.insertCell(0);
                        var td1 = tr.insertCell(1);
                        var td2 = tr.insertCell(2);
                        var td3 = tr.insertCell(3);
                        var td4 = tr.insertCell(4);
                        td0.innerHTML = sys.system;
                        td1.innerHTML = sys.domain;
                        td2.innerHTML = sys.servers;
                        td3.innerHTML = sys.status;
                        td4.innerHTML = '<a href="/system/edit?system=' + sys.system + '&domain=' + sys.domain + '">'+ editSvg +'</a>';
                    }
                });
                // Show each created check as a new row in the table
                sysList.forEach(function (sys) {
                    if (sys.status == "bad"){
                        // Make the check data into a table row
                        var table = document.getElementById("systemsListTable");
                        var tr = table.insertRow(-1);
                        tr.classList.add(sys.status); // adds a class to the table raw
                        var td0 = tr.insertCell(0);
                        var td1 = tr.insertCell(1);
                        var td2 = tr.insertCell(2);
                        var td3 = tr.insertCell(3);
                        var td4 = tr.insertCell(4);
                        td0.innerHTML = sys.system;
                        td1.innerHTML = sys.domain;
                        td2.innerHTML = sys.servers;
                        td3.innerHTML = sys.status;
                        td4.innerHTML = '<a href="/system/edit?system=' + sys.system + '&domain=' + sys.domain + '">'+ editSvg +'</a>';
                    }
                });
                // Show each created check as a new row in the table
                sysList.forEach(function (sys) {
                    if (sys.status == "unknown"){
                        // Make the check data into a table row
                        var table = document.getElementById("systemsListTable");
                        var tr = table.insertRow(-1);
                        tr.classList.add(sys.status); // adds a class to the table raw
                        var td0 = tr.insertCell(0);
                        var td1 = tr.insertCell(1);
                        var td2 = tr.insertCell(2);
                        var td3 = tr.insertCell(3);
                        var td4 = tr.insertCell(4);
                        td0.innerHTML = sys.system;
                        td1.innerHTML = sys.domain;
                        td2.innerHTML = sys.servers;
                        td3.innerHTML = sys.status;
                        td4.innerHTML = '<a href="/system/edit?system=' + sys.system + '&domain=' + sys.domain + '">'+ editSvg +'</a>';
                    }
                });
            } else {
                // Make the check data into a table row
                var table = document.getElementById("systemsListTable");
                var tr = table.insertRow(-1);
                tr.id = 'noSystemsMessage';
                var td0 = tr.insertCell(0);
                td0.colSpan = 5;
                td0.innerHTML = 'You have no systems, create one!';
                // Show 'you have no checks' message
                //document.getElementById("noSystemsMessage").style.display = 'table-row';

                // Show the createCheck CTA
                //document.getElementById("createSystemCTA").style.display = 'block';

            }
        } else {
            var table = document.getElementById("systemsListTable");
            var tr = table.insertRow(-1);
            tr.id = 'noSystemsMessage';
            var td0 = tr.insertCell(0);
            td0.colSpan = 5;
            td0.innerHTML = 'Error while getting systems data';
        }
    });
};


// Edit the system
app.loadEditSystemPage = function() {

    // Counter for auto page refresh
    var refCounter = 0;

// Logic for remove server
    // Fetch all system's data
    var queryStringObject = {
        'system': app.UrlQuery('system'),
        'domain': app.UrlQuery('domain')
    };

// Calls the api with DELETE to delete the server, presents a response
    delServer = function (serverName){
        queryStringObject.servers = typeof(serverName) == 'string' && serverName.length > 0 ? serverName : false ;
        if (queryStringObject.servers) {
            app.client.request(undefined, 'api/srv', 'DELETE', queryStringObject,undefined, function (statusCode,responsePayload) {
                if (statusCode == 200) {
                    refCounter += 1;
                    document.querySelector("#serverDeleteError").style.display = 'none';
                    var success = document.getElementById('serverDeleteSuccess');
                    success.style.display = 'block';
                    success.classList = 'formSuccess';
                    success.innerText = serverName + ' deleted successfully!';
                    if(refCounter < 2){
                        window.setTimeout(function(){
                            refCounter = 0;
                            window.location.replace(document.URL);
                        },5000);
                    }
                } else {
                    document.querySelector("#serverDeleteSuccess").style.display = 'none';
                    var failed = document.getElementById('serverDeleteError');
                    failed.style.display = 'block';
                    failed.innerText = 'Unable to delete ' + serverName;
                }
            });
        } else {
            document.querySelector("#serverDeleteSuccess").style.display = 'none';
            var failed = document.getElementById('serverDeleteError');
            failed.style.display = 'block';
            failed.innerText = 'Server could not be deleted at this moment';
        }
    };

// Getting the list of all servers in the desired system
    app.client.request(undefined, 'api/srv', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
        if (statusCode == 200) {
            // Determine if there are any systems
            var srvList = typeof(responsePayload) == 'object' && !app.objectValidate(responsePayload) ? responsePayload : {};
            if (!app.objectValidate(srvList)) {
                // Create a new div with class according to the state, and add it to the grid
                var div = document.getElementById("displayServers");
                srvList.good.forEach(function (goodServerName) {
                    var newDiv = document.createElement("div");
                    newDiv.classList.add('goodServer');
                    newDiv.id = goodServerName;
                    newDiv.innerHTML = goodServerName  + '<div class="icons_remove content_icon icon-ic_remove_circle_outline_black_24dp" ondblclick="delServer(\'' + goodServerName + '\')"></div>';
                    div.appendChild(newDiv);
                });
                srvList.bad.forEach(function (badServerName) {
                    var newDiv = document.createElement("div");
                    newDiv.classList.add('badServer');
                    newDiv.id = badServerName;
                    newDiv.innerHTML = badServerName + '<div class="icons_remove content_icon icon-ic_remove_circle_outline_black_24dp" ondblclick="delServer(\'' + badServerName + '\')"></div>';
                    div.appendChild(newDiv);
                });
                srvList.unknown.forEach(function (unknownServerName) {
                    var newDiv = document.createElement("div");
                    newDiv.classList.add('unknownServer');
                    newDiv.id = unknownServerName;
                    newDiv.innerHTML = unknownServerName + '<div class="icons_remove content_icon icon-ic_remove_circle_outline_black_24dp" ondblclick="delServer(\'' + unknownServerName + '\')"></div>';
                    div.appendChild(newDiv);
                });

            } else {
                // Displays a message if there are no servers in the systems record
                var div = document.getElementById("displayServers");
                var newDiv = document.createElement("div");
                newDiv.id = 'noServersMessage';
                newDiv.innerHTML = 'No servers found in system';
                div.appendChild(newDiv);
            }
        }

    });



// Logic for Delete button
    // Put the hidden phone field into both forms
    var hiddenSystemInputs = document.querySelectorAll("input.hiddenSystemNameInput");
    for(var i = 0; i < hiddenSystemInputs.length; i++){
        hiddenSystemInputs[i].value = app.UrlQuery('system');
    }
    // Put the hidden phone field into both forms
    var hiddenDomainInputs = document.querySelectorAll("input.hiddenDomainNameInput");
    for(var i = 0; i < hiddenDomainInputs.length; i++){
        hiddenDomainInputs[i].value = app.UrlQuery('domain');
    }
};


// the system dashboard page
app.loadDashboardPage = function(){
    // Fetch all systems data
    var queryStringObject = {
        'system': 'all',
        'domain': 'all.idf'
    };
    app.client.request(undefined, 'api/sys', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
        if (statusCode == 200) {
            // Determine if there are any systems
            var sysList = typeof(responsePayload) == 'object' && responsePayload instanceof Array && responsePayload.length > 0 ? responsePayload : [];
            if (sysList.length > 0) {

                var div = document.getElementById("dashboard");
                // Show each created check as a new row in the table
                sysList.forEach(function (sys) {
                    // Create a new div with class according to the state, and add it to the grid
                    var srvCount = sys.servers.length;
                    var dispName = sys.system.trim() + '.' + sys.domain.trim() + ' <h6 class="serverCount">' + srvCount + '</h6>';
                    var newDiv = document.createElement("section");
                    newDiv.classList.add(sys.status.trim() + 'Dash');
                    newDiv.innerHTML = dispName;
                    var sendData = {
                        'system' : sys.system.trim(),
                        'domain' : sys.domain.trim()
                    };
                    newDiv.addEventListener("dblclick",function () {
                        app.dashClick(sendData);
                    });
                    div.appendChild(newDiv);
                });
            } else {
                // Show 'you have no systems' message
                var noSystems = 'No systems found! double click to create one';
                var div = document.getElementById("dashboard");
                var newDiv = document.createElement("section");
                newDiv.id = 'noSystemsMessageDash';
                newDiv.innerHTML = noSystems;
                newDiv.addEventListener("click", function () {
                    window.location.replace('/system/create');
                });
                div.appendChild(newDiv);
            }
        } else {
            // Show 'you have no systems' message
            var noSystems = 'Error while getting systems data';
            var div = document.getElementById("dashboard");
            var newDiv = document.createElement("section");
            newDiv.id = 'noSystemsMessageDash';
            newDiv.innerHTML = noSystems;
            newDiv.addEventListener("click",function () {
                console.log('click');
                window.location.replace('/system/create');
            });
            newDiv.onmouseover = function(){
                document.getElementById('noSystemsMessageDash').innerHTML = 'click here to create a system';
            };
            newDiv.onmouseout = function(){
                document.getElementById('noSystemsMessageDash').innerHTML = noSystems;
            };
            div.appendChild(newDiv);
        }
    });
};


// the system dashboard page
app.loadMarkedPage = function(){
    // Fetch all systems data
    var queryStringObject = {
        'system': 'all',
        'domain': 'all.idf'
    };
    app.client.request(undefined, 'api/sys', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
        if (statusCode == 200) {
            // Determine if there are any systems
            var sysList = typeof(responsePayload) == 'object' && responsePayload instanceof Array && responsePayload.length > 0 ? responsePayload : [];
            if (sysList.length > 0) {

                var div = document.getElementById("marked");
                // Show each created check as a new row in the table
                sysList.forEach(function (sys) {
                    // Create a new div with class according to the state, and add it to the grid
                    var srvCount = sys.servers.length;
                    var dispName = sys.system.trim() + '.' + sys.domain.trim();
                    var newDiv = document.createElement("section");
                    newDiv.classList.add(sys.status.trim() + 'Marked');
                    newDiv.innerHTML = dispName;
                    var sendData = {
                        'system' : sys.system.trim(),
                        'domain' : sys.domain.trim()
                    };
                    newDiv.addEventListener("dblclick",function () {
                        app.dashClick(sendData);
                    });
                    div.appendChild(newDiv);
                });
            } else {
                // Show 'you have no systems' message
                var noSystems = 'No systems found! double click to create one';
                var div = document.getElementById("marked");
                var newDiv = document.createElement("section");
                newDiv.id = 'noSystemsMessageMarked';
                newDiv.innerHTML = noSystems;
                newDiv.addEventListener("click", function () {
                    window.location.replace('/system/create');
                });
                div.appendChild(newDiv);
            }
        } else {
            // Show 'you have no systems' message
            var noSystems = 'Error while getting systems data';
            var div = document.getElementById("marked");
            var newDiv = document.createElement("section");
            newDiv.id = 'noSystemsMessageMarked';
            newDiv.innerHTML = noSystems;
            newDiv.addEventListener("click",function () {
                console.log('click');
                window.location.replace('/system/create');
            });
            newDiv.onmouseover = function(){
                document.getElementById('noSystemsMessageMarked').innerHTML = 'click here to create a system';
            };
            newDiv.onmouseout = function(){
                document.getElementById('noSystemsMessageMarked').innerHTML = noSystems;
            };
            div.appendChild(newDiv);
        }
    });
};


app.dashClick = function (data) {
    window.location.replace('/system/edit?system='+data.system+'&domain='+data.domain);
};

// This part is for displaying the about page.




app.autoRefrash = function(){
    // Get the current page from the body class
    var bodyClasses = document.querySelector("body").classList;
    var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;
    if(primaryClass == "dashboard"){
        setInterval(function () {
            $("#dashboardContainer").load(document.URL + ' #dashboard',function () {
                app.loadDashboardPage();
            });
        }, 1000 * 90);
    }
    if(primaryClass == "index"){
        setInterval(function () {
            $("#indexContainer").load(document.URL + ' #systemsListTable',function () {
                app.loadIndexPage();
            });
        }, 1000 * 120);
    }
    if(primaryClass == 'systemEdit'){
        setInterval(function () {
            $("#serverContainer").load(document.URL + ' #displayServers',function () {
                app.loadEditSystemPage();
            });
        }, 1000 * 90);
    }
};


// Init (bootstrapping)
app.init = function(){
    // Bind all form submissions
    app.bindForms();

    // Load data on page
    app.loadDataOnPage();

    // Automatically refresh the data on the page
    app.autoRefrash();

    // Display the current time
    app.startTime();

};

/* When the user clicks on the button,
    toggle between hiding and showing the dropdown content */
function showDropList (){
    document.getElementById("createDropList").classList.toggle("show");
};

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};



// About page logic

function openAbout(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tabcontent.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
};



// Searching in the index table
app.searcher = function () {
    // Declare variables
    var input, filter, table, tr, td1, td2, td3, i, sysVal, domVal, srvVal;
    input = document.getElementById('myInput');
    filter = input.value.toLowerCase();
    table = document.getElementById('systemsListTable');
    tr = table.getElementsByTagName("tr");

    // Loop trough all the table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[0];
        td2 = tr[i].getElementsByTagName("td")[1];
        td3 = tr[i].getElementsByTagName("td")[2];
        if (td1 || td2 || td3) {
            sysVal = td1.textContent || td1.innerText;
            domVal = td2.textContent || td2.innerText;
            srvVal = td3.textContent || td3.innerText;
            if ((sysVal.toLowerCase().indexOf(filter) > -1) || (domVal.toLowerCase().indexOf(filter) > -1) || (srvVal.toLowerCase().indexOf(filter) > -1) ){
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
};


// Admin page
app.admin = {};

app.admin.load = function () {
    document.getElementById("myNav").style.width = "100%";
};

app.admin.good = function (){
    document.getElementById("myNav").style.width = "0%";
};

// List all logs at click of button and add them to the table of logs
app.admin.listLogs = function (compVal){
    // Fetch all systems data
    var queryStringObject = {
        'list': 'true',
        'comp' : compVal
    };
    app.client.request(undefined, 'api/logs', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
        if (statusCode == 200) {
            // Determine if there are any uncompressed logs
            var logList = typeof(responsePayload.logs) == 'object' && responsePayload.logs instanceof Array && responsePayload.logs.length > 0 ? responsePayload.logs : [];
            if (logList.length > 0) {
                document.getElementById("logOrderList").style.display = "";
                document.getElementById("logOrderList").innerHTML = "";
                document.getElementById("logContent").style.display = "none";
                document.getElementById("logContent").innerHTML = "";
                var listObj = document.getElementById("logOrderList");
                // Show each created check as a new row in the table
                logList.forEach(function (log) {
                    var listItem = document.createElement("li");
                    listItem.innerHTML = log.trim();
                    var sendData = {
                        'logName' : log.trim(),
                        'comp' : compVal
                    };
                    listItem.addEventListener("dblclick",function () {
                        app.admin.logRead(sendData);
                    });
                    listObj.appendChild(listItem);
                });
            } else {
                // Show 'you have no logs' message
                console.log('no logs');
            }
        } else {
            // Show 'you have no systems' message
            console.log(statusCode);
        }
    });
};

// reads an uncompressed log
app.admin.logRead = function (data){
    app.client.request(undefined, 'api/logs', 'GET', data, undefined, function (statusCode, responsePayload) {
        if (statusCode == 200) {
            // Determine if there are any systems
            var logData = typeof(responsePayload.data) == 'string' && responsePayload.data.length > 0 ? responsePayload.data.trim() : [];
            if (logData.length > 0) {
                document.getElementById("logOrderList").style.display = "none";
                document.getElementById("logContent").style.display = "";
                var div = document.getElementById("logContent");
                var logArray = [];
                logData.split('}').forEach(function (log) {
                    if(log.length > 0){
                        logArray.push(log + '}');
                    }
                });
                logArray.forEach(function (line) {
                    var logTitle = document.createElement("h3");
                    logTitle.innerHTML = data.logName;
                    div.appendChild(logTitle);
                    var newLine = document.createElement("p");
                    newLine.classList.add('logItem');
                    newLine.innerHTML = line;
                    div.appendChild(newLine);
                });

            } else {
                // Show 'Log is empty' message
                document.getElementById("logOrderList").style.display = "none";
                document.getElementById("logContent").style.display = "";
                var div = document.getElementById("logContent");
                var newLine = document.createElement("p");
                newLine.innerHTML = 'The log you chose is empty, please choose a different one!';
                div.appendChild(newLine);
            }
        } else {
            // Show Log not found message
            document.getElementById("logOrderList").style.display = "none";
            document.getElementById("logContent").style.display = "";
            var div = document.getElementById("logContent");
            var newLine = document.createElement("p");
            newLine.innerHTML = 'The log specified could not be found!';
            div.appendChild(newLine);
        }
    });
};







// Call the init processes after the window loads
window.onload = function(){

// Validate the chrome version is above 58
    var validator = app.userAgent();
    if (validator){
        app.init();
    } else {
        console.log('error');
        var errMsg = document.createElement("h1");
        errMsg.innerHTML = "</br></br></br>ERROR! Your Chrome version is not supported!</br>" +
            "Please use Chrome 58 and higher or consider using firefox!</br>" +
            "<a href='public/chrome/chrome.msi' style='font-size: 20px; color: blue; text-underline: blue'>Click here to download Chrome 64</a></br>" +
            "<a href='public/chrome/flash.exe' style='font-size: 20px; color: blue; text-underline: blue'>Click here to download Adobe Flash</a> "
        document.body.innerHTML = "";
        /*document.body.style.backgroundImage = "url('public/clockwork_orange1.jpg')";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";*/
        document.body.appendChild(errMsg);
    }

};