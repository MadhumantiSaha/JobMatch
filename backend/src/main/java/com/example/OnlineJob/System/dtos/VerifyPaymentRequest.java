package com.example.OnlineJob.System.dtos;

import com.example.OnlineJob.System.model.Premium;
import lombok.Data;

@Data
public class VerifyPaymentRequest {

//    private Premium.Membership membership;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;


    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }
}