package com.shodhcode.websocket;

import com.shodhcode.dto.SubmissionResponse;
import com.shodhcode.entity.Submission;
import com.shodhcode.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class SubmissionWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final SubmissionRepository submissionRepository;

    @MessageMapping("/subscribe-submission/{submissionId}")
    public void subscribeToSubmission(@DestinationVariable Long submissionId) {
        // Client subscribes to /topic/submission/{submissionId}
    }

    public void broadcastSubmissionUpdate(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId).orElse(null);
        if (submission != null) {
            SubmissionResponse response = mapToResponse(submission);
            messagingTemplate.convertAndSend("/topic/submission/" + submissionId, response);
        }
    }

    public void broadcastContestSubmission(Long contestId, SubmissionResponse submission) {
        messagingTemplate.convertAndSend("/topic/contest/" + contestId + "/submissions", submission);
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
