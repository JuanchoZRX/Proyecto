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
}