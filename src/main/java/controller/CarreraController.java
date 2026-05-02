package controller;

import data.Carrera;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.CarreraService;

import java.util.List;

@RestController
@RequestMapping("/carreras")
public class CarreraController {

    private final CarreraService service;

    public CarreraController(CarreraService service){
        this.service = service;
    }


    @PostMapping
    public ResponseEntity<Carrera> create(@RequestBody Carrera carrera){
        return ResponseEntity.status(201).body(service.create(carrera));
    }


    @GetMapping
    public ResponseEntity<List<Carrera>> getAll(){
        return ResponseEntity.ok(service.getAll());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Carrera> getById(@PathVariable Long id){
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/circuito/{id}")
    public ResponseEntity<List<Carrera>> getByCircuito(@PathVariable Long id){
        List<Carrera> carreras = service.getByCircuito(id);
        if(carreras.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(carreras);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Carrera> update(@PathVariable Long id,
                                          @RequestBody Carrera carrera){
        return ResponseEntity.ok(service.update(id, carrera));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}