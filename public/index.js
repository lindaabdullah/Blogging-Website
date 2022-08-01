// const paragraphs = document.getElementsByClassName("postParagraph");

// paragraphs.array.forEach(x => {
//     if(x.innerText.split(" ").length > 20){
//         const restOfStr = 
//         const span = document.createElement("span");

//     }
// });

// document.querySelector(".imageText .postReadMore").addEventListener("click", function() {
//     document.querySelector(".imageText .postRest").removeAttribute("hidden");
//     this.innerText = "Read Less";
// });

var del = false;
var postCount = 0;

function updatePostElem(paragraph) {
    const text = paragraph.innerText.split(" ");
    // console.log(text);
    if (text.length > 20) {

        const first = text.slice(0, 20).join(" ");
        const second = " " + text.slice(20).join(" ");
        paragraph.innerText = first;

        const rest = document.createElement("span");
        rest.innerText = second;
        rest.classList.add("postRest");
        rest.setAttribute("hidden", "");

        const readMore = document.createElement("a");
        readMore.innerText = "Read More";
        readMore.href = "javascript:void(0);";
        readMore.classList.add("postReadMore");

        readMore.addEventListener("click", function () {
            if (rest.hasAttribute("hidden")) {
                rest.removeAttribute("hidden");
                this.innerText = "Read Less";
            }
            else {
                rest.setAttribute("hidden", "");
                this.innerText = "Read More";
            }
        });
        
        paragraph.appendChild(rest);
        paragraph.parentElement.appendChild(readMore);
    }
}

function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

