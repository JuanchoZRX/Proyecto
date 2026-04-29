package controller;

import org.springframework.web.bind.annotation.*;
import service.ResultadoService;
import data.ResultadoCarrera;

import java.util.List;

@RestController
@RequestMapping("/resultados")
public class ResultadoController {

    private final ResultadoService service;

    public ResultadoController(ResultadoService service){
        this.service = service;
    }

    @GetMapping("/carrera/{id}")
    public List<ResultadoCarrera> getResultadosPorCarrera(@PathVariable Long id){
        return service.getByCarrera(id);
    }
}