package data;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

@Data
@NoArgsConstructor
@Table("resultado_carrera")
public class ResultadoCarrera {
    @Id
    private Long id;
    @Column("carrera_id")
    private Long carreraId;
    @Column("conductor_id")
    private Long conductorId;
    private Integer posicion;
    private Integer puntos;
    private String tiempo;
}