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