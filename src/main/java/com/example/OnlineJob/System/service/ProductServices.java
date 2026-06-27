package com.example.OnlineJob.System.service;

import com.example.OnlineJob.System.model.Product;
import com.example.OnlineJob.System.model.User;
import com.example.OnlineJob.System.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class ProductServices {
    @Autowired
    private final ProductRepository productRepository;


    public ProductServices(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    private final String uploadDir = "uploads/";

    public Product saveProduct(Product product, MultipartFile file) throws IOException{

        Path path = Paths.get(uploadDir);

        if(!Files.exists(path)){
            Files.createDirectories(path);
        }

        String fileName = file.getOriginalFilename();

        Files.copy(file.getInputStream(),
                path.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING);
        product.setImage(fileName);

        return productRepository.save(product);
    }


    //Get all products
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    //    Get all Product by id
    public List<Product> getProductsId(User user) {
        return productRepository.findProductByUserID(user);
    }

    //    Update all jobs
    public Product updateProduct(Long id, Product  updateProduct){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        if (updateProduct.getName() != null){
            product.setName(updateProduct.getName());
       }
        if (updateProduct.getId() != null){
            product.setId(updateProduct.getId());
        }
        if (updateProduct.getDescription() != null){
            product.setDescription(updateProduct.getDescription());
        }
        if (updateProduct.getPrice() >= 0){
            product.setPrice(updateProduct.getPrice());
        }
        if (updateProduct.getImage() != null){
            product.setImage(updateProduct.getImage());
        }
        if (updateProduct.getUserID() != null){
            product.setUserID(updateProduct.getUserID());
        }
        return productRepository.save(product);
    }



    //    Delete product
    public String deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        productRepository.delete(product);
        return "Product deleted successfully";
    }
}
