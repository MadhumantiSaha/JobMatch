package com.example.OnlineJob.System.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false) // Many products belong to one user
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
//    @JsonBackReference
    private User userID;

    private String name;
    private double price;
    private String image;

    @Column(length = 1000)
    private String description;

}
