import { PrismaClient } from "@/generate/prisma";
import { Domain, parseDomain } from "./domainParser";

class ExtendedPrisma {
  private prisma = new PrismaClient();

  public async find(
    model: keyof PrismaClient,
    domain: Domain,
    options: {
      skip?: number;
      take?: number;
      orderBy?: Record<string, "asc" | "desc">;
      include?: any;
      select?: any;
    } = {}
  ) {
    const where = parseDomain(domain);
    // @ts-ignore
    return await this.prisma[model].findMany({
      where,
      ...options,
    });
  }

  public async create(model: keyof PrismaClient, data: any) {
    // @ts-ignore
    return await this.prisma[model].create({ data });
  }

  public async update(
    model: keyof PrismaClient,
    id: number | string,
    data: any
  ) {
    // @ts-ignore
    return await this.prisma[model].update({
      where: { id },
      data,
    });
  }

  public async delete(model: keyof PrismaClient, id: number | string) {
    // @ts-ignore
    return await this.prisma[model].delete({
      where: { id },
    });
  }

  public get client() {
    return this.prisma;
  }
}

export const db = new ExtendedPrisma();
