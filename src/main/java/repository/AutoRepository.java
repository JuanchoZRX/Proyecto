package repository;

import org.springframework.data.repository.CrudRepository;
import data.Auto;
import java.util.List;

public interface AutoRepository extends CrudRepository<Auto, Long> {
    List<Auto> findByEquipoId(Long equipoId);
}