function decode(token) {
    // console.log("im decoding");
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

var enterBtn = false;
// var postCount = 2;

async function addPost() { 

    const result = await fetch("/api/query");
    const res = await result.json();
    if(res.length != 0){
        const resResult = res[0];
        postCount = resResult.SectionID;
        postCount++; 
    }
    else {
        postCount = 1;
    }

    const title = document.querySelector('input[id="title"]').value;
    const hashtag1 = document.querySelector('input[id="hashTag1"]').value;
    const hashtag2 = document.querySelector('input[id="hashTag2"]').value;
    const hashtag3 = document.querySelector('input[id="hashTag3"]').value;
    const hashtag4 = document.querySelector('input[id="hashTag4"]').value;
    const image = document.querySelector('input[id="imageLink"]').value;
    const p = document.querySelector('input[id="paragraph"]').value;

    const post = {
        SectionID: postCount,
        title: title,
        hashtag1: hashtag1,
        hashtag2: hashtag2,
        hashtag3: hashtag3,
        hashtag4: hashtag4,
        image: image,
        paragraph: p
    };

    const resp = await fetch("/api/Addpost", {
        method: "post", 
        headers: { "content-type": "application/json" }, 
        body: JSON.stringify(post)
    });

    const {username} = await resp.json();
    post.username = username;

    appendPost(post);
}


function appendPost(post) {

    // console.log(username);

    const { SectionID, title, hashtag1, hashtag2, hashtag3, hashtag4, image, paragraph, username } = post;


    const usernameplacement = document.createElement("div");
    usernameplacement.classList.add("usernamePlacement");
    usernameplacement.innerText = username;

    const a1 = document.createElement("a");
    a1.innerText = `\#${hashtag1}`;

    const a2 = document.createElement("a");
    a2.innerText = `\#${hashtag2}`;

    const a3 = document.createElement("a");
    a3.innerText = `\#${hashtag3}`;
    const a4 = document.createElement("a");
    a4.innerText = `\#${hashtag4}`;


    const hashTags = document.createElement("div");
    hashTags.classList.add("hashTags")

    const ul = document.createElement("ul");
    ul.classList.add("hashTagsMenu");


    const li1 = document.createElement("li");
    li1.classList.add("tags");
    li1.appendChild(a1);
    ul.appendChild(li1);

    const li2 = document.createElement("li");
    li2.classList.add("tags");
    li2.appendChild(a2);
    ul.appendChild(li2);

    const li3 = document.createElement("li");
    li3.classList.add("tags");
    li3.appendChild(a3);
    ul.appendChild(li3);

    const li4 = document.createElement("li");
    li4.classList.add("tags");
    li4.appendChild(a4);
    ul.appendChild(li4);


    const section = document.createElement("section");
    section.classList.add("post");
    section.id = `postSection${SectionID}`;
    section.addEventListener("click", async function (e) {
        if(del){
            let isExecuted = confirm("Are you sure you want to delete this post?");
            console.log(`executed: ${isExecuted}`);
            const id = this.id[this.id.length-1];
            // console.log(id);
            if(isExecuted) {
                e.preventDefault(); 
                this.remove();

                await fetch("/api/delete", {
                    method: "post", 
                    headers: { "content-type": "application/json" }, 
                    body: JSON.stringify({SectionID: id})
                });
            }
        }
    });

    const header = document.createElement("header");

    header.classList.add("postHeader");
    header.innerText = title;

    const div = document.createElement("div");
    div.classList.add("postImage");

    const img = document.createElement("img");
    img.src = image;

    // const para = document.createElement("p");
    // para.innerText = p;

    const para = document.createElement("p");
    para.innerText = paragraph;

    const sectionImg = document.createElement("section");
    sectionImg.classList.add("imageText");

    sectionImg.appendChild(div);
    sectionImg.appendChild(para);

    hashTags.appendChild(ul);
    div.appendChild(img);

    section.appendChild(header);
    section.appendChild(usernameplacement);
    section.appendChild(hashTags);
    section.appendChild(sectionImg);

    section.appendChild(para);
    updatePostElem(para);
    document.querySelector(".content").appendChild(section);

    const ulcomments = document.createElement("ul");
    ulcomments.id = `commentList${SectionID}`;
    ulcomments.classList.add("commentList");
    ulcomments.classList.add("hidden");

    // ulcomments.style.display = "none";

    // <div class="comments" id="post2"></div>
    const commentsDiv = document.createElement("div");
    commentsDiv.className = "comments";
    commentsDiv.id = `post${SectionID}`;

    // <input type="text" placeholder="comment" size="30" id="commentInput2" name="comment">
    // <button type="button" id="addComment2">Add comment</input>

    const input1 = document.createElement("input");
    input1.id = `commentInput${SectionID}`;
    input1.type = "text";
    input1.size = "30";
    input1.name = "comment";
    input1.placeholder = "comment";

    const btn = document.createElement("button");
    btn.id = `addComment${SectionID}`;
    btn.type = "button";
    btn.innerText = "Add Comment";

    btn.addEventListener("click", async function (e) {
        console.log("asd");
        const id = `${e.target.id}`;
        
        const param1 = parseInt(id[id.length - 1]);
        console.log(param1);
        const search = "#commentList" + param1 + " li";
        const elementid = `commentList${param1}`;
        console.log(elementid);
        
        console.log(search);
        const length = document.querySelectorAll(search).length
        const comment = document.getElementById(`commentInput${SectionID}`).value;
        console.log(comment);
        
        
        await fetch("/api/Add", {
            method: "post", headers: { "content-type": "application/json" }, body: JSON.stringify({
                postid: param1,
                postcomment: comment
            })
        });

        

        if (length == 0 && comment != "") {
            // document.querySelector(`#commentList${param1}`).style.display = "block";
            document.getElementById(elementid).classList.remove("hidden");
            const li = document.createElement("li");
            li.innerText = `${username}: ${comment}`;
            document.getElementById(elementid).appendChild(li);
        }
        else if (comment == "" || length == 0 && comment == "") {
            event.preventDefault();
        }
        else {
            const li = document.createElement("li");
            li.innerText = `${username}: ${comment}`;
            document.getElementById(`commentList${param1}`).appendChild(li);
        }
    });

    commentsDiv.appendChild(input1);
    commentsDiv.appendChild(btn);
    commentsDiv.appendChild(ulcomments);

    const commentDivParent = document.createElement("div");
    commentDivParent.id = `post${SectionID}`;

    section.appendChild(commentDivParent);
    document.getElementById(`post${SectionID}`).appendChild(commentsDiv);
}



var add = false;
document.querySelectorAll(".post .postParagraph").forEach(updatePostElem);

document.getElementById("addButton").addEventListener("click", function () {
    add = !add;
    const x = document.querySelector(".inputsPlusButton");
    if (add) {
        // x.style.display = "block";
        x.classList.remove("hidden");
        document.getElementById("addButton").style.backgroundColor = "lightgreen";
    }
    else {
        document.getElementById("addButton").style.backgroundColor = "lightskyblue";
        x.classList.add("hidden");
        // x.style.display = "none";

    }
})

const arr = [];

document.querySelectorAll("p").forEach(element => {
    arr.push(element.innerText);
});

for (i of arr) {
    console.log(i);
}

function count(element, x) {
    const count = element.innerText.match(x).length;
    const a = element.innerText.match(x);
    for (i of a) {
        console.log(i);
    }
}

document.getElementById("submitAdd").addEventListener("click", addPost);

function searchPosts(query) {
    return [...document.querySelectorAll(".postParagraph")]
        .map(i => {
            const string = i.innerHTML.replaceAll(/<.*?>/g, "");
            const matches = [...string.matchAll(query) || []];
            const count = matches.length;
            return { post: i.parentElement.parentElement, element: i, string, matches, count, query }
        })
        // .filter(i => i.count != 0)
        .sort((a, b) => b.count - a.count);
}


function highlightPosts(searchResults) {
    // console.log(searchResults);
    for (const e of searchResults) {
        const { element, query } = e;
        element.innerHTML = element.innerHTML
            .replaceAll(/<.*?>(.*?)<\/.*?>/gi, "$1")
            .replaceAll(query, `<mark>${query}</mark>`);
    }
}

// listens to the keys being pressed
document.getElementById("searchInput").addEventListener("input", function (e) {
    const query = this.value;
    highlightPosts(searchPosts(query));

    // adds or removes the read more feature
    if (query == "") {
        document.querySelectorAll(".post .postParagraph").forEach(updatePostElem);
    } else {
        document.querySelectorAll(".postReadMore").forEach(i => i.remove());
    }
});


// async function getAllPosts() {
//     const resp = await fetch("/api/all");
//     return await resp.json();
// }

async function appendComments() {
    const resp = await fetch("/api/commentList");
    const rows = await resp.json() 
    for (const r of rows) {
        const id = r.postID;
        // console.log(id);
        const s = `commentList${id}`;
        // console.log(s);
        const ul = document.getElementById(s);
        try {
            const children = ul.children;
            // console.log(children.length);
            if (children.length == 0){
                ul.classList.remove("hidden");
            }
            const li = document.createElement("li");
            li.innerText = `${r.username}: ${r.comment}`;
            ul.appendChild(li);
        } catch (error) {
            
        }
    }
}

async function appendAllPosts() {
    const resp = await fetch("/api/all");
    if (resp.status == 403) {
        window.location.href = "/error.html";
    }
    else {
        const posts = await resp.json();
        for (const post of posts) {
              
            appendPost(post);
        }
        appendComments();
    }
}

async function deletePost(id) {
    await fetch("/api/delete", 
        {
            method: "post", 
            headers: { "content-type": "application/json" }, 
            body: JSON.stringify({SectionID: id})
        }
    )
}


document.getElementById("deleteButton").addEventListener("click", function(e) {
    del = !del;
    console.log(del);
    const element = document.getElementById("deleteButton");
    if(del) {
        postCount--;
        element.style.backgroundColor = "lightgreen";
        window.confirm("Select post you want to delete");
    }
    else {
        element.style.backgroundColor = "lightskyblue";

    }
});