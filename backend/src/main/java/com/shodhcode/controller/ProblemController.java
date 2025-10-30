package com.shodhcode.controller;

import com.shodhcode.entity.Problem;
import com.shodhcode.entity.Submission;
import com.shodhcode.repository.ProblemRepository;
import com.shodhcode.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProblemController {
    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<List<Problem>> getProblemsByContest(@PathVariable Long contestId) {
        return ResponseEntity.ok(problemRepository.findByContestId(contestId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
        return problemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Problem> createProblem(@RequestBody Problem problem) {
        return ResponseEntity.ok(problemRepository.save(problem));
    }

    @GetMapping("/contest/{contestId}/leaderboard")
    public ResponseEntity<?> getContestLeaderboard(@PathVariable Long contestId) {
        try {
            List<Submission> submissions = submissionRepository.findByContestIdOrderBySubmittedAtDesc(contestId);
            
            if (submissions == null || submissions.isEmpty()) {
                return ResponseEntity.ok(List.of()); // Return empty list instead of error
            }
            
            // Group by user and calculate scores
            Map<Long, Map<String, Object>> userScores = new HashMap<>();
            
            for (Submission submission : submissions) {
                if (submission == null || submission.getStatus() == null) {
                    continue;
                }
                
                if (!submission.getStatus().equals(Submission.SubmissionStatus.ACCEPTED)) {
                    continue;
                }
                
                if (submission.getUser() == null || submission.getProblem() == null) {
                    continue;
                }
                
                Long userId = submission.getUser().getId();
                Problem problem = submission.getProblem();
                
                String difficulty = problem.getDifficulty() != null ? problem.getDifficulty() : "MEDIUM";
                
                // Calculate points based on difficulty
                int points = 0;
                if ("EASY".equals(difficulty)) {
                    points = 10;
                } else if ("MEDIUM".equals(difficulty)) {
                    points = 25;
                } else if ("HARD".equals(difficulty)) {
                    points = 50;
                }
                
                // Apply optimization bonus (based on execution time and memory)
                double optimizationBonus = 1.0;
                if (submission.getExecutionTime() != null && submission.getMemoryUsed() != null) {
                    if (submission.getExecutionTime() < 100 && submission.getMemoryUsed() < 50) {
                        optimizationBonus = 1.2; // 20% bonus for highly optimized solutions
                    } else if (submission.getExecutionTime() < 200 && submission.getMemoryUsed() < 100) {
                        optimizationBonus = 1.1; // 10% bonus for optimized solutions
                    }
                }
                
                points = (int) (points * optimizationBonus);
                
                userScores.putIfAbsent(userId, new HashMap<>());
                Map<String, Object> userScore = userScores.get(userId);
                
                userScore.put("userId", userId);
                userScore.put("username", submission.getUser().getUsername());
                userScore.put("totalScore", (int) userScore.getOrDefault("totalScore", 0) + points);
                userScore.put("problemsSolved", (int) userScore.getOrDefault("problemsSolved", 0) + 1);
            }
            
            // Sort by score descending
            List<Map<String, Object>> leaderboard = userScores.values().stream()
                    .sorted((a, b) -> Integer.compare((int) b.get("totalScore"), (int) a.get("totalScore")))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch leaderboard: " + e.getMessage()));
        }
    }
}
