package com.shodhcode.service;

import com.shodhcode.dto.CodeReviewResponse;
import com.shodhcode.entity.CodeReview;
import com.shodhcode.entity.Submission;
import com.shodhcode.repository.CodeReviewRepository;
import com.shodhcode.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodeMentorService {
    private final CodeReviewRepository codeReviewRepository;
    private final SubmissionRepository submissionRepository;

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    public CodeReviewResponse reviewCode(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        try {
            CodeReview review = generateAIReview(submission);
            review = codeReviewRepository.save(review);
            return mapToResponse(review);
        } catch (Exception e) {
            log.error("Error generating code review", e);
            throw new RuntimeException("Failed to generate code review: " + e.getMessage());
        }
    }

    private CodeReview generateAIReview(Submission submission) {
        String prompt = buildReviewPrompt(submission);
        String aiResponse = callAIModel(prompt);
        
        CodeReview review = parseAIResponse(aiResponse, submission);
        return review;
    }

    private String buildReviewPrompt(Submission submission) {
        return String.format(
            "You are an expert code reviewer. Review the following Java code submission for a coding contest problem.\n\n" +
            "Problem: %s\n" +
            "Problem Description: %s\n\n" +
            "Submitted Code:\n```java\n%s\n```\n\n" +
            "Submission Status: %s\n" +
            "Verdict: %s\n\n" +
            "Please provide:\n" +
            "1. FEEDBACK: Overall assessment of the code (2-3 sentences)\n" +
            "2. SUGGESTIONS: Specific improvements (list 2-3 actionable items)\n" +
            "3. HIGHLIGHTS: What the code does well (list 1-2 items)\n" +
            "4. QUALITY_SCORE: Rate the code quality 1-10\n\n" +
            "Format your response exactly as:\n" +
            "FEEDBACK: [your feedback]\n" +
            "SUGGESTIONS: [suggestion 1] | [suggestion 2] | [suggestion 3]\n" +
            "HIGHLIGHTS: [highlight 1] | [highlight 2]\n" +
            "QUALITY_SCORE: [score]",
            submission.getProblem().getTitle(),
            submission.getProblem().getDescription(),
            submission.getCode(),
            submission.getStatus(),
            submission.getVerdict()
        );
    }

    private String callAIModel(String prompt) {
        // In production, use: OpenAiService service = new OpenAiService(openaiApiKey);
        
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            log.warn("OpenAI API key not configured, using mock review");
            return generateMockReview();
        }

        try {
            // TODO: Implement actual OpenAI API call
            // CompletionRequest completionRequest = CompletionRequest.builder()
            //     .model("gpt-3.5-turbo")
            //     .messages(List.of(new ChatMessage(ChatMessageRole.USER.value(), prompt)))
            //     .maxTokens(500)
            //     .build();
            // ChatCompletionResult result = service.createChatCompletion(completionRequest);
            // return result.getChoices().get(0).getMessage().getContent();
            
            return generateMockReview();
        } catch (Exception e) {
            log.error("Error calling AI model", e);
            return generateMockReview();
        }
    }

    private String generateMockReview() {
        return "FEEDBACK: Your solution demonstrates a solid understanding of the problem. The logic is clear and the code is well-structured.\n" +
               "SUGGESTIONS: Consider adding input validation | Optimize the algorithm for better time complexity | Add comments for complex logic\n" +
               "HIGHLIGHTS: Clean and readable code | Efficient use of Java standard library | Proper error handling\n" +
               "QUALITY_SCORE: 8";
    }

    private CodeReview parseAIResponse(String response, Submission submission) {
        String feedback = extractField(response, "FEEDBACK");
        String suggestions = extractField(response, "SUGGESTIONS");
        String highlights = extractField(response, "HIGHLIGHTS");
        int qualityScore = extractScore(response);

        return CodeReview.builder()
                .submission(submission)
                .feedback(feedback)
                .suggestions(suggestions)
                .highlights(highlights)
                .qualityScore(qualityScore)
                .reviewedAt(LocalDateTime.now())
                .build();
    }

    private String extractField(String response, String fieldName) {
        String pattern = fieldName + ":";
        int startIndex = response.indexOf(pattern);
        if (startIndex == -1) return "";

        startIndex += pattern.length();
        int endIndex = response.indexOf("\n", startIndex);
        if (endIndex == -1) endIndex = response.length();

        return response.substring(startIndex, endIndex).trim();
    }

    private int extractScore(String response) {
        String scoreStr = extractField(response, "QUALITY_SCORE");
        try {
            return Integer.parseInt(scoreStr.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return 5;
        }
    }

    private CodeReviewResponse mapToResponse(CodeReview review) {
        return CodeReviewResponse.builder()
                .id(review.getId())
                .submissionId(review.getSubmission().getId())
                .feedback(review.getFeedback())
                .suggestions(review.getSuggestions())
                .highlights(review.getHighlights())
                .qualityScore(review.getQualityScore())
                .build();
    }
}
