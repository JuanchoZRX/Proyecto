package data;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("usuario")
@Data
@NoArgsConstructor
public class Usuario {

    @Id
    private Long id;

    private String username;

    private String password;

    private Role role;

    public enum Role {
        ADMIN,
        USER
    }
}
