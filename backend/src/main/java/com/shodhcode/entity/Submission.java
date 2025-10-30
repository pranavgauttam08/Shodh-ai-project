package com.shodhcode.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @ManyToOne
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'PENDING'")
    private SubmissionStatus status = SubmissionStatus.PENDING;

    @Column(columnDefinition = "VARCHAR(50)")
    private String verdict;

    @Column(columnDefinition = "TEXT")
    private String output;

    @Column(columnDefinition = "TEXT")
    private String error;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer executionTime = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer memoryUsed = 0;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'JAVA'")
    private String language = "JAVA";

    public enum SubmissionStatus {
        PENDING, JUDGING, ACCEPTED, WRONG_ANSWER, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED, COMPILATION_ERROR
    }
}
