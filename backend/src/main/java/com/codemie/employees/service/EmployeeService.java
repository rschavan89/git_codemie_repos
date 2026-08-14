package com.codemie.employees.service;

import com.codemie.employees.exception.NotFoundException;
import com.codemie.employees.model.Employee;
import com.codemie.employees.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

  private final EmployeeRepository repository;

  public EmployeeService(EmployeeRepository repository) {
    this.repository = repository;
  }

  public Employee create(Employee employee) {
    employee.setId(null);
    return repository.save(employee);
  }

  public List<Employee> list() {
    return repository.findAll();
  }

  public Employee get(long id) {
    return repository.findById(id)
        .orElseThrow(() -> new NotFoundException("Employee not found: " + id));
  }

  public Employee update(long id, Employee input) {
    Employee existing = get(id);
    existing.setName(input.getName());
    existing.setEmail(input.getEmail());
    existing.setDepartment(input.getDepartment());
    existing.setSalary(input.getSalary());
    return repository.save(existing);
  }

  public void delete(long id) {
    Employee existing = get(id);
    repository.delete(existing);
  }
}
