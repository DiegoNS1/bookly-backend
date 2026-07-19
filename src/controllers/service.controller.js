import serviceService from "../services/service.service.js";

class ServiceController {
  async create(request, response) {
    const service = await serviceService.create(request.body);

    return response.status(201).json(service);
  }

  async list(request, response) {
    const services = await serviceService.list();
  
    return response.json(services);
  
  }
  
  async findById(request, response) {
    const { id } = request.params;
  
    const service = await serviceService.findById(id);
  
    return response.json(service);
  }
  
  async update(request, response) {
    const { id } = request.params;
  
    const updatedService = await serviceService.update(id, request.body);
  
    return response.json(updatedService);
  }
  
  async delete(request, response){
    const { id } = request.params;
    
    const deletedService = await serviceService.delete(id);
  
    return response.json(deletedService);
  }
  }
  

export default new ServiceController();