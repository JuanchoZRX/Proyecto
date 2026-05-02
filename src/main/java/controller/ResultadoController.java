package controller;

import data.ResultadoCarrera;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.ResultadoService;

import java.util.List;

@RestController
@RequestMapping("/resultados")
public class ResultadoController {

    private final ResultadoService service;

    public ResultadoController(ResultadoService service){
        this.service = service;
    }


    @PostMapping
    public ResponseEntity<ResultadoCarrera> create(@RequestBody ResultadoCarrera resultado){
        return ResponseEntity.status(201).body(service.create(resultado));
    }


    @GetMapping
    public ResponseEntity<List<ResultadoCarrera>> getAll(){
        return ResponseEntity.ok(service.getAll());
    }


    @GetMapping("/{id}")
    public ResponseEntity<ResultadoCarrera> getById(@PathVariable Long id){
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/carrera/{id}")
    public ResponseEntity<List<ResultadoCarrera>> getResultadosPorCarrera(@PathVariable Long id){
        return ResponseEntity.ok(service.getByCarrera(id));
    }


    @PutMapping("/{id}")
    public ResponseEntity<ResultadoCarrera> update(@PathVariable Long id,
                                                   @RequestBody ResultadoCarrera resultado){
        return ResponseEntity.ok(service.update(id, resultado));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}