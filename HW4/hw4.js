// const validator = (function () {
//     // ...
//     let isValid = true;
//     return {
//         isNumeric: function (text) {
//             if (typeof text !== "number") {
//                 isValid = false;
//             }
//         },
//         isInteger: function (text) {
//             /* ... */
//             if (typeof text === "number" && text !== Math.floor(text)) {
//                 return (isValid = true);
//             } else {
//                 isValid = false;
//             }
//         },
//         isNegativeInteger: function (text) {
//             /* ... */
//             if (
//                 typeof text === "number" &&
//                 text === Math.floor(text) &&
//                 text < 0
//             ) {
//                 return (isValid = true);
//             } else {
//                 isValid = false;
//             }
//         },
//         isPositiveInteger: function (text) {
//             /* ... */
//             if (
//                 typeof text === "number" &&
//                 text === Math.floor(text) &&
//                 text > 0
//             ) {
//                 document.getElementById("validation").innerHTML +=
//                     "This is a positive integer";
//                 return (isValid = true);
//             } else {
//                 document.getElementById("validation").innerHTML +=
//                     "This is a NOT positive integer";
//                 isValid = false;
//             }
//         },
//         isNonNegativeInteger: function (text) {
//             /* ... */
//             if (
//                 typeof text === "number" &&
//                 text === Math.floor(text) &&
//                 text >= 0
//             ) {
//                 return (isValid = true);
//             } else {
//                 isValid = false;
//             }
//         },
//         isInRange: function (text, m, n) {
//             /* ... */
//             if (typeof text !== "number") {
//                 isValid = false;
//                 return;
//             }
//             if (m && n && m < n && text >= m && text <= n) {
//                 return (isValid = true);
//             }

//             if (m && !n && text >= m) {
//                 return (isValid = true);
//             } else {
//                 isValid = false;
//             }
//         },
//         isValidEmail: function (text) {
//             /* ... */
//             let emailFormat =
//                 /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
//             if (text.match(emailFormat)) {
//                 return (isValid = true);
//             } else {
//                 document.getElementById("validation").innerHTML +=
//                     "This is a NOT a valid email";
//                 isValid = false;
//             }
//         },
//         isNonEmpty: function (text) {
//             /* ... */
//             if (!text) {
//                 document.getElementById("validation").innerHTML +=
//                     "This value is blank";
//                 isValid = false;
//             }
//         },
//         matchesRegex: function (text, regex) {
//             /* ... */

//             let regexFormat = regex;

//             if (text.match(regexFormat)) {
//                 return (isValid = true);
//             } else {
//                 isValid = false;
//             }
//         },
//         lengthIsInRange: function (text, m, n) {
//             /* ... */
//             if (typeof text !== "string") {
//                 isValid = false;
//                 return;
//             }
//             if (m && n && m < n && text.length >= m && text.length <= n) {
//                 return (isValid = true);
//             }

//             if (m && !n && text.length >= m) {
//                 return (isValid = true);
//             } else {
//                 isValid = false;
//             }
//         },
//         isValid: function () {
//             /* ... */
//             return isValid;
//         },
//         reset: function () {
//             /* ... */
//             isValid = true;
//         },
//     };
// })();
