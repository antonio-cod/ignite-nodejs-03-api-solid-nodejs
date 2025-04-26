import { CheckInRepository } from "@/repositories/check-ins-repository";
import { ChekIn } from "@prisma/client";


interface GetUserMetricsUseCaseRequest {
 userId: string
}

interface GetUserMetricsUseCaseResponse {
 checkInsCount: number
}

export class GetUserMetricsUseCase {
constructor( private checkInsRepository: CheckInRepository) {}

async execute({ 
  userId, 
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse>{
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

  return {
    checkInsCount,
  }
 }
}