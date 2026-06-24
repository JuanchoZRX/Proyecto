package service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import data.Conductor;
import repository.ConductorRepository;
import repository.EquipoRepository;

@Service
public class ConductorService {

    private final ConductorRepository repo;
    private final EquipoRepository equipoRepo;

    public ConductorService(ConductorRepository repo,
                            EquipoRepository equipoRepo) {
        this.repo = repo;
        this.equipoRepo = equipoRepo;
    }

    public Iterable<Conductor> getAll() {
        return repo.findAll();
    }

    public Conductor save(Conductor c) {
        validarConductor(c);
        return repo.save(c);
    }

    public Conductor update(Long id, Conductor nuevo) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Conductor no encontrado con id: " + id);
        }
        validarConductor(nuevo);
        nuevo.setId(id);
        return repo.save(nuevo);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Conductor no encontrado con id: " + id);
        }
        repo.deleteById(id);
    }

    public Iterable<Conductor> getByEquipo(Long equipoId) {
        return repo.findByEquipoId(equipoId);
    }

    private void validarConductor(Conductor c) {
        if (c == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El conductor no puede ser null");
        }
        if (c.getNombre() == null || c.getNombre().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El nombre del conductor es obligatorio");
        }
        if (c.getEquipoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Debe indicar el equipo del conductor");
        }
        if (!equipoRepo.existsById(c.getEquipoId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El equipo indicado no existe");
        }
    }
}