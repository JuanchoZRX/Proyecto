package service;

import org.springframework.stereotype.Service;
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
        return repo.save(e);
    }

    public Equipo getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Equipo update(Long id, Equipo e) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Equipo no encontrado con id: " + id);
        }
        e.setId(id);
        return repo.save(e);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Equipo no encontrado con id: " + id);
        }
        repo.deleteById(id);
    }
}