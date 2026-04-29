package service;

import org.springframework.stereotype.Service;
import repository.ResultadoRepository;
import data.ResultadoCarrera;

import java.util.List;

@Service
public class ResultadoService {

    private final ResultadoRepository repo;

    public ResultadoService(ResultadoRepository repo){
        this.repo = repo;
    }

    public List<ResultadoCarrera> getByCarrera(Long carreraId){
        return repo.findByCarrera(carreraId);
    }
}