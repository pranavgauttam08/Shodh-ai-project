package com.shodhcode.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionRequest {
    private Long userId;
    private Long problemId;
    private Long contestId;
    private String code;
    private String language;
}
