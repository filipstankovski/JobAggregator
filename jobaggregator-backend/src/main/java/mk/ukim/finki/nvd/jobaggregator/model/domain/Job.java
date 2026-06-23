package mk.ukim.finki.nvd.jobaggregator.model.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String location;

    @Column(length = 3000)
    private String description;

    private String source;
    @Column(unique = true)
    private String url;
    private LocalDate activeUntil;
    private String category;
}
