package com.user.foodsuggest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.user.foodsuggest.service.CustomUserDetailsService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                // Remember-me
                .rememberMe(rm -> rm
                        .key("foodsuggestrmkey") // key mã hoá token
                        .tokenValiditySeconds(7 * 24 * 60 * 60)
                        .userDetailsService(userDetailsService))

                // Authorize
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/api/community", "/api/community/**", "/login", "/register", "/health",
                                "/css/**", "/js/**")
                        .permitAll()
                        .anyRequest().authenticated())

                // Form login
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/", true)
                        .permitAll())

                // Logout
                .logout(logout -> logout
                        .logoutSuccessUrl("/login?logout")
                        .deleteCookies("remember-me"))

                // UserDetailsService
                .userDetailsService(userDetailsService);

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
