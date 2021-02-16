if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { EMAIL_PASS } = process.env;
const express = require("express");
const router = express.Router();
const Users = require("./../models/users");
const Article = require("./../models/models");
const Subscriber = require("./../models/subscribers");
const formatDate = require("./../public/js/dateFormatting");
const { body, validationResult } = require("express-validator");
const nodeMailer = require("nodemailer");

// LOGGED
router.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").not().isEmpty().trim().escape(),
  (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return console.log(errors);
    }

    // Rest of code
    const { email, password } = req.body;
    Users.findOne({ email, password })
      .exec()
      .then((user) => {
        console.log(`.post("/login") - ${user._id}\n`);
        req.session.userId = user._id;
        req.session.save(res.redirect("/"));
      })
      .catch((err) => {
        console.log(err);
        const error = "The user you tried to login as does not exist!";
        console.log(error);
        return res.send(error);
      });
  }
);

router.post("/logout", (req, res) => {
  console.log(`post.("/logout") - ${req.session.userId}`);
  req.session.destroy();
  return res.redirect("/");
});
//END OF LOGGED

router.get("/", (req, res) => {
  Article.find({})
    .exec()
    .then((oldArticleObj) => {
      const newArticleObj = {
        articles: oldArticleObj.map((data) => {
          const { _id, title, content, tags } = data;
          return {
            _id,
            title,
            content,
            tags,
            dateCreated: formatDate(data.dateCreated),
          };
        }),
      };
      // return res.render("home", { articles: newArticleObj.articles });
      Article.find({})
        .exec()
        .then((result) => {
          let tagsArr = [];
          result.forEach((el) => {
            let tags = el.tags;
            tags.forEach((tag) => {
              if (!tagsArr.includes(tag.trim())) {
                tagsArr.push(tag.trim());
              }
            });
          });

          // Login Verification
          let logged;
          const pageTitle = "Home Page";
          if (!req.session.userId) {
            console.log("req.session.userId when NOT logged in is:");
            console.log(req.session.userId);
            logged = false;
            return res.render("home", {
              logged,
              pageTitle: pageTitle,
              articles: newArticleObj.articles,
              tags: tagsArr,
            });
          } else if (req.session.userId) {
            console.log("req.session.userId when logged in is:");
            console.log(req.session.userId);
            logged = true;
            return res.render("home", {
              logged,
              pageTitle: pageTitle,
              articles: newArticleObj.articles,
              tags: tagsArr,
            });
          }
        });
      // End of Login Verification
    })
    .catch((err) => console.log(err));
});

router.get("/article/:_id", (req, res) => {
  Article.findOne({ _id: req.params._id })
    .exec()
    .then((oldArticleObj) => {
      const { _id, title, content, tags } = oldArticleObj;
      const newArticleObj = {
        _id,
        title,
        content,
        tags,
        dateCreated: formatDate(oldArticleObj.dateCreated),
      };

      Article.find({})
        .exec()
        .then((result) => {
          let tagsArr = [];
          result.forEach((el) => {
            let tags = el.tags;
            tags.forEach((tag) => {
              if (!tagsArr.includes(tag.trim())) {
                tagsArr.push(tag.trim());
              }
            });
          });
          // Login Verification
          let logged;
          const pageTitle = "Article Page";
          const articlePage = true;
          if (!req.session.userId) {
            console.log("req.session.userId when NOT logged in is:");
            console.log(req.session.userId);
            logged = false;
            return res.render("article", {
              logged,
              pageTitle: pageTitle,
              article: newArticleObj,
              tags: tagsArr,
              articlePage,
            });
          } else if (req.session.userId) {
            console.log("req.session.userId when logged in is:");
            console.log(req.session.userId);
            logged = true;
            return res.render("article", {
              logged,
              pageTitle: pageTitle,
              article: newArticleObj,
              tags: tagsArr,
              articlePage,
            });
          }
        });
      // End of Login Verification
    })
    .catch((err) => console.log(err));
});

