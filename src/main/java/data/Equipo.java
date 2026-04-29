package data;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@NoArgsConstructor
@Table("equipo")
public class Equipo {

    @Id
    private Long id;

    private String nombre;
}