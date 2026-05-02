package repository;

import org.springframework.data.repository.CrudRepository;
import data.Conductor;
import java.util.List;

public interface ConductorRepository extends CrudRepository<Conductor, Long> {
    List<Conductor> findByEquipoId(Long equipoId);
}

