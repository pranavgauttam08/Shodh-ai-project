package com.shodhcode.repository;

import com.shodhcode.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByProblemIdAndIsHiddenFalse(Long problemId);
    List<TestCase> findByProblemId(Long problemId);
}
