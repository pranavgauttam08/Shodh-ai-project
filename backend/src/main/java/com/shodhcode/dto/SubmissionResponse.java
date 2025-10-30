package com.shodhcode.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponse {
    private Long id;
    private Long userId;
    private Long problemId;
    private String status;
    private String verdict;
    private String output;
    private String error;
    private Integer executionTime;
    private Integer memoryUsed;
    private LocalDateTime submittedAt;
    private String language;
}
