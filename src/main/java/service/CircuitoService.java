package service;

import data.Circuito;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import repository.CircuitoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CircuitoService {

    private final CircuitoRepository repo;

    public CircuitoService(CircuitoRepository repo) {
        this.repo = repo;
    }

    public Circuito create(Circuito circuito){

        validarCircuito(circuito);

        if(repo.existsByNombre(circuito.getNombre())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ya existe un circuito con ese nombre");
        }
        return repo.save(circuito);
    }


    public List<Circuito> getAll(){
        return repo.findAll();
    }

    public Optional<Circuito> getById(Long id){
        return repo.findById(id);
    }


    public Circuito update(Long id, Circuito nuevo){

        if(!repo.existsById(id)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Circuito no encontrado con el id: " + id);
        }
        validarCircuito(nuevo);
        nuevo.setId(id);
        return repo.save(nuevo);
    }

    public void delete(Long id){
        if(!repo.existsById(id)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Circuito no encontrado con el id: " + id);
        }
        repo.deleteById(id);
    }


    private void validarCircuito(Circuito circuito){

        if(circuito == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El circuito no puede ser null");
        }


        if(circuito.getNombre() == null || circuito.getNombre().isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El nombre del circuito es obligatorio");
        }


        if(circuito.getPais() == null || circuito.getPais().isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El país donde se ubica el circuito es obligatorio");
        }


        if(circuito.getLongitud() <= 0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La longitud debe ser mayor a 0");
        }
    }
}