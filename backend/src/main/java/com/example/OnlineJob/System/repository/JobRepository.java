package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findJobByRecruiter(User user);

    @Query("""
        SELECT j FROM Job j
        WHERE LOWER(j.postName) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        """)
    List<Job> searchJobs(@Param("keyword") String keyword);

    @Query("""
    SELECT DISTINCT j
    FROM Job j
    JOIN j.skills s
    WHERE s IN :userSkills
      AND j.createdAt >= :since
    ORDER BY j.createdAt DESC
""")
    List<Job> findMatchingJobs(
            @Param("userSkills") Set<String> userSkills,
            @Param("since") LocalDateTime since
    );
}