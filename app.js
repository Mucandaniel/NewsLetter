const express = require("express");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const dotenv = require("dotenv").config();
const app = express();

app.use(express.urlencoded({ extended: true }));

//Allows the server to access local files, like css and images etc.
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER,
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const run = async () => {
    const response = await mailchimp.lists
      .addListMember(process.env.LIST_ID, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      })
      .then(
        (value) => {
          console.log("Successfully added contact as an audience member.");
          res.sendFile(__dirname + "/success.html");
        },
        (reason) => {
          res.sendFile(__dirname + "/failure.html");
        }
      );

    console.log(response);
  };

  run();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server has started at port 3000");
});
