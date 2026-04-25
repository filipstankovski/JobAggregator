package mk.ukim.finki.nvd.jobaggregator.repository;

import mk.ukim.finki.nvd.jobaggregator.model.domain.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
}
