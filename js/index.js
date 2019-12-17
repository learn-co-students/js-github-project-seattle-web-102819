
function getUser(userId) {
    return `https://api.github.com/search/users?q=${userId}`
}
function getRepoList(userId) {
    return `https://api.github.com/users/${userId}/repos`
}

function handleUserSearch(e) {
    e.preventDefault();
    let userID = e.target.search.value;
    fetch(getUser(userID), {
        method: 'Get',
        headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/vnd.github.v3+json'
        }
    })
    .then((resp) => resp.json())
    .then ((data) => parseUsers(data))
}

function parseUsers(json) {
    const userArray = json["items"];
    for (const user of userArray) {
        showUser(user)
    }
}

function showUser(user) {
    const userList = document.getElementById('user-list');
    const div = makeUserCard(user);
    userList.appendChild(div);
}

function makeUserCard(user) {
    const div = document.createElement("div");
    div.className = "usercard";
    div.id = `user${user.id}`;

    const h4 = document.createElement("h4");
    h4.textContent = user.login;
    div.appendChild(h4);


    const a = document.createElement("a");
    a.textContent = 'View Profile';
    div.appendChild(a);
    a.href = user.html_url;   
    a.target = "blank";     

    const img = document.createElement("img");
    a.appendChild(img) 
    img.src = user.avatar_url;

    //add listener to view repos

    h4.addEventListener("click", (e)=> getRepos(user))

    return div;
}

function getRepos(user) {
    fetch(getRepoList(user.login), {
        method: 'Get',
        headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/vnd.github.v3+json'
        }
    })
    .then(resp => resp.json())
    .then(json => showRepos(json, user))
}

function showRepos(json, user) {
    const userCard = document.getElementById(`user${user.id}`)
    const repoList = document.getElementById('repos-list');
    userCard.insertBefore(repoList, userCard.secondChild)
    //clearing text each time
    repoList.innerText = ''

    json.map(repo => {
        const li = document.createElement("li");
        repoList.appendChild(li);
        const a = document.createElement("a");
        li.appendChild(a);
        a.href = repo.html_url;
        a.textContent = repo.full_name;
    })
}

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector('#github-form');
    form.addEventListener("submit", (e) => handleUserSearch(e))

})