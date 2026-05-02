package controller;

import data.Circuito;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.CircuitoService;

import java.util.List;

@RestController
@RequestMapping("/circuitos")
public class CircuitoController {

    private final CircuitoService service;

    public CircuitoController(CircuitoService service){
        this.service = service;
    }


    @PostMapping
    public ResponseEntity<Circuito> create(@RequestBody Circuito circuito){
        return ResponseEntity.status(201).body(service.create(circuito));
    }


    @GetMapping
    public ResponseEntity<List<Circuito>> getAll(){
        return ResponseEntity.ok(service.getAll());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Circuito> getById(@PathVariable Long id){
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public ResponseEntity<Circuito> update(@PathVariable Long id,
                                           @RequestBody Circuito circuito){
        return ResponseEntity.ok(service.update(id, circuito));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}