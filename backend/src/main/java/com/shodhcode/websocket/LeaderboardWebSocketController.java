package com.shodhcode.websocket;

import com.shodhcode.entity.User;
import com.shodhcode.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class LeaderboardWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    @MessageMapping("/subscribe-leaderboard/{contestId}")
    public void subscribeToLeaderboard(@DestinationVariable Long contestId) {
        // Client subscribes to /topic/leaderboard/{contestId}
        broadcastLeaderboard(contestId);
    }

    public void broadcastLeaderboard(Long contestId) {
        List<User> users = userRepository.findAll();
        users.sort((a, b) -> b.getScore().compareTo(a.getScore()));

        List<LeaderboardEntry> entries = users.stream()
                .map(u -> new LeaderboardEntry(u.getId(), u.getUsername(), u.getFullName(), u.getScore(), u.getProblemsSolved()))
                .collect(Collectors.toList());

        messagingTemplate.convertAndSend("/topic/leaderboard/" + contestId, entries);
    }

    @Data
    @AllArgsConstructor
    public static class LeaderboardEntry {
        private Long userId;
        private String username;
        private String fullName;
        private Long score;
        private Integer problemsSolved;
    }
}
