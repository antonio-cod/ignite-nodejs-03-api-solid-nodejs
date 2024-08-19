import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

//Teste Unitarios

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  }) 

  it('should be able to for gyms', async () => {    
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -13.649202,
      longitude: -57.9057915,
    })
  
    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -13.649202,
      longitude: -57.9057915,
    })

     const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
     })

    expect (gyms ).toHaveLength(1)
    expect (gyms ).toEqual([expect.objectContaining({ title: 'JavaScript Gym'})])
  }) 

  it('should be able to fetch paginated gyms seach', async () => {    
    for (let i = 1; i <= 22; i++){
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -13.649202,
        longitude: -57.9057915,
       })
    }

     const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
     })

    expect ( gyms ).toHaveLength(2)
    expect ( gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21'}),
      expect.objectContaining({ title: 'JavaScript Gym 22'}),
    ])
  }) 

})