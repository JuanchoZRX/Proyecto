package data;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@NoArgsConstructor
@Table("usuario")
public class Usuario {

    @Id
    private Long id;

    private String nombre;

    private String email;
}