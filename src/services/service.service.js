import prisma from "../database/prisma.js";
import AppError from "../utils/AppError.js";

class ServiceService {
  async listPublic() {
    const services = await prisma.service.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return services;
  }

  async create(data) {
    const serviceAlreadyExists = await prisma.service.findFirst({
      where: {
        name: data.name,
      },
    });

    if (serviceAlreadyExists) {
      throw new AppError("Já existe um serviço com este nome.",409 );
    }

    const service = await prisma.service.create({
      data,
    });

    return service;
  }

  async list() {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return services;
  }

  async findById(id) {
    const service = await prisma.service.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!service) {
      throw new AppError("Serviço não encontrado.", 404);
    }

    return service;
  }

  async update(id, data) {
    const service = await prisma.service.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!service) {
      throw new AppError("Serviço não encontrado.", 404);
    }

    const updatedService = await prisma.service.update({
      where: {
        id: Number(id),
      },
      data,
    });

    return updatedService;
  }

  async delete(id) {
    const service = await prisma.service.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!service) {
      throw new AppError("Serviço não encontrado.", 404);
    }

    const deletedService = await prisma.service.delete({
      where: {
        id: Number(id),
      },
    });

    return deletedService;
  }
}

export default new ServiceService();
