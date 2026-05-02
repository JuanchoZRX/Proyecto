package service;

import data.Carrera;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import repository.CarreraRepository;
import repository.CircuitoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CarreraService {

    private final CarreraRepository repo;
    private final CircuitoRepository circuitoRepo;

    public CarreraService(CarreraRepository repo,
                          CircuitoRepository circuitoRepo) {
        this.repo = repo;
        this.circuitoRepo = circuitoRepo;
    }


    public Carrera create(Carrera carrera){
        validarCarrera(carrera);
        if(repo.existsByNombre(carrera.getNombre())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Ya existe una carrera con ese nombre");
        }

        return repo.save(carrera);
    }


    public List<Carrera> getAll(){
        return repo.findAll();
    }

    public Optional<Carrera> getById(Long id){
        return repo.findById(id);
    }

    public List<Carrera> getByCircuito(Long circuitoId){
        return repo.findByCircuitoId(circuitoId);
    }


    public Carrera update(Long id, Carrera nuevo){

        if(!repo.existsById(id)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Carrera no encontrada con el id: " + id);
        }
        validarCarrera(nuevo);
        nuevo.setId(id);
        return repo.save(nuevo);
    }


    public void delete(Long id){
        if(!repo.existsById(id)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Carrera no encontrada con el id: " + id);
        }
        repo.deleteById(id);
    }


    private void validarCarrera(Carrera carrera){

        if(carrera == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La carrera no puede ser null");
        }

        if(carrera.getNombre() == null || carrera.getNombre().isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }

        if(carrera.getFecha() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha es obligatoria");
        }

        if(carrera.getCircuitoId() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar el circuito");
        }

        if(!circuitoRepo.existsById(carrera.getCircuitoId())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El circuito no existe");
        }
    }
}