package com.codemie.employees.controller;

import com.codemie.employees.model.Employee;
import com.codemie.employees.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

  private final EmployeeService service;

  public EmployeeController(EmployeeService service) {
    this.service = service;
  }

  @PostMapping
  public ResponseEntity<Employee> create(@Valid @RequestBody Employee employee,
                                         UriComponentsBuilder uriBuilder) {
    Employee created = service.create(employee);
    URI location = uriBuilder.path("/api/employees/{id}").buildAndExpand(created.getId()).toUri();
    return ResponseEntity.created(location).body(created);
  }

  @GetMapping
  public List<Employee> list() {
    return service.list();
  }

  @GetMapping("/{id}")
  public Employee get(@PathVariable long id) {
    return service.get(id);
  }

  @PutMapping("/{id}")
  public Employee update(@PathVariable long id, @Valid @RequestBody Employee employee) {
    return service.update(id, employee);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
