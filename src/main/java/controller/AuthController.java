package controller;

import data.Usuario;
import repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginRequest) {

        Optional<Usuario> usuarioOpt =
                usuarioRepository.findByUsername(loginRequest.getUsername());

        //No existe
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        //Password incorrecta
        if (!usuario.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Contraseña incorrecta");
        }

        //Login correcto
        return ResponseEntity.ok(usuario);
    }
}