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
}
