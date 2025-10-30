package com.shodhcode.repository;

import com.shodhcode.entity.CodeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CodeReviewRepository extends JpaRepository<CodeReview, Long> {
    Optional<CodeReview> findBySubmissionId(Long submissionId);
}
