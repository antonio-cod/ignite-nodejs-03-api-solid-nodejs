import { ChekIn, Prisma } from "@prisma/client";
import { CheckInRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInRepository {
  async findById(id: string) {
    const chekIn = await prisma.chekIn.findUnique({
      where: {
        id,
      },
    })
    return chekIn
  }

  async findByUserIdOnDate(userId: string, date: Date){
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).startOf('date')

    const chekIn = await prisma.chekIn.findFirst({
      where: {
        user_id: userId,
        created_at:{
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        }
      }
    })

    return chekIn
  }
  async findManyByUserId(userId: string, page: number){
    const checkIns = await prisma.chekIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page -1) *20,
    })
    return checkIns;
  }
  
  async countByUserId(userId: string){
    const count = await prisma.chekIn.count({
      where: {
        user_id: userId,
      },
    })
    return count
  }

  async create(data: Prisma.ChekInUncheckedCreateInput) {
    const chekIn = await prisma.chekIn.create({
      data,
    })

    return chekIn
  }

  async save(data: ChekIn){
    const chekIn = await prisma.chekIn.update({
      where: {
        id: data.id,
      },
      data,
    })

    return chekIn
  }
}