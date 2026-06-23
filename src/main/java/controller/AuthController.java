package controller;

import service.dto.AuthResponseDTO;
import service.dto.LoginRequestDTO;
import service.dto.RegisterRequestDTO;
import data.Usuario;
import security.JwtUtil;
import service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioService usuarioService,
                          JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO request) {

        Usuario usuario = usuarioService.validarLogin(
                request.getUsername(),
                request.getPassword()
        );

        String token = jwtUtil.generateToken(
                usuario.getUsername(),
                usuario.getRole().name()
        );

        return ResponseEntity.ok(
                new AuthResponseDTO(
                        token,
                        usuario.getUsername(),
                        usuario.getRole().name()
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO request) {

        Usuario creado = usuarioService.registrar(
                request.getUsername(),
                request.getPassword(),
                request.getRole()
        );

        return ResponseEntity.ok(Map.of(
                "id", creado.getId(),
                "username", creado.getUsername(),
                "role", creado.getRole().name()
        ));
    }
}