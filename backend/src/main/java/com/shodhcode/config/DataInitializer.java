package com.shodhcode.config;

import com.shodhcode.entity.*;
import com.shodhcode.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final ContestRepository contestRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        User user1 = User.builder()
                .username("alice")
                .email("alice@example.com")
                .password("pass123")
                .fullName("Alice Johnson")
                .score(0L)
                .problemsSolved(0)
                .build();

        User user2 = User.builder()
                .username("bob")
                .email("bob@example.com")
                .password("pass123")
                .fullName("Bob Smith")
                .score(0L)
                .problemsSolved(0)
                .build();

        userRepository.save(user1);
        userRepository.save(user2);

        // Create sample contest
        Contest contest = Contest.builder()
                .title("Shodh-a-Code Challenge 2025")
                .description("A competitive programming contest to test your coding skills")
                .startTime(LocalDateTime.now().minusHours(1))
                .endTime(LocalDateTime.now().plusHours(3))
                .status(Contest.ContestStatus.ONGOING)
                .totalProblems(2)
                .totalParticipants(2)
                .build();

        contest = contestRepository.save(contest);

        // Problem 1: Sum of Two Numbers
        Problem problem1 = Problem.builder()
                .contest(contest)
                .title("Sum of Two Numbers")
                .description("Given two integers, return their sum.")
                .inputFormat("Two space-separated integers a and b")
                .outputFormat("A single integer representing the sum")
                .constraints("1 <= a, b <= 1000")
                .difficulty("EASY")
                .points(100)
                .solvedCount(0)
                .attemptCount(0)
                .build();

        problem1 = problemRepository.save(problem1);

        TestCase tc1_1 = TestCase.builder()
                .problem(problem1)
                .input("5 3")
                .expectedOutput("8")
                .isHidden(false)
                .build();

        TestCase tc1_2 = TestCase.builder()
                .problem(problem1)
                .input("10 20")
                .expectedOutput("30")
                .isHidden(false)
                .build();

        testCaseRepository.save(tc1_1);
        testCaseRepository.save(tc1_2);

        // Problem 2: Reverse a String
        Problem problem2 = Problem.builder()
                .contest(contest)
                .title("Reverse a String")
                .description("Given a string, return it reversed.")
                .inputFormat("A single string")
                .outputFormat("The reversed string")
                .constraints("1 <= length <= 100")
                .difficulty("MEDIUM")
                .points(150)
                .solvedCount(0)
                .attemptCount(0)
                .build();

        problem2 = problemRepository.save(problem2);

        TestCase tc2_1 = TestCase.builder()
                .problem(problem2)
                .input("hello")
                .expectedOutput("olleh")
                .isHidden(false)
                .build();

        TestCase tc2_2 = TestCase.builder()
                .problem(problem2)
                .input("java")
                .expectedOutput("avaj")
                .isHidden(false)
                .build();

        testCaseRepository.save(tc2_1);
        testCaseRepository.save(tc2_2);

        Contest dsContest = Contest.builder()
                .title("Data Structures Bootcamp")
                .description("Master fundamental data structures through hands-on coding challenges")
                .startTime(LocalDateTime.now().minusHours(2))
                .endTime(LocalDateTime.now().plusHours(4))
                .status(Contest.ContestStatus.ONGOING)
                .totalProblems(3)
                .totalParticipants(2)
                .build();

        dsContest = contestRepository.save(dsContest);

        // DS Problem 1: Array Sum
        Problem dsProblem1 = Problem.builder()
                .contest(dsContest)
                .title("Array Sum")
                .description("Given an array of integers, return the sum of all elements.")
                .inputFormat("First line: n (size of array), Second line: n space-separated integers")
                .outputFormat("A single integer representing the sum")
                .constraints("1 <= n <= 1000, -1000 <= arr[i] <= 1000")
                .difficulty("EASY")
                .points(100)
                .solvedCount(0)
                .attemptCount(0)
                .build();

        dsProblem1 = problemRepository.save(dsProblem1);

        TestCase dsTC1_1 = TestCase.builder()
                .problem(dsProblem1)
                .input("3\n1 2 3")
                .expectedOutput("6")
                .isHidden(false)
                .build();

        TestCase dsTC1_2 = TestCase.builder()
                .problem(dsProblem1)
                .input("5\n10 20 30 40 50")
                .expectedOutput("150")
                .isHidden(false)
                .build();

        testCaseRepository.save(dsTC1_1);
        testCaseRepository.save(dsTC1_2);

        // DS Problem 2: Linked List Reversal
        Problem dsProblem2 = Problem.builder()
                .contest(dsContest)
                .title("Linked List Reversal")
                .description("Reverse a singly linked list.")
                .inputFormat("Linked list nodes")
                .outputFormat("Reversed linked list")
                .constraints("1 <= n <= 1000")
                .difficulty("MEDIUM")
                .points(150)
                .solvedCount(0)
                .attemptCount(0)
                .build();

        dsProblem2 = problemRepository.save(dsProblem2);

        TestCase dsTC2_1 = TestCase.builder()
                .problem(dsProblem2)
                .input("1->2->3->NULL")
                .expectedOutput("3->2->1->NULL")
                .isHidden(false)
                .build();

        testCaseRepository.save(dsTC2_1);

        // DS Problem 3: Binary Tree Traversal
        Problem dsProblem3 = Problem.builder()
                .contest(dsContest)
                .title("Binary Tree Traversal")
                .description("Perform in-order traversal of a binary tree.")
                .inputFormat("Binary tree structure")
                .outputFormat("In-order traversal result")
                .constraints("1 <= n <= 1000")
                .difficulty("HARD")
                .points(200)
                .solvedCount(0)
                .attemptCount(0)
                .build();

        dsProblem3 = problemRepository.save(dsProblem3);

        TestCase dsTC3_1 = TestCase.builder()
                .problem(dsProblem3)
                .input("1 2 3")
                .expectedOutput("2 1 3")
                .isHidden(false)
                .build();

        testCaseRepository.save(dsTC3_1);
    }
}
