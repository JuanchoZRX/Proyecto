package controller;

import org.springframework.web.bind.annotation.*;
import data.Equipo;
import service.EquipoService;

@RestController
@RequestMapping("/equipos")
public class EquipoController {

    private final EquipoService service;

    public EquipoController(EquipoService service) {
        this.service = service;
    }

    @GetMapping
    public Iterable<Equipo> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Equipo create(@RequestBody Equipo e) {
        return service.save(e);
    }

    @GetMapping("/{id}")
    public Equipo getById(@PathVariable Long id) {
        return service.getById(id);
    }
}