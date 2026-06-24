package service;

import org.springframework.stereotype.Service;
import data.Conductor;
import repository.ConductorRepository;

@Service
public class ConductorService {

    private final ConductorRepository repo;

    public ConductorService(ConductorRepository repo) {
        this.repo = repo;
    }

    public Iterable<Conductor> getAll() {
        return repo.findAll();
    }

    public Conductor save(Conductor c) {
        return repo.save(c);
    }

    public Iterable<Conductor> getByEquipo(Long equipoId) {
        return repo.findByEquipoId(equipoId);
    }

    public Conductor getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Conductor update(Long id, Conductor c) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Conductor no encontrado con id: " + id);
        }
        c.setId(id);
        return repo.save(c);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Conductor no encontrado con id: " + id);
        }
        repo.deleteById(id);
    }
}