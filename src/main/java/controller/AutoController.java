package controller;

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
    public Auto create(@RequestBody Auto a) {
        return service.save(a);
    }

    @GetMapping("/equipo/{id}")
    public Iterable<Auto> getByEquipo(@PathVariable Long id) {
        return service.getByEquipo(id);
    }
}