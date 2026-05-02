package repository;

import org.springframework.data.repository.CrudRepository;
import data.ResultadoCarrera;
import java.util.List;

public interface ResultadoRepository extends CrudRepository<ResultadoCarrera, Long> {
	List<ResultadoCarrera> findByCarreraId(Long carreraId);

}