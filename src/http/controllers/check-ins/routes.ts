import { FastifyInstance } from "fastify";

import { verifyJWT } from "../../middewares/verify-jwt";

import { create } from "./create";
import { history } from "./history";
import { metrics } from "./metrics";
import { validate } from "./validate";
import { verifyUserRole } from "@/http/middewares/verify-user-role";


export async function checkInsRoutes(app: FastifyInstance) {
 app.addHook('onRequest', verifyJWT)

 app.get('/check-ins/history', history)
 app.get('/check-ins/metrics', metrics)

 app.get('/gyms/gymId/check-ins', create)

 app.patch(
  '/check-ins/:checkInId/validate', 
  { onRequest: [verifyUserRole('ADMIN')]},
  validate,
  )

 
}