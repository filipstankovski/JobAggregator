package mk.ukim.finki.nvd.jobaggregator.service.domain;

import mk.ukim.finki.nvd.jobaggregator.model.domain.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface JobService {
    Optional<Job> findById(Long id);

    Page<Job> findAll(
            String query,
            String location,
            String category,
            LocalDate activeFrom,
            LocalDate activeTo,
            String source,
            Pageable pageable
    );

    List<String> findLocations();

    List<String> findCategories();

    List<String> findSources();

    Job create(Job job);

    Optional<Job> update(Job job);

    Optional<Job> deleteById(Long id);

    int deleteExpiredJobs(LocalDate today);
}
