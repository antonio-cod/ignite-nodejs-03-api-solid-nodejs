import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { UserAlreadyExistsError } from "@/use-cases/erros/user-already-exists-error"
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case"
import { makeCreateGymsUseCase } from "@/use-cases/factories/make-create-gym-use-case"
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case"


export async function search(request: FastifyRequest, reply: FastifyReply){
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymsQuerySchema.parse(request.body)

    const searchGymsUseCase = makeSearchGymsUseCase()

    const { gyms } = await searchGymsUseCase.execute({
      query: q,
      page,
    })

  return reply.status(201).send({
    gyms,
  })
}
