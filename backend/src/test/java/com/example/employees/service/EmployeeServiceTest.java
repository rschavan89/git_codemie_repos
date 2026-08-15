package com.example.employees.service;

import com.example.employees.dto.EmployeeRequest;
import com.example.employees.exception.DuplicateEmailException;
import com.example.employees.exception.EmployeeNotFoundException;
import com.example.employees.model.Employee;
import com.example.employees.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmployeeServiceTest {

    @Mock EmployeeRepository repository;
    @InjectMocks EmployeeService service;

    @BeforeEach
    void init() { MockitoAnnotations.openMocks(this); }

    private EmployeeRequest buildRequest(String email) {
        EmployeeRequest req = new EmployeeRequest();
        req.setName("Test User");
        req.setEmail(email);
        req.setDepartment("IT");
        req.setSalary(BigDecimal.valueOf(50000));
        return req;
    }

    @Test
    void findAll_returnsMappedList() {
        Employee e = new Employee("A", "a@x.com", "IT", BigDecimal.valueOf(50000));
        e.setId(1L);
        when(repository.findAll()).thenReturn(List.of(e));

        var result = service.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo("a@x.com");
    }

    @Test
    void findById_found() {
        Employee e = new Employee("B", "b@x.com", "HR", BigDecimal.valueOf(60000));
        e.setId(2L);
        when(repository.findById(2L)).thenReturn(Optional.of(e));

        var result = service.findById(2L);

        assertThat(result.getName()).isEqualTo("B");
    }

    @Test
    void findById_notFound_throws() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
            .isInstanceOf(EmployeeNotFoundException.class);
    }

    @Test
    void create_success() {
        EmployeeRequest req = buildRequest("new@x.com");
        when(repository.findByEmail("new@x.com")).thenReturn(Optional.empty());
        Employee saved = new Employee("Test User", "new@x.com", "IT", BigDecimal.valueOf(50000));
        saved.setId(3L);
        when(repository.save(any())).thenReturn(saved);

        var result = service.create(req);

        assertThat(result.getEmail()).isEqualTo("new@x.com");
    }

    @Test
    void create_duplicateEmail_throws() {
        EmployeeRequest req = buildRequest("dup@x.com");
        when(repository.findByEmail("dup@x.com")).thenReturn(Optional.of(new Employee()));

        assertThatThrownBy(() -> service.create(req))
            .isInstanceOf(DuplicateEmailException.class);
    }

    @Test
    void update_success() {
        Employee existing = new Employee("Old", "old@x.com", "IT", BigDecimal.valueOf(50000));
        existing.setId(4L);
        when(repository.findById(4L)).thenReturn(Optional.of(existing));
        when(repository.existsByEmailAndIdNot("new@x.com", 4L)).thenReturn(false);
        when(repository.save(any())).thenReturn(existing);

        EmployeeRequest req = buildRequest("new@x.com");
        var result = service.update(4L, req);

        assertThat(result).isNotNull();
        verify(repository).save(existing);
    }

    @Test
    void update_notFound_throws() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(99L, buildRequest("x@x.com")))
            .isInstanceOf(EmployeeNotFoundException.class);
    }

    @Test
    void delete_success() {
        when(repository.existsById(5L)).thenReturn(true);

        service.delete(5L);

        verify(repository).deleteById(5L);
    }

    @Test
    void delete_notFound_throws() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(99L))
            .isInstanceOf(EmployeeNotFoundException.class);
    }
}
