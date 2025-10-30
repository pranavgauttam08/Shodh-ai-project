package com.shodhcode.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeReviewResponse {
    private Long id;
    private Long submissionId;
    private String feedback;
    private String suggestions;
    private String highlights;
    private Integer qualityScore;
}
