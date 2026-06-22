package service;

import data.Usuario;
import repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario buscarPorUsername(String username) {
        return usuarioRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));
    }
}