router.post("/post-article", (req, res) => {
  const { title, content } = req.body;
  let tags = req.body.tags.split(",");
  tags = tags.map((tag) => tag.trim().toLowerCase());
  const article = new Article({
    title,
    content,
    tags,
  });
  article
    .save()
    .then((result) => {
      Subscriber.find({})
        .exec()
        .then((subscribers) => {
          let mailTransporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
              user: "test4ccount4js@gmail.com",
              pass: EMAIL_PASS, // Put this in environment variables
            },
          });

          let emails = [];
          subscribers.forEach((subscriber) => {
            emails.push(subscriber.email);
          });

          let mailDetails = {
            from: "test4ccount4js@gmail.com",
            to: emails,
            subject: "Test mail",
            text: "This is a test email",
          };

          mailTransporter.sendMail(mailDetails, (err, data) => {
            if (err) {
              console.log("Error Occurs");
            } else {
              console.log("Email sent successfully");
            }
          });

          console.log(result);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
  return res.redirect("/");
});

router.patch("/editArticle/:_id", (req, res) => {
  const { title, content } = req.body;
  let tags = req.body.tags.split(",");
  tags = tags.map((tag) => tag.trim().toLowerCase());
  Article.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    {
      title,
      content,
      tags,
    },
    (err) => {
      if (err) console.log(err);
    }
  );
  console.log(`Updated article with id: ${req.params._id}`);
  return res.redirect("/");
});

router.delete("/delete-article/:_id", (req, res) => {
  Article.deleteOne({ _id: req.params._id }, (err) => {
    if (err) console.log(err);
  });
  return res.redirect("/");
});

router.get("/search-articles/:tag", (req, res) => {
  Article.find({ tags: req.params.tag })
    .exec()
    .then((oldArticleObj) => {
      const newArticleObj = {
        articles: oldArticleObj.map((data) => {
          const { _id, title, content, tags } = data;
          return {
            _id,
            title,
            content,
            tags,
            dateCreated: formatDate(data.dateCreated),
          };
        }),
      };
      // return res.render("home", { articles: newArticleObj.articles });
      Article.find({})
        .exec()
        .then((result) => {
          let tagsArr = [];
          result.forEach((el) => {
            let tags = el.tags;
            tags.forEach((tag) => {
              if (!tagsArr.includes(tag.trim())) {
                tagsArr.push(tag.trim());
              }
            });
          });
          // Article.find({})
          //   .exec()
          //   .then((result) => {
          //     let tagsArr = [];
          //     result.forEach((el) => {
          //       let tags = el.tags.split(",");
          //       tags.forEach((tag) => {
          //         if (!tagsArr.includes(tag.trim())) {
          //           tagsArr.push(tag.trim());
          //         }
          //       });
          //     });

          // Login Verification
          let logged;
          const pageTitle = "Home Page";
          if (!req.session.userId) {
            console.log("req.session.userId when NOT logged in is:");
            console.log(req.session.userId);
            logged = false;
            return res.render("home", {
              logged,
              pageTitle: pageTitle,
              articles: newArticleObj.articles,
              tags: tagsArr,
            });
          } else if (req.session.userId) {
            console.log("req.session.userId when logged in is:");
            console.log(req.session.userId);
            logged = true;
            return res.render("home", {
              logged,
              pageTitle: pageTitle,
              articles: newArticleObj.articles,
              tags: tagsArr,
            });
          }
        });
      // End of Login Verification
    })
    .catch((err) => console.log(err));
});

router.post(
  "/subscribe",
  // body("name").not().isEmpty().trim().escape(),
  body("email").isEmail().normalizeEmail(),
  (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return console.log(errors);
    }

    // const { name, email } = req.body;
    const { email } = req.body;

    Subscriber.findOne({ email })
      .exec()
      .then((user) => {
        if (!user) {
          const subscriber = new Subscriber({
            // name,
            email,
          });
          subscriber
            .save()
            .then((result) => {
              console.log(result);
            })
            .catch((err) => console.log(err));
          return res.redirect("/");
        } else {
          console.log(
            `The email you entered (${email}) is already subscribed to this blog.`
          );
          res.redirect("/");
        }
      })
      .catch((err) => {
        console.log(err);
        const error = "The user you tried to login as does not exist!";
        console.log(error);
        return res.send(error);
      });
  }
);

router.get("/*", (req, res) => {
  res.send("404 There is nothing here");
});

module.exports = router;
