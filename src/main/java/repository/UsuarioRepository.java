package repository;

import data.Usuario;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;


public interface UsuarioRepository extends CrudRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

}