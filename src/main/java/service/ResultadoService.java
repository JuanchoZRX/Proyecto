package service;

import org.springframework.stereotype.Service;
import repository.ResultadoRepository;
import repository.CarreraRepository;
import repository.ConductorRepository;
import repository.AutoRepository;
import data.ResultadoCarrera;

import java.util.List;
import java.util.Optional;

@Service
public class ResultadoService {

    private final ResultadoRepository repo;
    private final CarreraRepository carreraRepo;
    private final ConductorRepository conductorRepo;
    private final AutoRepository autoRepo;

    public ResultadoService(ResultadoRepository repo,
                            CarreraRepository carreraRepo,
                            ConductorRepository conductorRepo,
                            AutoRepository autoRepo){
        this.repo = repo;
        this.carreraRepo = carreraRepo;
        this.conductorRepo = conductorRepo;
        this.autoRepo = autoRepo;
    }


    public ResultadoCarrera create(ResultadoCarrera resultado){
        validarResultado(resultado, null);
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
        validarResultado(nuevo, id);
        nuevo.setId(id);
        return repo.save(nuevo);
    }


    public void delete(Long id){
        if(!repo.existsById(id)){
            throw new RuntimeException("Resultado no encontrado con id: " + id);
        }
        repo.deleteById(id);
    }


    private void validarResultado(ResultadoCarrera resultado, Long idActual){
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

        if(resultado.getAutoId() == null){
            throw new RuntimeException("Debe indicar el auto");
        }

        if(!autoRepo.existsById(resultado.getAutoId())){
            throw new RuntimeException("El auto no existe");
        }

        if(resultado.getPosicion() <= 0){
            throw new RuntimeException("La posición debe ser mayor a 0");
        }

        if(resultado.getPuntos() < 0){
            throw new RuntimeException("Los puntos no pueden ser negativos");
        }

        Optional<ResultadoCarrera> existente = repo.findByCarreraIdAndPosicion(
                resultado.getCarreraId(), resultado.getPosicion());

        if(existente.isPresent() && !existente.get().getId().equals(idActual)){
            throw new RuntimeException("Ya existe un conductor en la posición "
                    + resultado.getPosicion() + " de esta carrera");
        }
    }
}