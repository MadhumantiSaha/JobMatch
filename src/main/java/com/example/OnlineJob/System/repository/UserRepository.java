package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends  JpaRepository<User, Long>{
    User findUserByEmail(String email);
}