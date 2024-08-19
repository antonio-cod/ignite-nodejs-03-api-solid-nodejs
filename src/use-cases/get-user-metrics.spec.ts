import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'


//Teste Unitarios

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  }) 

  it('should be able to get check-ins count metrics', async () => {    
    await checkInsRepository.create({
     gym_id: 'gym-01',
     user_id: 'user-01',
    })
  
    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
     })

     const { chekInsCount } = await sut.execute({
      userId: 'user-01',
     })

    expect (chekInsCount ).toEqual(2)
  }) 
})