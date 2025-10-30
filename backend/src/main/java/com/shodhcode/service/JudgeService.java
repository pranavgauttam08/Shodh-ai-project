package com.shodhcode.service;

import com.shodhcode.dto.SubmissionResponse;
import com.shodhcode.entity.*;
import com.shodhcode.repository.*;
import com.shodhcode.websocket.LeaderboardWebSocketController;
import com.shodhcode.websocket.SubmissionWebSocketController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class JudgeService {
    private final SubmissionRepository submissionRepository;
    private final TestCaseRepository testCaseRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final SubmissionWebSocketController submissionWebSocket;
    private final LeaderboardWebSocketController leaderboardWebSocket;

    public SubmissionResponse judgeSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setStatus(Submission.SubmissionStatus.JUDGING);
        submissionRepository.save(submission);
        submissionWebSocket.broadcastSubmissionUpdate(submissionId);

        try {
            JudgeResult result = executeCode(submission);
            updateSubmissionWithResult(submission, result);
        } catch (Exception e) {
            log.error("Error judging submission", e);
            submission.setStatus(Submission.SubmissionStatus.RUNTIME_ERROR);
            submission.setError(e.getMessage());
        }

        submission = submissionRepository.save(submission);
        
        submissionWebSocket.broadcastSubmissionUpdate(submissionId);
        submissionWebSocket.broadcastContestSubmission(submission.getContest().getId(), mapToResponse(submission));
        leaderboardWebSocket.broadcastLeaderboard(submission.getContest().getId());

        return mapToResponse(submission);
    }

    private JudgeResult executeCode(Submission submission) throws Exception {
        Problem problem = submission.getProblem();
        List<TestCase> testCases = testCaseRepository.findByProblemIdAndIsHiddenFalse(problem.getId());

        JudgeResult result = new JudgeResult();
        result.setTotalTests(testCases.size());
        result.setPassedTests(0);

        for (TestCase testCase : testCases) {
            try {
                String output = runCode(submission.getCode(), testCase.getInput(), submission.getLanguage());
                String expected = testCase.getExpectedOutput().trim();
                String actual = output.trim();

                if (expected.equals(actual)) {
                    result.setPassedTests(result.getPassedTests() + 1);
                } else {
                    result.setVerdict("WRONG_ANSWER");
                    result.setOutput(actual);
                    result.setExpectedOutput(expected);
                    break;
                }
            } catch (TimeoutException e) {
                result.setVerdict("TIME_LIMIT_EXCEEDED");
                break;
            } catch (Exception e) {
                result.setVerdict("RUNTIME_ERROR");
                result.setError(e.getMessage());
                break;
            }
        }

        if (result.getPassedTests() == testCases.size()) {
            result.setVerdict("ACCEPTED");
        }

        return result;
    }

    private String runCode(String code, String input, String language) throws Exception {
        Path tempDir = Files.createTempDirectory("judge_");
        try {
            String fileName = "Solution.java";
            Path sourceFile = tempDir.resolve(fileName);
            Files.write(sourceFile, code.getBytes());

            // Compile
            ProcessBuilder compileBuilder = new ProcessBuilder("javac", sourceFile.toString());
            compileBuilder.directory(tempDir.toFile());
            Process compileProcess = compileBuilder.start();
            
            if (!compileProcess.waitFor(5, TimeUnit.SECONDS)) {
                compileProcess.destroyForcibly();
                throw new TimeoutException("Compilation timeout");
            }

            if (compileProcess.exitValue() != 0) {
                String error = new String(compileProcess.getErrorStream().readAllBytes());
                throw new RuntimeException("Compilation error: " + error);
            }

            // Execute
            ProcessBuilder runBuilder = new ProcessBuilder("java", "-cp", tempDir.toString(), "Solution");
            runBuilder.directory(tempDir.toFile());
            Process runProcess = runBuilder.start();

            // Write input
            try (OutputStream os = runProcess.getOutputStream()) {
                os.write(input.getBytes());
                os.flush();
            }

            // Read output with timeout
            StringBuilder output = new StringBuilder();
            if (runProcess.waitFor(2, TimeUnit.SECONDS)) {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(runProcess.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        output.append(line).append("\n");
                    }
                }
            } else {
                runProcess.destroyForcibly();
                throw new TimeoutException("Execution timeout");
            }

            return output.toString();
        } finally {
            // Cleanup
            Files.walk(tempDir)
                    .sorted(Comparator.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            log.warn("Failed to delete temp file: " + path);
                        }
                    });
        }
    }

    private void updateSubmissionWithResult(Submission submission, JudgeResult result) {
        submission.setVerdict(result.getVerdict());
        submission.setOutput(result.getOutput());
        submission.setError(result.getError());
        submission.setStatus(Submission.SubmissionStatus.valueOf(result.getVerdict()));

        if ("ACCEPTED".equals(result.getVerdict())) {
            Problem problem = submission.getProblem();
            problem.setSolvedCount(problem.getSolvedCount() + 1);
            problemRepository.save(problem);

            User user = submission.getUser();
            user.setScore(user.getScore() + problem.getPoints());
            user.setProblemsSolved(user.getProblemsSolved() + 1);
            userRepository.save(user);
        }
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

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    private static class JudgeResult {
        private String verdict = "PENDING";
        private String output;
        private String expectedOutput;
        private String error;
        private Integer totalTests = 0;
        private Integer passedTests = 0;
    }
}
