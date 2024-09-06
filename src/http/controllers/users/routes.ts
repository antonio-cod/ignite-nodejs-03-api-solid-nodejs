import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middewares/verify-jwt";
import { profile } from "./profile";
import { register } from "./register";
import { authenticate } from "./authenticate";


export async function usersRoutes(app: FastifyInstance) {
 
 app.post('/users', register)
  app.post('/sessions', authenticate)

  /** Authenticated */
  app.get('/me',  {onRequest: [verifyJWT] }, profile)
}