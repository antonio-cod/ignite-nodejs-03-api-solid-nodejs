import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundEror } from './erros/resource-not-found-error'


//Teste Unitarios

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)
  

     vi.useFakeTimers()
  })

  afterEach(() => {
     vi.useRealTimers()
  })
  
  it('should be able to validate the check in', async () => {    
    const createdCheckIn = await checkInsRepository.create({
    gym_id: 'gym-01',
    user_id: 'user-01',
    })

    const {chekIn} = await sut.execute({
    checkInId: createdCheckIn.id,
    })
  
    expect(chekIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))

  }) 

  it('should be able to validate an inexistent check in', async () => {    
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundEror)

  }) 

  it('should not be able to validete the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
      })
      
      const twentyOneMinutesInMs = 1000 * 60 * 21

      vi.advanceTimersByTime(twentyOneMinutesInMs)

      await expect(() =>
        sut.execute({
      checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})