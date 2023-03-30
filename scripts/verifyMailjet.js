require('dotenv').config({ path: __dirname+'/../.env'});

const mailjet = require ('node-mailjet')
  .connect(process.env.MAILJET_API, process.env.MAILJET_SECRET)

  const request = mailjet
  .post("send", {'version': 'v3.1'})
  .request({
    "Messages":[
      {
        "From": {
          "Email": "rajeev@loyalytics.in",
          "Name": "Rajeev"
        },
        "To": [
          {
            "Email": "rajeev@loyalytics.in",
            "Name": "Rajeev"
          }
        ],
        "Subject": "Greetings from Mailjet.",
        "TextPart": "My first Mailjet email",
        "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
        "CustomID": "AppGettingStartedTest"
      }
    ]
  })
  request
    .then((result) => {
      console.log(result.body)
    })
    .catch((err) => {
      console.log(err.statusCode)
    })