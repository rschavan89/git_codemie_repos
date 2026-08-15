package com.example.employees.exception;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String email) {
        super("Employee already exists with email: " + email);
    }
}
