package service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import data.Auto;
import repository.AutoRepository;
import repository.EquipoRepository;

@Service
public class AutoService {

    private final AutoRepository repo;
    private final EquipoRepository equipoRepo;

    public AutoService(AutoRepository repo,
                       EquipoRepository equipoRepo) {
        this.repo = repo;
        this.equipoRepo = equipoRepo;
    }

    public Iterable<Auto> getAll() {
        return repo.findAll();
    }

    public Auto save(Auto a) {
        validarAuto(a);
        return repo.save(a);
    }

    public Auto update(Long id, Auto nuevo) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Auto no encontrado con id: " + id);
        }
        validarAuto(nuevo);
        nuevo.setId(id);
        return repo.save(nuevo);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Auto no encontrado con id: " + id);
        }
        repo.deleteById(id);
    }

    public Iterable<Auto> getByEquipo(Long equipoId) {
        return repo.findByEquipoId(equipoId);
    }

    private void validarAuto(Auto a) {
        if (a == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El auto no puede ser null");
        }
        if (a.getModelo() == null || a.getModelo().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El modelo del auto es obligatorio");
        }
        if (a.getEquipoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Debe indicar el equipo del auto");
        }
        if (!equipoRepo.existsById(a.getEquipoId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El equipo indicado no existe");
        }
    }
}