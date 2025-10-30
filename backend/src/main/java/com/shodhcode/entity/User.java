package com.shodhcode.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;

    @Column(columnDefinition = "BIGINT DEFAULT 0")
    private Long score = 0L;

    @Column(columnDefinition = "INT DEFAULT 0")
    private Integer problemsSolved = 0;
}
