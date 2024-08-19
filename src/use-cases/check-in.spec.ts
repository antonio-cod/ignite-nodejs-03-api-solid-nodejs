import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxNumberOfCheckInsError } from './erros/max-number--of-check-ins-error'
import { MaxDistanceError } from './erros/max-distance-error'


//Teste Unitarios

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)
  
    await gymsRepository.create({
        id: 'gym-01',
        title: 'JavaScripit Gym',
        description: '',
        phone: '',
        latitude: -13.649202,
        longitude: -57.9057915,
      })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  
  it('should be able to check in', async () => {    
    const { chekIn } = await sut.execute({
     gymId: 'gym-01',
     userId: 'user-01',
     userLatitude: -13.649202,
     userLongitude: -57.9057915,
    })
  
    expect(chekIn.id).toEqual(expect.any(String))
  }) 

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 9, 8, 0, 0))

    await sut.execute({
     gymId: 'gym-01',
     userId: 'user-01',
     userLatitude: -13.649202,
     userLongitude: -57.9057915,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -13.649202,
        userLongitude: -57.9057915,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2024, 0, 9, 8, 0, 0))

    await sut.execute({
     gymId: 'gym-01',
     userId: 'user-01',
     userLatitude: -13.649202,
     userLongitude: -57.9057915,
    })

    vi.setSystemTime(new Date(2024, 0, 10, 8, 0, 0))

    const { chekIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -13.649202,
      userLongitude: -57.9057915,
      })
   
      expect(chekIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {     
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScripit Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-13.444453),
      longitude: new Decimal(-57.975933),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -13.649202,
        userLongitude: -57.9057915,
    }),

  ).rejects.toBeInstanceOf(MaxDistanceError)
  }) 
})