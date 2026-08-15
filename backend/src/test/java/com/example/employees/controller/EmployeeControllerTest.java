package com.example.employees.controller;

import com.example.employees.dto.EmployeeRequest;
import com.example.employees.model.Employee;
import com.example.employees.repository.EmployeeRepository;
import io.restassured.module.mockmvc.RestAssuredMockMvc;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.math.BigDecimal;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class EmployeeControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired EmployeeRepository repository;

    @BeforeEach
    void setup() {
        RestAssuredMockMvc.mockMvc(mockMvc);
        repository.deleteAll();
    }

    // ── CREATE ──────────────────────────────────────────────────────────

    @Test
    @Order(1)
    void createEmployee_happyPath() {
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {"name":"Jane Doe","email":"jane@example.com","department":"Engineering","salary":90000}
                """)
        .when()
            .post("/api/v1/employees")
        .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("name", equalTo("Jane Doe"))
            .body("email", equalTo("jane@example.com"))
            .body("department", equalTo("Engineering"))
            .body("salary", equalTo(90000));
    }

    @Test
    @Order(2)
    void createEmployee_blankName_returns400() {
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {"name":"","email":"jane@example.com","department":"Eng","salary":50000}
                """)
        .when()
            .post("/api/v1/employees")
        .then()
            .statusCode(400)
            .body("status", equalTo(400));
    }

    @Test
    @Order(3)
    void createEmployee_invalidEmail_returns400() {
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {"name":"Jane","email":"not-an-email","department":"Eng","salary":50000}
                """)
        .when()
            .post("/api/v1/employees")
        .then()
            .statusCode(400);
    }

    @Test
    @Order(4)
    void createEmployee_duplicateEmail_returns409() {
        repository.save(new Employee("Existing", "dup@example.com", "IT", BigDecimal.valueOf(60000)));

        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {"name":"New","email":"dup@example.com","department":"IT","salary":60000}
                """)
        .when()
            .post("/api/v1/employees")
        .then()
            .statusCode(409);
    }

    @Test
    @Order(5)
    void createEmployee_zeroSalary_returns400() {
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {"name":"Jane","email":"jane2@example.com","department":"Eng","salary":0}
                """)
        .when()
            .post("/api/v1/employees")
        .then()
            .statusCode(400);
    }

    // ── LIST ────────────────────────────────────────────────────────────

    @Test
    @Order(6)
    void listEmployees_emptyList() {
        get("/api/v1/employees")
        .then()
            .statusCode(200)
            .body("$", hasSize(0));
    }

    @Test
    @Order(7)
    void listEmployees_returnsAll() {
        repository.save(new Employee("Alice", "alice@example.com", "HR", BigDecimal.valueOf(55000)));
        repository.save(new Employee("Bob", "bob@example.com", "IT", BigDecimal.valueOf(70000)));

        get("/api/v1/employees")
        .then()
            .statusCode(200)
            .body("$", hasSize(2))
            .body("name", hasItems("Alice", "Bob"));
    }

    // ── GET BY ID ───────────────────────────────────────────────────────

    @Test
    @Order(8)
    void getById_found() {
        Employee saved = repository.save(new Employee("Carol", "carol@example.com", "Finance", BigDecimal.valueOf(80000)));

        get("/api/v1/employees/" + saved.getId())
        .then()
            .statusCode(200)
            .body("email", equalTo("carol@example.com"));
    }

    @Test
    @Order(9)
    void getById_notFound_returns404() {
        get("/api/v1/employees/99999")
        .then()
            .statusCode(404);
    }

    // ── UPDATE ──────────────────────────────────────────────────────────

    @Test
    @Order(10)
    void updateEmployee_happyPath() {
        Employee saved = repository.save(new Employee("Dave", "dave@example.com", "Sales", BigDecimal.valueOf(65000)));

        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {"name":"Dave Updated","email":"dave@example.com","department":"Marketing","salary":75000}
                """)
        .when()
            .put("/api/v1/employees/" + saved.getId())
        .then()
            .statusCode(200)
            .body("department", equalTo("Marketing"))
            .body("salary", equalTo(75000));
    }

    @Test
    @Order(11)
    void updateEmployee_notFound_returns404() {
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {"name":"X","email":"x@example.com","department":"IT","salary":50000}
                """)
        .when()
            .put("/api/v1/employees/99999")
        .then()
            .statusCode(404);
    }

    // ── DELETE ──────────────────────────────────────────────────────────

    @Test
    @Order(12)
    void deleteEmployee_happyPath() {
        Employee saved = repository.save(new Employee("Eve", "eve@example.com", "QA", BigDecimal.valueOf(60000)));

        delete("/api/v1/employees/" + saved.getId())
        .then()
            .statusCode(204);

        get("/api/v1/employees/" + saved.getId())
        .then()
            .statusCode(404);
    }

    @Test
    @Order(13)
    void deleteEmployee_notFound_returns404() {
        delete("/api/v1/employees/99999")
        .then()
            .statusCode(404);
    }
}
