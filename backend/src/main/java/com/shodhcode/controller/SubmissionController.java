package com.shodhcode.controller;

import com.shodhcode.dto.SubmissionRequest;
import com.shodhcode.dto.SubmissionResponse;
import com.shodhcode.entity.Submission;
import com.shodhcode.repository.*;
import com.shodhcode.service.JudgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubmissionController {
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final ContestRepository contestRepository;
    private final JudgeService judgeService;

    @PostMapping
    public ResponseEntity<SubmissionResponse> submitCode(@RequestBody SubmissionRequest request) {
        Submission submission = Submission.builder()
                .user(userRepository.findById(request.getUserId()).orElseThrow())
                .problem(problemRepository.findById(request.getProblemId()).orElseThrow())
                .contest(contestRepository.findById(request.getContestId()).orElseThrow())
                .code(request.getCode())
                .language(request.getLanguage() != null ? request.getLanguage() : "JAVA")
                .status(Submission.SubmissionStatus.PENDING)
                .submittedAt(LocalDateTime.now())
                .build();

        submission = submissionRepository.save(submission);
        
        // Judge asynchronously
        new Thread(() -> judgeService.judgeSubmission(submission.getId())).start();

        return ResponseEntity.ok(mapToResponse(submission));
    }

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<List<SubmissionResponse>> getContestSubmissions(@PathVariable Long contestId) {
        List<Submission> submissions = submissionRepository.findByContestIdOrderBySubmittedAtDesc(contestId);
        return ResponseEntity.ok(submissions.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> getSubmission(@PathVariable Long id) {
        return submissionRepository.findById(id)
                .map(s -> ResponseEntity.ok(mapToResponse(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    private SubmissionResponse mapToResponse(Submission submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .userId(submission.getUser().getId())
                .problemId(submission.getProblem().getId())
                .status(submission.getStatus().toString())
                .verdict(submission.getVerdict())
                .output(submission.getOutput())
                .error(submission.getError())
                .executionTime(submission.getExecutionTime())
                .memoryUsed(submission.getMemoryUsed())
                .submittedAt(submission.getSubmittedAt())
                .language(submission.getLanguage())
                .build();
    }
}
