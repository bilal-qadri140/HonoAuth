import jwt, { JwtPayload } from 'jsonwebtoken'
import { Context, Next } from 'hono'


type UserType = {
    id: number
    username: string
    email: string
    password: string
    roles: string
}
interface CustomJwtPayload extends JwtPayload {
    role?: string;
}

// generate jwt token for login user
export const userToken = (user: UserType) => {
    const token = jwt.sign({ username: user.username, password: user.password, role: user.roles }, 'bilal')
    console.log(token);
    return token
}

// create new users authentication and authorization
export const createTeacherAuth = async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader) {
        c.res.headers.append('Content-Type', 'text/plain')
        return c.text('Unauthorized!, Please login as "admin" to add new Teacher', 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, 'bilal') as CustomJwtPayload;

        const { role } = payload;

        if (role === 'admin') {
            return await next();
        } else {
            c.res.headers.append('Content-Type', 'text/plain')
            return c.text('Forbidden', 403);
        }
    } catch (error) {
        console.log("Error is: ", error);
        c.res.headers.append('Content-Type', 'text/plain')
        return c.text('Unauthorized', 401);
    }
}


export const getTeacherAuth =async (c:Context, next: Next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader) {
        c.res.headers.append('Content-Type', 'text/plain')
        return c.text('Unauthorized!, Please login before see Teachers.', 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, 'bilal') as CustomJwtPayload;

        const { role } = payload;

        if (role === 'admin' || role === 'teacher') {
            return await next();
        } else {
            c.res.headers.append('Content-Type', 'text/plain')
            return c.text('Forbidden', 403);
        }
    } catch (error) {
        console.log("Error is: ", error);
        c.res.headers.append('Content-Type', 'text/plain')
        return c.text('Unauthorized', 401);
    }
}