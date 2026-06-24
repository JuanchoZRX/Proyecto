package controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import data.Conductor;
import service.ConductorService;

@RestController
@RequestMapping("/conductores")
public class ConductorController {

    private final ConductorService service;

    public ConductorController(ConductorService service) {
        this.service = service;
    }

    @GetMapping
    public Iterable<Conductor> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Conductor create(@RequestBody Conductor c) {
        return service.save(c);
    }

    @GetMapping("/equipo/{id}")
    public Iterable<Conductor> getByEquipo(@PathVariable Long id) {
        return service.getByEquipo(id);
    }

    @GetMapping("/{id}")
    public Conductor getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Conductor update(@PathVariable Long id, @RequestBody Conductor c) {
        return service.update(id, c);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
