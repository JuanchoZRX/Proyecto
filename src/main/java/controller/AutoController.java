package controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import data.Auto;
import service.AutoService;

@RestController
@RequestMapping("/autos")
public class AutoController {

    private final AutoService service;

    public AutoController(AutoService service) {
        this.service = service;
    }

    @GetMapping
    public Iterable<Auto> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ResponseEntity<Auto> create(@RequestBody Auto a) {
        return ResponseEntity.status(201).body(service.save(a));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Auto> update(@PathVariable Long id,
                                       @RequestBody Auto a) {
        return ResponseEntity.ok(service.update(id, a));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/equipo/{id}")
    public Iterable<Auto> getByEquipo(@PathVariable Long id) {
        return service.getByEquipo(id);
    }

    @GetMapping("/{id}")
    public Auto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Auto update(@PathVariable Long id, @RequestBody Auto a) {
        return service.update(id, a);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}