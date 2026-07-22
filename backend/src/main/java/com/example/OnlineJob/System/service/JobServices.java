package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.repository.JobRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

//    Get all jobs by User id
public List<Job> getJobsByUserId(User user) {
    return jobRepository.findJobByUserID(user);
}

//   Get all jobs by job id
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

//    Update all jobs
    public Job updateJob(Job  updateJob){
        Job job = jobRepository.findById(updateJob.getId())
                .orElseThrow(() -> new RuntimeException("Job not found for the user"));
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

//    Filter jobs
//    public List<Job> searchJobs(String Bangalore) {
//        return jobRepository
//                .findByPostNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
//                        Bangalore
//                );
//    }
    public List<Job> searchJobs(String keyword) {
        return jobRepository.searchJobs(keyword);
    }

//    Pagination
    public Page<Job> getJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        return jobRepository.findAll(pageable);
    }
}
