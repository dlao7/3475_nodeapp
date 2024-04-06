const db = require("../dbConnect");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userModel = {
  createNewUser: async (profile, option) => {
    let userEntry;

    if (option === "social"){
      try {
        const sql = 'SELECT * FROM `users` WHERE `email` = ?';
        const values = [ profile.profileUrl ];
  
        const [ rows ] = await db.connection.execute(sql, values);
  
        if (rows.length !== 0){
          return null
        }
      } catch (err){
        console.log(err);
      } 

      userEntry = { 
        name: profile.displayName, 
        email: profile.profileUrl,
        password: null,
        role: "user",
        socialType: profile.provider,
        socialID: profile.id,
      }
    } else if (option === "default"){

      try {
        const sql = 'SELECT * FROM `users` WHERE `email` = ?';
        const values = [ profile.email ];
  
        const [ rows ] = await db.connection.execute(sql, values);
  
        if (rows.length !== 0){
          return null
        }
      } catch (err){
        console.log(err);
      } 

      userEntry = { 
        name: profile.name, 
        email: profile.email,
        password: profile.password,
        role: "user",
        socialType: null,
        socialID: null
     }
    }

    try {
      let hashPass;
      if (option === "default") {
        hashPass = await bcrypt.hash(userEntry.password, saltRounds); 
      } else {
        hashPass = null;
      }

      const sql = 'INSERT INTO `users` (full_name, email, password, role, socialType, socialID ) VALUES (?, ?, ?, ?, ?, ?)'
      const values = [ userEntry.name, userEntry.email, hashPass, userEntry.role, userEntry.socialType, userEntry.socialID ];

      const [ result ] = await db.connection.execute(sql, values);

      const sql2 = 'SELECT * FROM `users` WHERE `email` = ?';
      const values2 = [ userEntry.email ];

      const [ selectResult ] = await db.connection.execute(sql2, values2);

      return selectResult;
    } catch (err){
      console.log(err);
    } 
  },
  addDefault: async (userID) => {
    const sql = 'INSERT INTO `reminders` (title, description, completion, cover, fk_user_id ) VALUES (?, ?, ?, ?, ?)'
    const values = [ "Sample: Buy Groceries", "Buy milk and cookies", 0, null, userID ];

    const [ reminderResult ] = await db.connection.execute(sql, values);
  }
};



module.exports = { userModel };
