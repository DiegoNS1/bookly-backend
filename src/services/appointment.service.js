import prisma from "../database/prisma.js";
import AppError from "../utils/AppError.js";

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function getSaoPauloDayRange(date) {
  const start = new Date(`${date}T00:00:00-03:00`);

  if (
    !DATE_PATTERN.test(date) ||
    Number.isNaN(start.getTime()) ||
    start.toLocaleDateString("en-CA", {
      timeZone: "America/Sao_Paulo",
    }) !== date
  ) {
    throw new AppError("Informe uma data válida no formato YYYY-MM-DD.", 400);
  }

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

function formatTimeInSaoPaulo(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

class AppointmentService {
  async available(date) {
    if (!date) {
      throw new AppError("A data é obrigatória.", 400);
    }

    const { start, end } = getSaoPauloDayRange(date);

    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: start,
          lt: end,
        },
      },
      select: {
        appointmentDate: true,
      },
    });

    const occupiedTimes = new Set(
      appointments.map((appointment) =>
        formatTimeInSaoPaulo(appointment.appointmentDate)
      )
    );

    const availableTimes = TIME_SLOTS.filter(
      (time) => !occupiedTimes.has(time)
    );

    return {
      date,
      availableTimes,
    };
  }

  async createPublic(data) {
    const name = data.name?.trim();
    const phone = data.phone?.trim();
    const serviceId = Number(data.serviceId);

    if (!name || !phone || !serviceId || !data.appointmentDate) {
      throw new AppError(
        "Nome, telefone, serviço, data e horário são obrigatórios.",
        400
      );
    }

    let client = await prisma.client.findFirst({
      where: {
        phone,
      },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name,
          phone,
        },
      });
    }

    return this.create({
      clientId: client.id,
      serviceId,
      appointmentDate: data.appointmentDate,
    });
  }

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
