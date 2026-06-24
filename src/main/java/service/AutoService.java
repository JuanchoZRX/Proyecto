package service;

import org.springframework.stereotype.Service;
import data.Auto;
import repository.AutoRepository;

@Service
public class AutoService {

    private final AutoRepository repo;

    public AutoService(AutoRepository repo) {
        this.repo = repo;
    }

    public Iterable<Auto> getAll() {
        return repo.findAll();
    }

    public Auto save(Auto a) {
        return repo.save(a);
    }

    public Iterable<Auto> getByEquipo(Long equipoId) {
        return repo.findByEquipoId(equipoId);
    }

    public Auto getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Auto update(Long id, Auto a) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Auto no encontrado con id: " + id);
        }
        a.setId(id);
        return repo.save(a);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Auto no encontrado con id: " + id);
        }
        repo.deleteById(id);
    }
}