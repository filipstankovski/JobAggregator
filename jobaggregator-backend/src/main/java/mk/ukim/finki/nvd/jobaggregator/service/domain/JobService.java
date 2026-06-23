package mk.ukim.finki.nvd.jobaggregator.service.domain;

import mk.ukim.finki.nvd.jobaggregator.model.domain.Job;

import java.util.List;
import java.util.Optional;

public interface JobService {
    Optional<Job> findById(Long id);

    List<Job> findAll();

    Job create(Job job);

    Optional<Job> update(Job job);

    Optional<Job> deleteById(Long id);
}
