const express = require('express');
const sha1 = require('sha1');
const Joi = require('@hapi/joi');
const router = express.Router();

const {PORT = 8888} = process.env; // use default port 8888 or use the Port that was set
const currentVersion = 'v1';

let linksMap = new Map(); // inner-cash instead of DB
let homeUrl = `http://localhost:${PORT}/${currentVersion}`;
let errors = [];

router.route('/links')
    .post((request, response) => {
        const {url} = request.body;
        const hashUrl = sha1(url);
        const {error} = uriValidation(request.body);
        if (error) {
            errors.push({text: error.details[0].message});
            console.log(`Error=${error.details[0].message}`);
            return response.status(400).send(error.details[0].message)
            // return response.status(400).redirect(homeUrl)
            //  return response.render('v1', {
            //      errors,
            //      url
            //  });
        }
        if (linksMap.has(hashUrl)) { // The url is already in the DB
            response.redirect('/');
            console.log(`The url '${url}' is already exists in the DB`);
            console.log(linksMap); // instead of log
           // return response.redirect(homeUrl);
            return response.status(200).send({
                hash: hashUrl
            });
        } else {    // new url
            linksMap.set(hashUrl, url);
            console.log(`Creating short url to '${url}' succeeded`);
            console.log(linksMap); // TODO
            return response.status(200).send({
                hash: hashUrl
            });
            // return response.redirect(homeUrl);
        }
    })
    .put((request, response) => {
        const {error} = uriValidation(request.body);
        if (error) {
            console.log(`Error=${error.details[0].message}`);
            return response.status(400).send(error.details[0].message)
        }

        const linkToCheck = request.body.url;
        const hashUrl = sha1(linkToCheck);
        if (!linksMap.has(hashUrl)) {
            console.log(`404 Not Found, The URL '${linkToCheck}' is undefined`);
            return response.status(404).send(`The URL '${linkToCheck}' is undefined`)
        }
        linksMap.set(hashUrl, linkToCheck);
        response.status(200).send({
            hash: hashUrl
        });
        console.log(`creating short url to '${linkToCheck}' succeeded`);
        console.log(linksMap); // TODO
    });

router.route('/short_link_hash')
    .get((request, response) => {
        const linkToCheck = request.query.short_link_hash;
        if (linksMap.has(linkToCheck)) {
            let linkToRedirect = linksMap.get(linkToCheck);
            console.log(`Redirect to '${linkToRedirect}'...`);
            response.redirect(linkToRedirect);
        } else {
            console.log(`404 Not Found, The URL '${linkToCheck}' is undefined`);
            return response.status(404).send(`The URL '${linkToCheck}' is undefined`);
        }
    })
    .post((request, response) => {
        let linkToCheck = request.body.short_link_hash;
        if (linksMap.has(linkToCheck)) {
            linksMap.delete(linkToCheck);
            console.log(`The short url '${linkToCheck}' deleted`);
            response.status(200).send({
                hash: linkToCheck
            });
        } else {
            console.log(`404 Not Found, The short url '${linkToCheck}' is undefined`);
            return response.status(404).send(`The short url '${linkToCheck}' is undefined`);
        }
    });

router.route('/map')
    .get((request, response) => {
        response.status(200).send(linksMap)
    });

router.route('/')
    .get((request, response) => {
            response.render('v1', {})
        }
    );

/**
 * must be a string
 * minimum length should be more then 6 (http://) max to 200 for security consideration
 * must start with http or https
 * must be valid uri
 * @see https://www.npmjs.com/package/@hapi/joi
 * @see https://tools.ietf.org/html/rfc3986
 * @param data the data to validate
 * @returns {*} the validation result
 */
function uriValidation(data) {
    const schema = {
        url: Joi.string().uri().min(6).max(200).required()
    };
    return Joi.validate(data, schema)
}

module.exports = router;