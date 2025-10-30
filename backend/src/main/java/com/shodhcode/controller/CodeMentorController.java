package com.shodhcode.controller;

import com.shodhcode.dto.CodeReviewResponse;
import com.shodhcode.service.CodeMentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/code-mentor")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CodeMentorController {
    private final CodeMentorService codeMentorService;

    @PostMapping("/review/{submissionId}")
    public ResponseEntity<CodeReviewResponse> reviewCode(@PathVariable Long submissionId) {
        return ResponseEntity.ok(codeMentorService.reviewCode(submissionId));
    }
}
