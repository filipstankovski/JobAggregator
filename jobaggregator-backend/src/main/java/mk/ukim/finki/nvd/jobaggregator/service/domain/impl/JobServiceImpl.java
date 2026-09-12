package mk.ukim.finki.nvd.jobaggregator.service.domain.impl;

import mk.ukim.finki.nvd.jobaggregator.model.domain.Job;
import mk.ukim.finki.nvd.jobaggregator.repository.JobRepository;
import mk.ukim.finki.nvd.jobaggregator.service.domain.JobService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    public Page<Job> findAll(
            String query,
            String location,
            String category,
            LocalDate activeFrom,
            LocalDate activeTo,
            String source,
            Pageable pageable
    ) {
        Specification<Job> specification = Specification.unrestricted();
        specification = andIfPresent(specification, containsTitleOrCompany(query));
        specification = andIfPresent(specification, equalsLower("location", location));
        specification = andIfPresent(specification, equalsLower("category", category));
        specification = andIfPresent(specification, equalsLower("source", source));
        specification = andIfPresent(specification, activeUntilFrom(activeFrom));
        specification = andIfPresent(specification, activeUntilTo(activeTo));

        return jobRepository.findAll(specification, pageable);
    }

    @Override
    public List<String> findLocations() {
        return jobRepository.findDistinctLocations();
    }

    @Override
    public List<String> findCategories() {
        return jobRepository.findDistinctCategories();
    }

    @Override
    public List<String> findSources() {
        return jobRepository.findDistinctSources();
    }

    private Specification<Job> containsTitleOrCompany(String value) {
        String pattern = containsPattern(value);
        if (pattern == null) {
            return null;
        }

        return (root, query, criteriaBuilder) -> criteriaBuilder.or(
                criteriaBuilder.like(
                        criteriaBuilder.lower(criteriaBuilder.coalesce(root.get("title"), "")),
                        pattern
                ),
                criteriaBuilder.like(
                        criteriaBuilder.lower(criteriaBuilder.coalesce(root.get("company"), "")),
                        pattern
                )
        );
    }

    private Specification<Job> equalsLower(String field, String value) {
        String cleaned = cleanLower(value);
        if (cleaned == null) {
            return null;
        }

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(criteriaBuilder.lower(root.get(field)), cleaned);
    }

    private Specification<Job> activeUntilFrom(LocalDate activeFrom) {
        if (activeFrom == null) {
            return null;
        }

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("activeUntil"), activeFrom);
    }

    private Specification<Job> activeUntilTo(LocalDate activeTo) {
        if (activeTo == null) {
            return null;
        }

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("activeUntil"), activeTo);
    }

    private String containsPattern(String value) {
        String cleaned = cleanLower(value);
        if (cleaned == null) {
            return null;
        }

        return "%" + cleaned + "%";
    }

    private Specification<Job> andIfPresent(Specification<Job> specification, Specification<Job> nextSpecification) {
        if (nextSpecification == null) {
            return specification;
        }

        return specification.and(nextSpecification);
    }

    private String cleanLower(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim().toLowerCase();
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

    @Override
    @Transactional
    public int deleteExpiredJobs(LocalDate today) {
        return jobRepository.deleteExpiredJobs(today);
    }
}
