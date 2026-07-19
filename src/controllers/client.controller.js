import clientService from "../services/client.service.js";

class ClientController {
  async create(request, response) {
    const client = await clientService.create(request.body);

    return response.status(201).json(client);
  }

async list(request, response) {
  const clients = await clientService.list();

  return response.json(clients);

}

async findById(request, response) {
  const { id } = request.params;

  const client = await clientService.findById(id);

  return response.json(client);
}

async update(request, response) {
  const { id } = request.params;

  const updatedClient = await clientService.update(id, request.body);

  return response.json(updatedClient);
}

async delete(request, response){
  const { id } = request.params;
  
  const deleteClient = await clientService.delete(id);

  return response.json(deleteClient);
}
}

export default new ClientController();