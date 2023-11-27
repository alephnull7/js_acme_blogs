function createElemWithText(elemStrName = "p", textContentStr = "", className) {
    const newElem = document.createElement(elemStrName);
    const textContent = document.createTextNode(textContentStr);
    newElem.appendChild(textContent);

    if (typeof className !== "undefined") {
        newElem.classList.add(className);
    }

    return newElem;
}

function createSelectOptions(JSONData) {
    if (typeof JSONData === "undefined") {
        return;
    }

    const optionsArr = [];
    for (let user of JSONData) {
        let option = document.createElement("option")
        option.value = user.id;
        option.textContent = user.name;
        optionsArr.push(option);
    }   
    return optionsArr;
}

function toggleCommentSection(postId) {
    if (typeof postId === "undefined") {
        return;
    }

    const sections = document.querySelectorAll("section");
    for (let section of sections) {
        if (section.getAttribute("data-post-id") == postId) {
            section.classList.toggle("hide");
            return section;
        }
    }
    return null;
}

function toggleCommentButton(postId) {
    if (typeof postId === "undefined") {
        return;
    }

    const buttons = document.querySelectorAll("button");
    for (let button of buttons) {
        if (button.getAttribute("data-post-id") == postId) {
            button.textContent === "Show Comments" 
                ? button.textContent = "Hide Comments" 
                : button.textContent = "Show Comments";
            return button; 
        }
    }
    return null;    
}

function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) {
        return;
    }

    let lastChild = parentElement.lastElementChild;
    while (lastChild) {
        parentElement.removeChild(lastChild);
        lastChild = parentElement.lastElementChild;
    }
    return parentElement;
}

function addButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (buttons) {
        for (let button of buttons) {
            let postId = button.dataset.postId;
            if (postId) {
                button.addEventListener("click", function(event) {
                    toggleComments(event, postId)
                }, false)
            }
        }
    }
    return buttons;
}

function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (buttons) {
        for (let button of buttons) {
            let postId = button.dataset.postId;
            if (postId) {
                button.removeEventListener("click", function(event) {
                    toggleComments(event, postId)
                }, false)
            }
        }
    }
    return buttons;
}

function createComments(JSONData) {
    if (!JSONData) {
        return;
    }

    const fragment = document.createDocumentFragment();
    for (let comment of JSONData) {
        let article = document.createElement("article");
        let h3 = createElemWithText("h3", comment.name);
        let p1 = createElemWithText("p", comment.body);
        let p2 = createElemWithText("p", `From: ${comment.email}`);
        article.append(h3, p1, p2);
        fragment.append(article);
    }
    return fragment;
}

function populateSelectMenu(JSONData) {
    if (!JSONData) {
        return;
    }

    const selectMenu = document.querySelector("#selectMenu");
    const options = createSelectOptions(JSONData);
    for (let option of options) {
        selectMenu.append(option);
    }
    return selectMenu;
}

async function getJSONPlaceholder(url) {
    try {
        const result = await fetch(url);
        if (!result.ok) {
            throw new Error("Status code not in 200-299 range");
        }
        const data = await result.json();
        return data;
    } catch (e) {
        console.error(e);
    }
}

async function getUsers() {
    const url = "https://jsonplaceholder.typicode.com/users";
    return await getJSONPlaceholder(url);
}

async function getUserPosts(userId) {
    if (!userId) {
        return;
    }

    const url = `https://jsonplaceholder.typicode.com/users/${userId}/posts`;
    return await getJSONPlaceholder(url);
}

async function getUser(userId) {
    if (!userId) {
        return;
    }

    const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
    return await getJSONPlaceholder(url);
}

async function getPostComments(postId) {
    if (!postId) {
        return;
    }

    const url = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
    return await getJSONPlaceholder(url);
}

async function displayComments(postId) {
    if (!postId) {
        return;
    }

    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);

    section.append(fragment);
    return section;
}

async function createPosts(JSONPosts) {
    if (!JSONPosts) {
        return;
    }

    const fragment = document.createDocumentFragment();
    for (let post of JSONPosts) {
        let article = document.createElement("article");

        let h2 = createElemWithText("h2", post.title);
        let p1 = createElemWithText("p", post.body);
        let p2 = createElemWithText("p", `Post ID: ${post.id}`);

        let author = await getUser(post.userId);
        let p3 = createElemWithText("p", 
            `Author: ${author.name} with ${author.company.name}`);
        let p4 = createElemWithText("p", author.company.catchPhrase);

        let button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;

        article.append(h2, p1, p2, p3, p4, button);
        let section = await displayComments(post.id);
        article.append(section);

        fragment.append(article);
    }
    return fragment;
}

async function displayPosts(JSONPosts) {
    const main = document.querySelector("main");
    const element = JSONPosts
        ? await createPosts(JSONPosts)
        : createElemWithText("p", 
            document.querySelector(".default-text").textContent,
            "default-text");
    main.append(element);
    return element;
}

function toggleComments(event, postId) {
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}