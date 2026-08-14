package com.codemie.employees.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

@Entity
@Table(name = "employee")
public class Employee {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "name must not be blank")
  @Column(nullable = false)
  private String name;

  @NotBlank(message = "email must not be blank")
  @Email(message = "email must be a well-formed email address")
  @Column(nullable = false)
  private String email;

  @Column
  private String department;

  @Column(precision = 19, scale = 2)
  private BigDecimal salary;

  public Employee() {
  }

  public Employee(Long id, String name, String email, String department, BigDecimal salary) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.department = department;
    this.salary = salary;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getDepartment() {
    return department;
  }

  public void setDepartment(String department) {
    this.department = department;
  }

  public BigDecimal getSalary() {
    return salary;
  }

  public void setSalary(BigDecimal salary) {
    this.salary = salary;
  }
}
