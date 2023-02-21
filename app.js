const express = require("express");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(express.urlencoded({ extended: true }));

//Allows the server to access local files, like css and images etc.
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: "77e4510ff43999509dd3b1f7edd70379-us21",
  server: "us21",
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
      .addListMember("46a1d5a71dx", {
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

// API key from Mailchimp
// 77e4510ff43999509dd3b1f7edd70379-us21

//list ID from Mailchimp
// 46a1d5a71d
