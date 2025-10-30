package com.shodhcode.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String inputFormat;

    @Column(columnDefinition = "TEXT")
    private String outputFormat;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'MEDIUM'")
    private String difficulty = "MEDIUM";

    @Column(columnDefinition = "INT DEFAULT 100")
    private Integer points = 100;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer solvedCount = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer attemptCount = 0;
}
