import { CheckInRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ChekIn } from "@prisma/client";
import { ResourceNotFoundEror } from "./erros/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./erros/max-distance-error";
import { MaxNumberOfCheckInsError } from "./erros/max-number--of-check-ins-error";


interface CheckInUseCaseRequest {
 userId: string
 gymId: string
 userLatitude: number
 userLongitude: number
}

interface CheckInUseCaseResponse {
 chekIn: ChekIn
}

export class CheckInUseCase {
constructor( 
  private checkInsRepository: CheckInRepository,
  private gymsRepository: GymsRepository,
) {}

async execute({ 
  userId, 
  gymId,
  userLatitude,
  userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse>{
    const gym = await this.gymsRepository.findById(gymId)
    
    if (!gym) {
      throw new ResourceNotFoundEror()
    }

    const distance = getDistanceBetweenCoordinates(
      {latitude: userLatitude, longitude: userLongitude},
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new  MaxDistanceError()
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
    }
    
    const chekIn = await this.checkInsRepository.create({
    gym_id: gymId,
    user_id: userId,
  })

  return {
    chekIn,
  }
 }
}