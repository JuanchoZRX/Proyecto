package service;

import org.springframework.stereotype.Service;
import repository.ResultadoRepository;
import repository.CarreraRepository;
import repository.ConductorRepository;
import data.ResultadoCarrera;

import java.util.List;
import java.util.Optional;

@Service
public class ResultadoService {

    private final ResultadoRepository repo;
    private final CarreraRepository carreraRepo;
    private final ConductorRepository conductorRepo;

    public ResultadoService(ResultadoRepository repo,
                            CarreraRepository carreraRepo,
                            ConductorRepository conductorRepo){
        this.repo = repo;
        this.carreraRepo = carreraRepo;
        this.conductorRepo = conductorRepo;
    }


    public ResultadoCarrera create(ResultadoCarrera resultado){
        validarResultado(resultado);
        return repo.save(resultado);
    }


    public List<ResultadoCarrera> getAll(){
        return (List<ResultadoCarrera>) repo.findAll();
    }

    public Optional<ResultadoCarrera> getById(Long id){
        return repo.findById(id);
    }

    public List<ResultadoCarrera> getByCarrera(Long carreraId){
        return repo.findByCarreraId(carreraId);
    }


    public ResultadoCarrera update(Long id, ResultadoCarrera nuevo){
        if(!repo.existsById(id)){
            throw new RuntimeException("Resultado no encontrado con id: " + id);
        }
        validarResultado(nuevo);
        nuevo.setId(id);
        return repo.save(nuevo);
    }


    public void delete(Long id){
        if(!repo.existsById(id)){
            throw new RuntimeException("Resultado no encontrado con id: " + id);
        }
        repo.deleteById(id);
    }


    private void validarResultado(ResultadoCarrera resultado){
        if(resultado == null){
            throw new RuntimeException("El resultado no puede ser null");
        }

        if(resultado.getCarreraId() == null){
            throw new RuntimeException("Debe indicar la carrera");
        }


        if(!carreraRepo.existsById(resultado.getCarreraId())){
            throw new RuntimeException("La carrera no existe");
        }

        if(resultado.getConductorId() == null){
            throw new RuntimeException("Debe indicar el conductor");
        }

        if(!conductorRepo.existsById(resultado.getConductorId())){
            throw new RuntimeException("El conductor no existe");
        }

        if(resultado.getPosicion() <= 0){
            throw new RuntimeException("La posición debe ser mayor a 0");
        }

        if(resultado.getPuntos()<0){
            throw new RuntimeException("Los puntos no pueden ser negativos");
        }

        if(resultado.getTiempo() <= 0){
            throw new RuntimeException("El tiempo debe ser mayor a 0");
        }
    }
}