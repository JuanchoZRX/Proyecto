package security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import service.UsuarioService;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitar CSRF (no aplica en APIs REST stateless)
                .csrf(csrf -> csrf.disable())

                // Configuración CORS para el Frontend
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Sin sesiones — JWT es stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // Login es público
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("/auth/register").permitAll()

                        // GETs son accesibles para USER y ADMIN
                        .requestMatchers(HttpMethod.GET, "/equipos/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/conductores/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/autos/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/circuitos/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/carreras/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/resultados/**").hasAnyRole("USER", "ADMIN")

                        // Escritura solo para ADMIN
                        .requestMatchers(HttpMethod.POST, "/equipos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/equipos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/equipos/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/conductores/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/conductores/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/conductores/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/autos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/autos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/autos/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/circuitos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/circuitos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/circuitos/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/carreras/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/carreras/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/carreras/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/resultados/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,  "/resultados/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/resultados/**").hasRole("ADMIN")

                        // Cualquier otra cosa requiere autenticación
                        .anyRequest().authenticated()
                )

                // Agregar el filtro JWT antes del filtro de autenticación estándar
                .addFilterBefore(jwtFilter, AuthorizationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // En producción: poner el dominio del frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService(UsuarioService usuarioService) {
        return username -> usuarioService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }
}