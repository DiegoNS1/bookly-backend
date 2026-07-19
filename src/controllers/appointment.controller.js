import appointmentService from "../services/appointment.service.js";

class AppointmentController {
  async create(request, response) {
    const appointment = await appointmentService.create(request.body);

    return response.status(201).json(appointment);
  }

  async list(request, response) {
    const appointments = await appointmentService.list();

    return response.json(appointments);
  }

  async findById(request, response) {
    const { id } = request.params;

    const appointment = await appointmentService.findById(id);

    return response.json(appointment);
  }

  async update(request, response) {
    const { id } = request.params;

    const updatedAppointment = await appointmentService.update(
      id,
      request.body
    );

    return response.json(updatedAppointment);
  }

  async delete(request, response) {
    const { id } = request.params;

    const deletedAppointment =
      await appointmentService.delete(id);

    return response.json(deletedAppointment);
  }
}

export default new AppointmentController();