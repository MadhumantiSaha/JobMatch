package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findJobByUserID(User user);
//    List<Job> findByPostNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String keyword);

    @Query("""
SELECT j FROM Job j
WHERE LOWER(j.postName) LIKE LOWER(CONCAT('%', :keyword, '%'))
   OR LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%'))
   OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
""")
    List<Job> searchJobs(@Param("keyword") String keyword);
}
