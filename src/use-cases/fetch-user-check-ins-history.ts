import { CheckInRepository } from "@/repositories/check-ins-repository";
import { ChekIn } from "@prisma/client";


interface FetchUserCheckInsHistoryUseCaseRequest {
 userId: string
 page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
 chekIns: ChekIn[]
}

export class FetchUserCheckInsHistoryUseCase {
constructor( private checkInsRepository: CheckInRepository) {}

async execute({ 
  userId, 
  page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse>{
    const chekIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

  return {
    chekIns,
  }
 }
}