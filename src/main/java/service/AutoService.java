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
}