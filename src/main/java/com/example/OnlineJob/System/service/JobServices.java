package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobServices {
    private final JobRepository jobRepository;

    public JobServices(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

//Create job
    public Job addJob(Job job){
        return jobRepository.save(job);
    }
//Get all jobs
    public List<Job> getAllJobs(){
        return jobRepository.findAll();
    }

//    Get all jobs by id
public List<Job> getJobsByUserId(User user) {

    return jobRepository.findJobByUserID(user);
}

//    Update all jobs
    public Job updateJob(Long id, Job  updateJob){
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        if (updateJob.getPostName() != null){
            job.setPostName(updateJob.getPostName());
        }
        if (updateJob.getDescription() != null){
            job.setDescription(updateJob.getDescription());
        }
        if (updateJob.getStart_date() != null) {
            job.setStart_date(updateJob.getStart_date());
        }
        if (updateJob.getSalary() != null) {
            job.setSalary(updateJob.getSalary());
        }
        if (updateJob.getSkills() != null) {
            job.setSkills(updateJob.getSkills());
        }
        return jobRepository.save(job);
    }



//    Delete job
    public String deleteJob(Long id) {
        Job course = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        jobRepository.delete(course);
        return "Job deleted successfully";
    }
}
