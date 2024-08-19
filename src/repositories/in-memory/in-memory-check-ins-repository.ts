import { Prisma, ChekIn } from "@prisma/client";
import { CheckInRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInRepository {
  public items: ChekIn[] = []
  
  async findById(id: string){
    const chekIn = this.items.find((item) => item.id == id)

    if (!chekIn) {
      return null
    }
    return chekIn
    
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')
    
    const checkInOnSameDate = this.items.find((chekIn) => {
      const checkInDate = dayjs(chekIn.created_at)
      const isOnSameDate =
      checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      
      return chekIn.user_id == userId && isOnSameDate
    })
    
    if (!checkInOnSameDate) {
      return null
    }
    
    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number){
    return this.items
    .filter((item) => item.user_id == userId)
    .slice((page - 1) * 20, page *20)
  }
  async countByUserId(userId: string){
    return this.items
    .filter((item) => item.user_id == userId).length
  }

  async create(data: Prisma.ChekInUncheckedCreateInput){
    const chekIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(chekIn)
    return chekIn
  }

  async save(chekIn: ChekIn) {
    const chekInIndex = this.items.findIndex(item => item.id == chekIn.id)
  
    if(chekInIndex >= 0) {
      this.items[chekInIndex] = chekIn
    }

    return chekIn
  }
}