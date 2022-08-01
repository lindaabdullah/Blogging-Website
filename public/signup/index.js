function getSignUpInfo () {


    return { SSN: SSN, name: name, surname: surname, age: age, username: username, password: password};
}



document.getElementById("goBackButton").addEventListener("click", function () {
    window.location.href = "/login/index.html";
});

document.getElementById("signupButton").addEventListener("click", async function () {
    
    console.log("hello");
    const element = document.getElementById("text");

    const SSN = document.getElementById("SSN").value;
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const age = parseInt(document.getElementById("age").value);
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const person = {SSN, name, surname, age, username, password};

    const x = await fetch("/api/signup", {
        method: "post", 
        headers: { "content-type": "application/json" }, 
        body: JSON.stringify(person)
    });

    const {status} = await x.json();
    
    if(status == "missing information"){
        element.classList.remove("hidden");
        element.innerText = status;
    }
    else if (status == "exists") {
        // const element = document.getElementById("text");
        element.classList.remove("hidden");
        element.innerText = "user already exists";        
    } else if (status == "SignUpSuccessful") {
        element.innerText = "Sign Up Successful";        
    }
    
});