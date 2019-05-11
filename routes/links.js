// const express = require('express');
// const sha1 = require('sha1');
// const Joi = require('@hapi/joi');
// const bodyParser = require('body-parser');
// const router = express.Router();
//
// let linksMap = require('routes/links').linksMap;
//
// router.route('/links')
//     .post((request, response) => {
//         const {url} = request.body;
//         const hashUrl = sha1(url);
//         const {error} = uriValidation(request.body);
//         if (error) {
//             errors.push({text: error.details[0].message});
//             console.log(`Error=${error.details[0].message}`);
//             return response.status(400).send(error.details[0].message)
//             // return response.status(400).redirect(homeUrl)
//             //  return response.render('v1', {
//             //      errors,
//             //      url
//             //  });
//         }
//         if (linksMap.has(hashUrl)) { // The url is already in the DB
//             response.redirect('v1');
//             console.log(`The url '${url}' is already exists in the DB`);
//             console.log(linksMap); // TODO
//             // return response.redirect(homeUrl);
//             return response.status(200).send({
//                 hash: hashUrl
//             });
//         } else {    // new url
//             linksMap.set(hashUrl, url);
//             console.log(`Creating short url to '${url}' succeeded`);
//             console.log(linksMap); // TODO
//             return response.status(200).send({
//                 hash: hashUrl
//             });
//             // return response.redirect(homeUrl);
//         }
//     })
//     .put((request, response) => {
//         const {error} = uriValidation(request.body);
//         if (error) {
//             console.log(`Error=${error.details[0].message}`);
//             return response.status(400).send(error.details[0].message)
//         }
//
//         const linkToCheck = request.body.url;
//         const hashUrl = sha1(linkToCheck);
//         if (!linksMap.has(hashUrl)) {
//             console.log(`404 Not Found, The URL '${linkToCheck}' is undefined`);
//             return response.status(404).send(`The URL '${linkToCheck}' is undefined`)
//         }
//         linksMap.set(hashUrl, linkToCheck);
//         response.status(200).send({
//             hash: hashUrl
//         });
//         console.log(`creating short url to '${linkToCheck}' succeeded`);
//         console.log(linksMap); // TODO
//     });
