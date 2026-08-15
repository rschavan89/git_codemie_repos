package com.example.employees.dto;

import com.example.employees.model.Employee;
import java.math.BigDecimal;

public class EmployeeResponse {

    private Long id;
    private String name;
    private String email;
    private String department;
    private BigDecimal salary;

    public static EmployeeResponse from(Employee e) {
        EmployeeResponse r = new EmployeeResponse();
        r.id = e.getId();
        r.name = e.getName();
        r.email = e.getEmail();
        r.department = e.getDepartment();
        r.salary = e.getSalary();
        return r;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getDepartment() { return department; }
    public BigDecimal getSalary() { return salary; }
}
