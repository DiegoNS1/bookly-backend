import prisma from "../database/prisma.js";
import AppError from "../utils/AppError.js";

class AppointmentService {
  async create(data) {
    const clientId = Number(data.clientId);
    const serviceId = Number(data.serviceId);
    const appointmentDate = new Date(data.appointmentDate);

    if (!clientId || !serviceId || isNaN(appointmentDate.getTime())) {
      throw new AppError("Dados do agendamento inválidos.", 400);
    }

    if (appointmentDate <= new Date()) {
      throw new AppError("A data do agendamento deve estar no futuro.", 400);
    }

    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    });

    if (!client) {
      throw new AppError("Cliente não encontrado.", 404);
    }

    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!service) {
      throw new AppError("Serviço não encontrado.", 404);
    }

    if (!service.active) {
      throw new AppError("Este serviço está inativo.", 400);
    }

    const appointmentAlreadyExists =
      await prisma.appointment.findFirst({
        where: {
          appointmentDate,
        },
      });

    if (appointmentAlreadyExists) {
      throw new AppError("Já existe um agendamento neste horário.",409);
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        serviceId,
        appointmentDate,
      },
      include: {
        client: true,
        service: true,
      },
    });

    return appointment;
  }

  async list() {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: true,
        service: true,
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    return appointments;
  }

  async findById(id) {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        client: true,
        service: true,
      },
    });

    if (!appointment) {
      throw new AppError("Agendamento não encontrado.", 404);
    }

    return appointment;
  }

  async update(id, data) {
    const appointmentId = Number(id);

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      throw new AppError("Agendamento não encontrado.", 404);
    }

    const updateData = {};

    if (data.clientId !== undefined) {
      const clientId = Number(data.clientId);

      const client = await prisma.client.findUnique({
        where: {
          id: clientId,
        },
      });

      if (!client) {
        throw new AppError("Cliente não encontrado.", 404);
      }

      updateData.clientId = clientId;
    }

    if (data.serviceId !== undefined) {
      const serviceId = Number(data.serviceId);

      const service = await prisma.service.findUnique({
        where: {
          id: serviceId,
        },
      });

      if (!service) {
        throw new AppError("Serviço não encontrado.", 404);
      }

      if (!service.active) {
        throw new AppError("Este serviço está inativo.",400);
      }

      updateData.serviceId = serviceId;
    }

    if (data.appointmentDate !== undefined) {
      const appointmentDate = new Date(data.appointmentDate);

      if (isNaN(appointmentDate.getTime())) {
        throw new AppError("Data do agendamento inválida.",400);
      }

      if (appointmentDate <= new Date()) {
        throw new AppError("A data do agendamento deve estar no futuro.",400);
      }

      const occupiedAppointment =
        await prisma.appointment.findFirst({
          where: {
            appointmentDate,
            NOT: {
              id: appointmentId,
            },
          },
        });

      if (occupiedAppointment) {
        throw new AppError("Já existe um agendamento neste horário.",409);
      }

      updateData.appointmentDate = appointmentDate;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    const updatedAppointment =
      await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: updateData,
        include: {
          client: true,
          service: true,
        },
      });

    return updatedAppointment;
  }

  async delete(id) {
    const appointmentId = Number(id);

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      throw new AppError("Agendamento não encontrado.",404);
    }

    const deletedAppointment =
      await prisma.appointment.delete({
        where: {
          id: appointmentId,
        },
      });

    return deletedAppointment;
  }
}

export default new AppointmentService();