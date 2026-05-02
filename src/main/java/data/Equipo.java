package data;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

@Data
@NoArgsConstructor
@Table("equipo")
public class Equipo {

    @Id
    @Column("id")
    private Long id;

    @Column("nombre")
    private String nombre;
}