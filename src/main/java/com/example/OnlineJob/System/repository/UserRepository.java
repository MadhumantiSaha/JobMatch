package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends  JpaRepository<User, Long>{
//    User findUserByEmail(String email);

    Optional<User> findUserByEmail(String email);
}