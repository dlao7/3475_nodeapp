const db = require("../dbConnect");
const fs = require("fs");

const reminderModel = {
  findReminders: async (id) => {
    try {
      const sql = 'SELECT * FROM `reminders` WHERE `fk_user_id` = ?';
      const values = [id];
      let reminders = [];
    
      const [ rows ] = await db.connection.execute(sql, values);
      
      if (rows.length !== 0){
        reminders = rows;
      }

      return reminders;
    } catch (err){
      console.log(err);
      } 
    },

  updateReminder: async (info) => {
    try {
      const sql = 'UPDATE `reminders` SET `title` = ?, `description` = ?, `completion` = ?, `cover` = ?  WHERE `fk_user_id` = ? and `rem_id` = ?';
      const values = [ info.title, info.description, info.completion, info.cover, info.fk_user_id, info.rem_id ];

      const [ result ] = await db.connection.execute(sql, values);

      } catch (err){
        console.log(err);
        } 

  },   
  deleteReminder: async (user_id, rem_id) => {
    try {
      let reminderToFind = rem_id;
      let userData = await reminderModel.findReminders(user_id);

      let searchResult = userData.find((reminder) => {
        return reminder.rem_id == reminderToFind;
      });

      if (searchResult.cover){
	     if (!searchResult.cover.includes("unsplash")){
        	fs.rm(`./public/${searchResult.cover}`, { force: true }, (err) => { 
          	if(err){ 
              	// File deletion failed 
              	   console.error(err.message); 
               return; 
               }
             })
      }}

      const sql = 'DELETE FROM `reminders` WHERE `fk_user_id` = ? and `rem_id` = ?';
      const values = [ user_id, rem_id ];

      const [ result ] = await db.connection.execute(sql, values);

      } catch (err){
        console.log(err);
      } 
  },
  createReminder: async (newRem) => {
    try {
      const sql = 'INSERT INTO `reminders` (title, description, completion, cover, fk_user_id) VALUES (?, ?, ?, ?, ?)'
      const values = [ newRem.title, newRem.description, newRem.completion, newRem.cover, newRem.fk_user_id ];

      const [ result ] = await db.connection.execute(sql, values);

      } catch (err){
        console.log(err);
      } 
  }
}

module.exports = { reminderModel };
