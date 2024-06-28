import { log } from "console";
import client from "../models/dbConfig";
import bcrypt from "bcrypt";
type UserType = {
    id: number
    username: string
    email: string
    password: string
    roles: string
}



export const createUser = async (data: UserType) => {
    const { id, username, email, password, roles } = data
   

    try {
        return await client.query('insert into users (id, username,email,password,roles) values($1,$2,$3,$4,$5)', [id, username, email, password, roles])
    } catch (error) {
        console.log("Error in query to add student: ", error);
    }
}

export const findUser = async (username: string, password: string) => {
    try {
        const queryText = 'SELECT * FROM users WHERE username = $1';
        const res = await client.query(queryText, [username]);

        if (res.rows.length === 0) {
            throw new Error('User not found');
        }
        
        const user: UserType = res.rows[0];
        console.log(user);
        console.log(typeof user.password);
        

        if (typeof user.password !== 'string') {
            throw new Error('Invalid password format in database');
        }

        console.log("Hello up");
        console.log("Password: ",password);
        console.log("User Password: ",user.password)
        
        const passwordMatch = await bcrypt.compare(password.toString(), user.password);
        console.log("Hello down");
        
        if (passwordMatch) {
            console.log("password: ",password);
            
            return user;
        } else {
            return null;
        }
    } catch (err) {
        console.log("Error message: ",err);
        throw new Error('Error logging in user');
    }
};