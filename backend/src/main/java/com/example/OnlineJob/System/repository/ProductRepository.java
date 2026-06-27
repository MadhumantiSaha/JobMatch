package com.example.OnlineJob.System.repository;

import com.example.OnlineJob.System.model.Job;
import com.example.OnlineJob.System.model.Product;
import com.example.OnlineJob.System.model.User;
import org.hibernate.boot.models.JpaAnnotations;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findProductByUserID(User user);

}
