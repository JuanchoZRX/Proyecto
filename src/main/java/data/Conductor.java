package data;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

@Data
@NoArgsConstructor
@Table("conductor")
public class Conductor {

    @Id
    private Long id;
    private String nombre;
    @Column("equipo_id")
    private Long equipoId;
}