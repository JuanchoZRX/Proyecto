package repository;

import org.springframework.data.repository.CrudRepository;
import data.ResultadoCarrera;
import java.util.List;
import java.util.Optional;

public interface ResultadoRepository extends CrudRepository<ResultadoCarrera, Long> {
	List<ResultadoCarrera> findByCarreraId(Long carreraId);
	Optional<ResultadoCarrera> findByCarreraIdAndPosicion(Long carreraId, Integer posicion);

}