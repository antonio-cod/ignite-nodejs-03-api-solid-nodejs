import { ChekIn, Prisma } from "@prisma/client";

export interface CheckInRepository {
  findById(id: string): Promise<ChekIn | null>
  findByUserIdOnDate(userId: string, date: Date ): Promise<ChekIn | null>
  findManyByUserId(userId: string, page: number):Promise<ChekIn[]>
  countByUserId(userId: string): Promise<number>
  create (data: Prisma.ChekInUncheckedCreateInput): Promise<ChekIn>
  save (chekIn: ChekIn): Promise<ChekIn>

}