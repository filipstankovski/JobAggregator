package mk.ukim.finki.nvd.jobaggregator.config;

import mk.ukim.finki.nvd.jobaggregator.model.domain.Job;
import mk.ukim.finki.nvd.jobaggregator.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedJobs(JobRepository jobRepository) {
        return args -> {
            if (jobRepository.count() > 0) {
                return;
            }

            Job backendJob = new Job();
            backendJob.setTitle("Java Backend Developer");
            backendJob.setCompany("NetBuild");
            backendJob.setLocation("Skopje");
            backendJob.setDescription("Build and maintain Spring Boot services, PostgreSQL integrations, and REST APIs.");
            backendJob.setSource("LinkedIn");
            backendJob.setUrl("https://example.com/jobs/java-backend-developer");
            backendJob.setActiveUntil("2026-05-31");
            backendJob.setCategory("Backend Development");

            Job frontendJob = new Job();
            frontendJob.setTitle("Frontend Engineer");
            frontendJob.setCompany("PixelForge");
            frontendJob.setLocation("Remote");
            frontendJob.setDescription("Develop responsive UI features and collaborate with backend teams on API integration.");
            frontendJob.setSource("Indeed");
            frontendJob.setUrl("https://example.com/jobs/frontend-engineer");
            frontendJob.setActiveUntil("2026-06-15");
            frontendJob.setCategory("Frontend Development");

            jobRepository.save(backendJob);
            jobRepository.save(frontendJob);
        };
    }
}
