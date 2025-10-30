package com.shodhcode.controller;

import com.shodhcode.dto.LoginRequest;
import com.shodhcode.dto.SignupRequest;
import com.shodhcode.dto.AuthResponse;
import com.shodhcode.entity.User;
import com.shodhcode.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Username already exists"));
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Email already exists"));
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(request.getPassword()) // In production, hash this password
                .score(0L)
                .problemsSolved(0)
                .build();

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse(
                "User registered successfully",
                "dummy-token-" + savedUser.getId(),
                new UserDTO(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), savedUser.getFullName())
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Invalid username or password"));
        }

        User user = userOpt.get();

        // In production, use proper password hashing and comparison
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Invalid username or password"));
        }

        return ResponseEntity.ok(new AuthResponse(
                "Login successful",
                "dummy-token-" + user.getId(),
                new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getFullName())
        ));
    }

    // Inner classes for request/response
    public static class ErrorResponse {
        public String message;

        public ErrorResponse(String message) {
            this.message = message;
        }
    }

    public static class UserDTO {
        public Long id;
        public String username;
        public String email;
        public String fullName;

        public UserDTO(Long id, String username, String email, String fullName) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.fullName = fullName;
        }
    }
}
