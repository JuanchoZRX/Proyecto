package repository;

import org.springframework.data.repository.CrudRepository;
import data.ResultadoCarrera;
import org.springframework.data.jdbc.repository.query.Query;
import java.util.List;

public interface ResultadoRepository extends CrudRepository<ResultadoCarrera, Long> {
    List<ResultadoCarrera> findByCarrera(Long carreraId);
}