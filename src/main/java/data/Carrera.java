package data;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@Table("carrera")
public class Carrera {

    @Id
    private Long id;

    private String nombre;

    private LocalDate fecha;

    @Column("circuito_id")
    private Long circuitoId;
}