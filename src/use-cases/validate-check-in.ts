import { CheckInRepository } from "@/repositories/check-ins-repository";
import { ChekIn } from "@prisma/client";
import dayjs from "dayjs";
import { LateCheckInValidateError } from "./errors/late-check-in-validation-error";
import { ResourceNotFoundEror } from "./errors/resource-not-found-error";


interface ValidateCheckInUseCaseRequest {
checkInId: string
}

interface ValidateCheckInUseCaseResponse {
 chekIn: ChekIn
}

export class ValidateCheckInUseCase {
constructor(private checkInsRepository: CheckInRepository) {}

async execute({ 
checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse>{
    const chekIn = await this.checkInsRepository.findById(checkInId)
    
    if (!chekIn) {
      throw new ResourceNotFoundEror()
    }

    const distanceInMitutesFromCheckInCreatiton = dayjs(new Date()).diff(
      chekIn.created_at,
      'minutes',
    )

    if (distanceInMitutesFromCheckInCreatiton > 20){
      throw new LateCheckInValidateError()
    }
    
    chekIn.validated_at = new Date()

    await this.checkInsRepository.save(chekIn)
    
    return {
    chekIn,
    }
 }
}