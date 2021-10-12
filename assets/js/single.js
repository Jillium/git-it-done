// need this to append issues to the page 
var issueContainerEl = document.querySelector("#issues-container");
// need this to show if there are more than 30 issues 
var limitWarningEl = document.querySelector("#limit-warning");
// where to show repo name 
var repoNameEl = document.querySelector("#repo-name");





var getRepoName = function() {
    // query string from our search
    var queryString = document.location.search;
    var repoName = queryString.split("=")[1];
    getRepoIssues(repoName);
    repoNameEl.textContent = repoName;

//display repo name on the page 
    if (repoName) {
     repoNameEl.textContent = repoName;
     getRepoIssues(repoName);   
}
else {
    // if no repo was given, redirect to the homepage
    document.location.replace("./index.html");
}
};



// function takes in a repo name as a parameter 
var getRepoIssues = function(repo) {
    
    // variable holds the link for the api input and adds the repo we are searching to it 
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    
    // the fetch request receives the response and handles it 
    fetch(apiUrl).then(function(response) {
        // request was succesful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to dom function 
                displayIssues(data);

                // check if api has paginated issues- github only allows 30 at a time so this means if there are paginated issues there are more than 30
                if (response.headers.get("Link")) {
                    // display warning if there are more than 30 issues 
                    displayWarning(repo);
                }
            });
        }
        // request was not succesful 
        else {
            document.location.replace("./index.html");
        }

       
});

//this function accepts a parameter called issues - can call this function after a succesful https request 
var displayIssues = function(issues) {
    // if repo has no open issues display message 
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    // if open issues loop through and print to page 
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between alignpcenter";
        // links to full issue on github 
        issueEl.setAttribute("href", issues[i].html_url);
        // opens link in new page 
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title-issue title is pulled from data from request 
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        // create a type element to display what type of issue it is 
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request 
        if (issues[i].pull_request) {
            // if pull request set text content to pull request 
            typeEl.textContent = "(Pull request)";
        }
        else {
            // if issue set text content to issue 
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);
        // append to page 
        issueContainerEl.appendChild(issueEl);
    }
}}


// function to display a warning if there are more than 30 issues 
var displayWarning = function(repo) {
    // add text to the warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    //create a link element 
    var linkEl = document.createElement("a");
    // add text and link to link element 
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
