package mk.ukim.finki.nvd.jobaggregator.service.domain.impl;

import mk.ukim.finki.nvd.jobaggregator.model.domain.Job;
import mk.ukim.finki.nvd.jobaggregator.repository.JobRepository;
import mk.ukim.finki.nvd.jobaggregator.service.domain.JobService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    public JobServiceImpl(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Override
    public Optional<Job> findById(Long id) {
        return jobRepository.findById(id);
    }

    @Override
    public List<Job> findAll() {
        return jobRepository.findAll();
    }

    @Override
    public Job create(Job job) {
        return jobRepository.save(job);
    }

    @Override
    public Optional<Job> update(Job job) {
        return jobRepository.findById(job.getId()).map(existingJob -> {
            existingJob.setTitle(job.getTitle());
            existingJob.setDescription(job.getDescription());
            existingJob.setCompany(job.getCompany());
            existingJob.setLocation(job.getLocation());
            existingJob.setSource(job.getSource());
            existingJob.setUrl(job.getUrl());
            existingJob.setActiveUntil(job.getActiveUntil());
            existingJob.setCategory(job.getCategory());
            return jobRepository.save(existingJob);
        });
    }

    @Override
    public Optional<Job> deleteById(Long id) {
        Optional<Job> job = jobRepository.findById(id);
       job.ifPresent(jobRepository::delete);
        return job;
    }
}
