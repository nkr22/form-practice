//javascript has a couple of helpful methods on object
const obj = {
    prop: 42,
};

Object.freeze(obj); //prevents any changes to obj
obj.prop = 33; //will throw an error

//Generator Examples
//a generator function (function*) returns a generator object

let simpleGenerator = (function* () {
    yield 1;
    yield 2;
    yield 3;
})();
console.log(simpleGenerator.next()); //value 1, done=false
console.log(simpleGenerator.next()); //value 2, done=false
console.log(simpleGenerator.next()); //value 3, done=false
console.log(simpleGenerator.next()); //value undefined, done=true

//make sure to instantiate generators
let fibonacci = (function* () {
    let fib1 = 1;
    let fib2 = 1;
    yield 0;
    yield 1;
    yield 1;
    while (true) {
        let result = fib1 + fib2;
        fib1 = fib2;
        fib2 = result;
        yield result;
    }
})();

fibonacci.next();
fibonacci.next();
fibonacci.next();
fibonacci.next();

//example of a promise
//promise needs a resolve and a reject (but you can name whatever you want)
let promise = new Promise(function (resolve, reject) {
    if (/*everything worked */ resolve) {
        resolve("It worked");
    } else {
        reject(Error("It didn't work"));
    }
});

//promises with multiple thens
function get(url) {
    return new Promise(function (resolve, reject) {
        const req = new XMLHttpRequest();
        req.open("GET", url);
        req.onload = function () {
            // This is called even on 404 etc. so check status code
            if (req.status == 200) {
                resolve(req.response);
            } else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function () {
            // This is where we catch any network errors
            reject(Error("Network Error"));
        };
        req.send();
    });
}

get("story.json")
    .then(function (response) {
        return JSON.parse(response);
    })
    .then(function (response) {
        console.log("Yay, we received JSON!", response);
    });

//you can also simply it
get("story.json")
    .then(JSON.parse)
    .then(function (response) {
        console.log("Yay, we received JSON!", response);
    });

//because this is common, we can clean it up and make its own function for it
//async is a symbol to the compiler that you will be waiting for something!
//database or api calls
function getJSON(url) {
    return get(url).then(JSON.parse);
}
getJSON("story.json").then(function (response) {
    console.log("Yay, we received JSON!", response);
});

//fetch API is a promise-oriented replacement for xmlhttprequest
//it is better suited for Service Workers
//a couple of nice points about fetch compary to jquery.ajax()
//the promise returned from a fetch wont reject on HTTP error status (404 or 500)
//by default, fetch doesn't send/receive cookies- you have to specify that explicitly

//example of get request
fetch("https://example.com/movies.json") //start a request
    .then(function (response) {
        return response.json(); //get the json
    })
    .then(function (myJson) {
        console.log(JSON.stringify(myJson)); //convert the json to string
    });

fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "application/json",
    },
})
    .then((res) => res.json())
    .then((response) => console.log())
    .catch();

//.race is the first one
//.all resolve all of them

//modules in javascript
//es6 has import and export statements
<script type="module" src="js/myModule.js"></script>;
//modules run all code in strict mode without declaring the pragma 'use strict'
//when using modules,we only have access to things we've imported
//you only have access to your imports
//you can import things you have exported
//you can export: variables, object literals, classes, functions
