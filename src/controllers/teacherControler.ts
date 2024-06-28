import client from "../models/dbConfig";


type TeacherData = {
    name: string
    teacher_id: number
    email: string
    user_id:number
}


export const addTeacher = async (data: TeacherData) => {
    const { name, email, teacher_id,user_id} = data
    return await client.query('insert into teachers (name,teacher_id, email,user_id) values ($1,$2,$3,$4)', [name, teacher_id, email,user_id])
}

export const getAllTeachers = async () => {
    const res = await client.query("select * from teachers")
    return res.rows
}

export const updateTeacher = async (data: TeacherData) => {
    const { teacher_id, name, email } = data
    await client.query(`
        update students 
        set name = $2, email = $3
        where roll_no = $1    
    `, [teacher_id, name, email])
}

export const deleteTeacher = (teacher_id: number) => {
    client.query("delete from teachers where teacher_id = $1", [teacher_id])
}
