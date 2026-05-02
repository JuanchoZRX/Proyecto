package com.example.F1stats;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jdbc.repository.config.EnableJdbcRepositories;

@SpringBootApplication(scanBasePackages = {"controller", "service", "repository", "data"})
@EnableJdbcRepositories(basePackages = "repository")
public class F1stats {

	public static void main(String[] args) {
		SpringApplication.run(F1stats.class, args);
	}

}