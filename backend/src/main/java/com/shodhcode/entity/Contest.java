package com.shodhcode.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer totalProblems = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer totalParticipants = 0;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'UPCOMING'")
    private ContestStatus status = ContestStatus.UPCOMING;

    public enum ContestStatus {
        UPCOMING, ONGOING, COMPLETED
    }
}
