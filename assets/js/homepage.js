// variables for form elements 
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

// variables to display search results in the right column
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");


// function to be exectuted upon a form submission browser event
// when we submit the form we get the value via the nameInputEl variable, store it as usernmae
var formSubmitHandler = function (event) {
    // prevents default form action
    event.preventDefault();

    //get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        // if a value is entered then the function will work 
        getUserRepos(username);
        nameInputEl.value = "";

    }
    else {
        // if a value is entered then an alert pops up asking for a value 
        alert("Please enter a Github username");
    }

}

var getUserRepos = function (user) {

    //format the github api url
    var apiUrL = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    fetch(apiUrL).then(function (response) {
        // if they put in a valid username
        if (response.ok) {
        response.json().then(function (data) {
            // this takes data from getUserRepos and sents it to displayRepos after it is converted to JSON
            displayRepos(data, user);
        
       
        });
    // if they put in a username that isn't valid 
    } else {
        alert("Error: GitHub User Not Found");

    }
    })
    // if there is an error at all the catch function alerts the user
    .catch(function(error) {
        //Notice this `.catch()` getting chained onto the end of the `then()` method
        alert("Unable to connect to Github");
    })
};

// this function accepts the array of repository data and the terms we search for as parameters
var displayRepos = function (repos, searchTerm) {
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name- this pulls the repo owner and repo name from the data when it loops
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo and turn them into links that link to next page 
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);


        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container- this appends the repo name title to the element 
        repoEl.appendChild(titleEl);

        // create a status element- for whether or not the repo has open issues
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        repoEl.appendChild(statusEl);

        //append container to the dom this appends the element to the container we created in html
        repoContainerEl.appendChild(repoEl);

    }
}

// runs form SubmitHandler function when form is submitted 
userFormEl.addEventListener("submit", formSubmitHandler);