package service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import data.Equipo;
import repository.EquipoRepository;

@Service
public class EquipoService {

    private final EquipoRepository repo;

    public EquipoService(EquipoRepository repo) {
        this.repo = repo;
    }

    public Iterable<Equipo> getAll() {
        return repo.findAll();
    }

    public Equipo save(Equipo e) {
        validarEquipo(e);
        return repo.save(e);
    }

    public Equipo getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Equipo no encontrado con id: " + id));
    }

    public Equipo update(Long id, Equipo nuevo) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Equipo no encontrado con id: " + id);
        }
        validarEquipo(nuevo);
        nuevo.setId(id);
        return repo.save(nuevo);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Equipo no encontrado con id: " + id);
        }
        repo.deleteById(id);
    }

    private void validarEquipo(Equipo e) {
        if (e == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El equipo no puede ser null");
        }
        if (e.getNombre() == null || e.getNombre().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El nombre del equipo es obligatorio");
        }
    }
}