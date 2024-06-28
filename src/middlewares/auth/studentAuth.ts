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
  // console.log(token);
  return token
}


// create new users authentication and authorization
export const createStudentAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  console.log("auth is: ", authHeader);

  if (!authHeader) {
    console.log("this");
    c.res.headers.append('Content-Type', 'text/plain')
    return c.text('Unauthorized', 401);
  }
  const token = authHeader.split(' ')[1];
  console.log("Token is: ", token);

  try {
    const payload = jwt.verify(token, 'bilal') as CustomJwtPayload;

    console.log("payload: ", payload);

    const { role } = payload;
    console.log("role is: ", role);

    if (role === 'teacher' || role === 'admin') {
      console.log("role checked");
      return await next();
    } else {
      c.res.headers.append('Content-Type', 'text/plain')
      return c.text('Forbidden', 403);
    }
  } catch (error) {
    console.log("Errorrrr: ", error);
    c.res.headers.append('Content-Type', 'text/plain')
    return c.text('Unauthorized', 401);
  }
}

