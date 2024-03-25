const db = require("../dbConnect");
const bcrypt = require('bcrypt');

const getUserByEmail = async (email, password) => {
  try {
    const sql = 'SELECT * FROM `users` WHERE `email` = ?';
    const values = [email];
    let user = null;
  
    const [ rows ] = await db.connection.execute(sql, values);

    if (rows.length !== 0){
      const result = await bcrypt.compare(password, rows[0].password);
      if (result === true) {
          user = {
            userID: rows[0]["user_id"],
            name: rows[0]["full_name"],
            email: rows[0]["email"],
            role: rows[0]["role"],
            socialType: rows[0]["socialType"],
            socialID: rows[0]["socialID"]
          }
      }};
    return user;
  } catch (err){
    console.log(err);
  }
};

const getUserById = async (user_id) => {
  try {
    const sql = 'SELECT * FROM `users` WHERE `user_id` = ?';
    const values = [user_id];
    let user = null;
  
    const [rows] = await db.connection.execute(sql, values);

    if (rows.length !== 0){
      user = {
        userID: rows[0]["user_id"],
        name: rows[0]["full_name"],
        email: rows[0]["email"],
        role: rows[0]["role"],
        socialType: rows[0]["socialType"],
        socialID: rows[0]["socialID"]
      }
    }
    return user;
  } catch (err){
    console.log(err);
  }
};

const getUserBySocialId = async (provider, id) => {
  try {
    const sql = 'SELECT * FROM `users` WHERE `socialType` = ? AND `socialID` = ?';
    const values = [provider, id];
    let user = null;
  
    const [rows] = await db.connection.execute(sql, values);

    if (rows.length !== 0){
      user = {
        userID: rows[0]["user_id"],
        name: rows[0]["full_name"],
        email: rows[0]["email"],
        role: rows[0]["role"],
        socialType: rows[0]["socialType"],
        socialID: rows[0]["socialID"]
      }
    }
    return user;

  } catch (err){
    console.log(err);
  }
};

module.exports = {
  getUserByEmail,
  getUserById,
  getUserBySocialId,
};
