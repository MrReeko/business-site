function makeEmail(formObj) {
    var template = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="./email.css">
    </head>
    <body>
        <div class="container">
            <h3>New Lead:</h3>
            <ul>
                <li>Name: ${formObj.name}</li>
                <li>Email: ${formObj.email}</li>
                <li>Phone: ${formObj.phone}</li>
            </ul>
            <h3>Message</h3>
            <p>${formObj.message}</p>
        </div>
    </body>
    </html>`
    return template;
}

module.exports = makeEmail;