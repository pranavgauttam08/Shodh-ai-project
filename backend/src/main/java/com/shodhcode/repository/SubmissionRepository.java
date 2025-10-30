package com.shodhcode.repository;

import com.shodhcode.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByContestIdOrderBySubmittedAtDesc(Long contestId);
    List<Submission> findByUserIdAndContestId(Long userId, Long contestId);
    List<Submission> findByProblemIdOrderBySubmittedAtDesc(Long problemId);
}
