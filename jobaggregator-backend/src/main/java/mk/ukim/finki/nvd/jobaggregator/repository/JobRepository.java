package mk.ukim.finki.nvd.jobaggregator.repository;

import mk.ukim.finki.nvd.jobaggregator.model.domain.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    @Query("select distinct j.location from Job j where j.location is not null and j.location <> '' order by j.location")
    List<String> findDistinctLocations();

    @Query("select distinct j.category from Job j where j.category is not null and j.category <> '' order by j.category")
    List<String> findDistinctCategories();

    @Query("select distinct j.source from Job j where j.source is not null and j.source <> '' order by j.source")
    List<String> findDistinctSources();

    @Modifying
    @Query("delete from Job j where j.activeUntil is not null and j.activeUntil < :today")
    int deleteExpiredJobs(@Param("today") LocalDate today);
}
