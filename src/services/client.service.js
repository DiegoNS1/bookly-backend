import prisma from "../database/prisma.js";
import AppError from "../utils/AppError.js";

class ClientService {
  async create(data) {
    const clientAlreadyExists = await prisma.client.findUnique({
      where: {
        email: data.email,
      },
    });

    if (clientAlreadyExists) {
        throw new AppError("Já existe um cliente com este e-mail.", 409);
    }

    const client = await prisma.client.create({
      data,
    });

    return client;
  }

  async list() {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return clients;
  }

  async findById(id) {
   const client = await prisma.client.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!client) {
    throw new AppError("Cliente não encontrado", 404);
  }

  

  return client;
}

async update(id, data) {
  const client = await prisma.client.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!client) {
    throw new AppError("Cliente não encontrado", 404);
  }

  const updatedClient = await prisma.client.update({
    where: {
      id: Number(id),
    },
    data,
  });

  return updatedClient;
}

async delete(id){
  const client = await prisma.client.findUnique({
    where:{
      id: Number(id),
    },
  });

  if (!client){
    throw new AppError("Cliente não encontrado", 404);
  }

  const deleteClient = await prisma.client.delete({
    where: {
      id: Number(id),
    },
  });

  return deleteClient;
}

}

export default new ClientService();