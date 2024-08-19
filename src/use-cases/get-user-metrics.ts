import { CheckInRepository } from "@/repositories/check-ins-repository";
import { ChekIn } from "@prisma/client";


interface GetUserMetricsUseCaseRequest {
 userId: string
}

interface GetUserMetricsUseCaseResponse {
 chekInsCount: number
}

export class GetUserMetricsUseCase {
constructor( private checkInsRepository: CheckInRepository) {}

async execute({ 
  userId, 
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse>{
    const chekInsCount = await this.checkInsRepository.countByUserId(userId)

  return {
    chekInsCount,
  }
 }
}