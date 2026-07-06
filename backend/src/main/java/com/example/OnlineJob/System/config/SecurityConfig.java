package com.example.OnlineJob.System.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // Allow CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()

                        // Public endpoints
                        .requestMatchers(
                                "/user",
                                "/user/login",
                                "/user/forget-password",
                                "/user/verify-otp",
                                "/user/reset-password",
                                "/error"
                        ).permitAll()

                        // Job endpoints
                        .requestMatchers(
                                HttpMethod.GET,
                                "/job/**"
                        ).permitAll()

                        .requestMatchers(
                                "/job/jobpost"
                        ).hasRole("job_provider")

                        .requestMatchers(
                                "/job/my-jobs"
                        ).hasRole("job_provider")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/job/**"
                        ).hasRole("job_provider")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/job/**"
                        ).hasRole("job_provider")

                        // Application endpoints
                        .requestMatchers(
                                HttpMethod.POST,
                                "/application/apply/**"
                        ).hasRole("job_seeker")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/application/my-applications"
                        ).hasRole("job_seeker")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/application/job/**"
                        ).hasRole("job_provider")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/application/**"
                        ).hasRole("job_provider")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/application/**"
                        ).hasRole("job_seeker")

                        .anyRequest()
                        .authenticated()
                )
                .exceptionHandling(ex -> ex
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
