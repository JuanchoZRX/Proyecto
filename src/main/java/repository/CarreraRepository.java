package repository;

import data.Carrera;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CarreraRepository extends CrudRepository<Carrera, Long> {
    List<Carrera> findAll();

    List<Carrera> findByCircuitoId(Long circuitoId);

    boolean existsByNombre(String nombre);
}
