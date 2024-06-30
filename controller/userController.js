import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { client } from "../db/config.js";

dotenv.config();

const create_username=(email,name)=>{

  return name.slice(0,4)+email.slice(0,5);

}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);

    const result = await client.query('SELECT * FROM user_login WHERE email = $1', [email]);
    const user = result.rows[0];
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: "No User exists" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwords);
    console.log("asdnfk",isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect Password" });
    }

    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Register User
const register = async (req, res) => {
 

  try {
    const { email, password, name } = req.body;
    console.log(email, password, name);

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let username = create_username(name, email);

    await client.query('BEGIN'); // Start transaction

    const userExist = await client.query('SELECT * FROM user_login WHERE email = $1', [email]);

    if (userExist.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      const result = await client.query(
        'INSERT INTO user_login (email, passwords, user_name) VALUES ($1, $2, $3) RETURNING *',
        [email, hashedPassword, username]
      );

      const user = result.rows[0];
      const { user_id } = user;

      await client.query(
        'INSERT INTO user_info (user_id, firstname) VALUES ($1, $2)',
        [user_id, name]
      );

      await client.query('COMMIT'); // Commit transaction

      const token = jwt.sign({ userId: user_id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({ message: "User registration successful", token: token });
    } else {
      await client.query('ROLLBACK'); // Rollback transaction if user exists
      return res.status(400).json({ message: "User already exists" });
    }
  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  } 
};
const userInfo = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const query = `
      SELECT firstname, lastname, bio
      FROM user_info
      WHERE user_id = $1;
    `;
    
    const result = await client.query(query, [user_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export { login, register,userInfo };
