package repository;

import org.springframework.data.repository.CrudRepository;
import data.Conductor;

public interface ConductorRepository extends CrudRepository<Conductor, Long> {}