package data;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

@Data
@NoArgsConstructor
@Table("auto")
public class Auto {
    @Id
    private Long id;
    private String modelo;
    @Column("equipo_id")
    private Long equipoId;
}