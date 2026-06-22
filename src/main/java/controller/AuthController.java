package controller;

import data.Usuario;
import repository.UsuarioRepository;
import security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepository,
                          JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * POST /auth/login
     * Body: { "username": "admin", "password": "1234" }
     * Response: { "token": "eyJ...", "role": "ADMIN", "username": "admin" }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginRequest) {

        Optional<Usuario> usuarioOpt =
                usuarioRepository.findByUsername(loginRequest.getUsername());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Contraseña incorrecta"));
        }

        String token = jwtUtil.generateToken(
                usuario.getUsername(),
                usuario.getRole().name()
        );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", usuario.getRole().name(),
                "username", usuario.getUsername()
        ));
    }

    /**
     * POST /auth/register  (solo ADMIN puede crear usuarios — protegido en SecurityConfig)
     * Body: { "username": "nuevo", "password": "clave", "role": "USER" }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario nuevoUsuario) {

        if (usuarioRepository.findByUsername(nuevoUsuario.getUsername()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El username ya existe"));
        }

        nuevoUsuario.setPassword(passwordEncoder.encode(nuevoUsuario.getPassword()));
        Usuario guardado = usuarioRepository.save(nuevoUsuario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "id", guardado.getId(),
                        "username", guardado.getUsername(),
                        "role", guardado.getRole().name()
                ));
    }
}