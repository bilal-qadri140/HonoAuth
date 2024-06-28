import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { addStudent, getAllStudents } from './controllers/studentController'
import { addTeacher, getAllTeachers } from './controllers/teacherControler'
import { createUser, findUser } from './controllers/userController'
import { createStudentAuth, userToken } from './middlewares/auth/studentAuth'
import { createTeacherAuth, getTeacherAuth } from './middlewares/auth/teacherAuth'
import bcrypt from "bcrypt";

const app = new Hono()



app.post('/create-account', async (c) => {
  const { id, username, email, password, roles } = await c.req.json()
  const newUser = {
    id, username, email, roles,
    password: await bcrypt.hash(password.toString(), 10),
  }
  const res = await createUser(newUser)
  if (!res) {
    return c.status(500)
  } else {
    c.status(201)
    return c.json(newUser)
  }
})

app.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    // console.log("original password: ", password);
    // console.log("hashed password: ", await bcrypt.hash(password.toString(), 10));

    const user = await findUser(username, password)
    console.log("user in main: ", user);

    if (!user) {
      c.status(404)
      throw new Error("User not found")
    }
    else {
      const token = userToken(user)
      c.status(200)
      return c.json({ user, token })
    }
  } catch (error) {
    console.log(error);
  }
})


app.post('/students', createStudentAuth, async (c) => {
  try {
    const { name, roll_no, email, user_id } = await c.req.json();
    if (!name || !roll_no || !email || !user_id) {
      c.status(400);
      return c.json({ message: 'All fields are required: name, roll_no, email, user_id' });
    }
    const newStudent = { name, roll_no, email, user_id };
    const response = await addStudent(newStudent, c);
    if (response.status === 404)
      return c.json({
        message: 'User Already exist!!'
      })

  } catch (error) {
    console.error('Error handling /students request:', error);
    c.status(500);
    return c.json({ message: 'Internal Server Error' });
  }
});

// All logged in users can view students
app.get('/students', async (c) => {
  const students = await getAllStudents()
  return c.json(students, 200)
})

// only admin can add teachers
app.post('/teachers', createTeacherAuth, async (c) => {
  const { name, email, teacher_id, user_id } = await c.req.json()
  const newTeacher = {
    name, email, teacher_id, user_id
  }
  const res = await addTeacher(newTeacher)
  if (!res) {
    return c.status(500)
  }
  else {
    return c.json(newTeacher, 201)
  }
})

// only teachers and admin can see the teachers
app.get('/teachers', getTeacherAuth, async (c) => {
  const teachers = await getAllTeachers()
  return c.json(teachers)
})




const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
