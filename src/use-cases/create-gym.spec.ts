import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

//Teste Unitarios
let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository ()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
   const { gym } = await sut.execute({
      title: 'JavaScripit Gym',
      description: null,
      phone: null,
      latitude: -13.649202,
      longitude: -57.9057915,
    })

     expect(gym.id).toEqual(expect.any(String))
  })
})