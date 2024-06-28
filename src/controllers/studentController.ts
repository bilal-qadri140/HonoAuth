import { HTTPException } from "hono/http-exception";
import client from "../models/dbConfig";
import { Context, Next } from 'hono'
type StudentData = {
    name: string
    roll_no: number
    email: string
    user_id: number
}


// export const addStudent = async (data: StudentData, c: Context) => {
//     try {
//         const { name, email, roll_no, user_id } = data
//         await client.query('insert into students (name,roll_no, email,user_id) values ($1,$2,$3,$4)', [name, roll_no, email, user_id])
//     } catch (e: any) {
//         console.log("Errrrrrr:", e.code);
//         if (e.code == '23505') {
//             return c.json({ error:'23505'})
//         }
//         throw new HTTPException(409, { message: 'Record already exists' })
//     }
// }

export const addStudent = async (data: StudentData, c: Context) => {
    const { name, email, roll_no, user_id } = data;

    try {
        const result = await client.query(
            'INSERT INTO students (name, roll_no, email, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, roll_no, email, user_id]
        );

        // Log the inserted record
        console.log('Inserted student record:', result.rows[0]);

        // Return a success response with the inserted data
        c.status(201);
        return c.json({
            message: 'Student added successfully',
            student: result.rows[0]
        });

    } catch (error:any) {
        console.error('Error inserting student record:', error);

        // Determine if the error is due to a conflict (duplicate record)
        if (error.code === '23505') { // 23505 is a PostgreSQL error code for unique violations
            c.status(409);
            return c.json({
                message: 'Student record already exists'
            });
        }

        // Handle other types of errors
        c.status(500);
        return c.json({
            message: 'Internal Server Error'
        });
    }
};


export const getAllStudents = async () => {
    try {
        const res = await client.query('SELECT * FROM students');
        return res.rows;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw new Error('Failed to fetch students');
    }
};

export const updateStudent = async (data: StudentData) => {
    const { roll_no, name, email } = data
    await client.query(`
        update students 
        set name = $2, email = $3
        where roll_no = $1    
    `, [roll_no, name, email])
}

export const deleteStudent = (roll_no: number) => {
    client.query("delete from students where roll_no = $1", [roll_no])
}
