package repository;
import data.Circuito;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface CircuitoRepository extends CrudRepository<Circuito, Long> {
    List<Circuito> findAll();

    boolean existsByNombre(String nombre);
}