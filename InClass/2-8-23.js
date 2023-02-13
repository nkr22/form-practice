function sum(...theArgs) {
    //arguments are not binded in arrow functions
    console.log(theArgs);
    // return theArgs.reduce((previous, current)=>)
}

let parts = ["shoulders", "knees"];
let lyrics = ["head", ...parts, "and", "toes"];

let promise = new Promise(function (resolve, reject) {
    if (/*everything worked */ resolve) {
        resolve("It worked");
    } else {
        reject(Error("It didn't work"));
    }
});

//Promise.all()

let p1 = Promise.resolve(3);
