package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.Premium;
import com.example.OnlineJob.System.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PremiumRepository extends JpaRepository<Premium, Long> {
    Optional<Premium> findByUser(User user);   //used to check if user already has a membership

    List<Premium> findByMembershipStatus(Premium.MembershipStatus status);  //used by the scheduled job to find all active memberships that need to be expired.



}
