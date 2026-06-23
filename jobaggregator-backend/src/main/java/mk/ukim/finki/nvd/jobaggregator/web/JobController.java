package mk.ukim.finki.nvd.jobaggregator.web;

import mk.ukim.finki.nvd.jobaggregator.model.domain.Job;
import mk.ukim.finki.nvd.jobaggregator.service.domain.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<Job> findAll() {
        return jobService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> findById(@PathVariable Long id) {
        return jobService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.<Job>notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Job create(@RequestBody Job job) {
        job.setId(null);
        return jobService.create(job);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> update(@PathVariable Long id, @RequestBody Job job) {
        job.setId(id);
        return jobService.update(job)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.<Job>notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return jobService.deleteById(id)
                .map(deletedJob -> ResponseEntity.noContent().<Void>build())
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
