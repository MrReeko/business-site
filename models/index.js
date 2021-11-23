require('dotenv').config();
const fs = require('fs');
const {authorize} = require('./gmailAuth.js');
const {google} = require('googleapis');
const makeEmail = require('./emailTemplate.js');
var path = process.env.key_path

function getClient() {
  try {
    // content = fs.readFileSync(__dirname + path)
    var content = process.env.keyFile
  } catch(err) {
    return console.log('Error loading client secret file:', err);
  }
  // Authorize a client with credentials
  var client = authorize(content);
  return client;
}

async function sendMail(formObj) {
  console.log('sending mail...');
  console.log(formObj);
  // Remove ` before running
  formObj.name = formObj['name'].replace(/`/g, '');
  formObj.email = formObj['email'].replace(/`/g, '');
  formObj.phone = formObj['phone'].replace(/`/g, '');
  formObj.message = formObj['message'].replace(/`/g, '');

  var auth = getClient();
  const gmail = google.gmail({version: 'v1', auth});
  subject = `New Lead Submission: ${formObj.name}`;
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    'From: Steven Trager <steventrager1996@gmail.com>',
    'To: Steven Trager <steventrager1996@gmail.com>',
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    makeEmail(formObj)
  ];
  const message = messageParts.join('\n');
  const encodedMessage = Buffer.from(message)
  .toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');
  try {
    console.log('Making request to gmail...')
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log('Response from gmail: ')
    console.log(res);
    return res.data;
  } catch(err) {
    console.log('An Error occurred sending email...')
    console.log(err);
    throw new Error(err);
  }
}

module.exports.sendMail = sendMail;