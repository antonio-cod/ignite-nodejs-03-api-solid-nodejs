import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { UserAlreadyExistsError } from "@/use-cases/erros/user-already-exists-error"
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case"
import { makeCreateGymsUseCase } from "@/use-cases/factories/make-create-gym-use-case"


export async function create(request: FastifyRequest, reply: FastifyReply){
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
     })
  })

  const { title, description, phone, latitude, longitude } = 
    createGymBodySchema.parse(request.body)

    const createGymUseCase = makeCreateGymsUseCase()

    await createGymUseCase.execute({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

  return reply.status(201).send()
}
