const reminderModel = require("../models/reminderModel").reminderModel;
const devID = require("../devIDs");
const fs = require("fs");

let remindersController = {
  list: async (req, res) => {
    let userData = await reminderModel.findReminders(req.user.userID);

    res.render("reminder/index", { reminders: userData });
 
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: async (req, res) => {
    let reminderToFind = req.params.id;
    let userData = await reminderModel.findReminders(req.user.userID);

    let searchResult = userData.find((reminder) => {
      return reminder.rem_id == reminderToFind;
    });

    if (searchResult !== undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: userData });
    }
  },

  create: async (req, res, next) => {
    if (req.body.completed === "true"){
      remStatus = 1
    } else {
      remStatus = 0
    }

    let newReminder = {
      title: req.body.title,
      description: req.body.description,
      completion: remStatus,
      cover: null,
      fk_user_id: req.user.userID
    };

    if (req.file) {
      newReminder.cover = req.file.path.slice(6)
    } else if (req.body.rand_cover){
      random_url = `https://api.unsplash.com/photos/random?client_id=${devID.unsplashID}`
      const response = await fetch(random_url);
      const data = await response.json();
      newReminder.cover = data.urls.thumb;
    }

    await reminderModel.createReminder(newReminder);

    res.redirect("/reminders");
  },

  edit: async (req, res) => {
    let reminderToFind = req.params.id;
    let userData = await reminderModel.findReminders(req.user.userID);

    let searchResult = userData.find((reminder) => {
      return reminder.rem_id == reminderToFind;
    });

    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: async (req, res) => {
    let reminderToFind = req.params.id;
    // get all reminders of this user
    let userData = await reminderModel.findReminders(req.user.userID);

    // get the reminder that corresponds to rem_id
    let remIndex = userData.findIndex((rem => rem.rem_id == reminderToFind));
    thisReminder = userData[remIndex];

    // set boolean in description as 1 if the status of the radio button was true.
    if (req.body.completed === "true"){
      remStatus = 1
    } else {
      remStatus = 0
    }

    let updatedReminder = {
      rem_id: parseInt(reminderToFind),
      title: req.body.title,
      description: req.body.description,
      completion: remStatus,
      cover: thisReminder.cover,
      fk_user_id: thisReminder.fk_user_id
    };

    // Can upload a photo, choose a random photo, or remove the photo
    if (req.file) {
      updatedReminder.cover = req.file.path.slice(6)
    } else if (req.body.rand_cover){
      random_url = `https://api.unsplash.com/photos/random?client_id=${devID.unsplashID}`
      const response = await fetch(random_url);
      const data = await response.json();
      updatedReminder.cover = data.urls.thumb;
    } else if (req.body.remove){
      // delete the image from the folder
      if (!thisReminder.cover.includes("unsplash")){
        fs.rm(`./public/${thisReminder.cover}`, { force: true }, (err) => { 
          if(err){ 
              // File deletion failed 
              console.error(err.message); 
              return; 
          }})
      }
      updatedReminder.cover = null;
    } 

    // update the entry
    await reminderModel.updateReminder(updatedReminder);

    // Redirect to main reminders page.
    res.redirect("/reminders");
  },

  delete: async (req, res) => {
    await reminderModel.deleteReminder(req.user.userID, req.params.id)

    // if entry has cover image in the folder, delete it

    // Redirect to main reminders page.
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
