package com.codemie.employees;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.math.BigDecimal;
import java.util.Map;

import static io.restassured.RestAssured.given;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class EmployeeApiTest {

  @LocalServerPort
  int port;

  @BeforeEach
  void setup() {
    RestAssured.baseURI = "http://localhost";
    RestAssured.port = port;
  }

  @Test
  void create_list_get_update_delete_happyPath() {
    // Create
    Long id =
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "name", "Alice",
                "email", "alice@example.com",
                "department", "Engineering",
                "salary", new BigDecimal("1000.00")
            ))
        .when()
            .post("/api/employees")
        .then()
            .statusCode(201)
            .header("Location", Matchers.containsString("/api/employees/"))
            .body("id", Matchers.notNullValue())
            .body("name", Matchers.equalTo("Alice"))
            .body("email", Matchers.equalTo("alice@example.com"))
            .extract()
            .path("id");

    // List contains
    given()
        .when()
        .get("/api/employees")
        .then()
        .statusCode(200)
        .body("id", Matchers.hasItem(id.intValue()));

    // Get
    given()
        .when()
        .get("/api/employees/{id}", id)
        .then()
        .statusCode(200)
        .body("id", Matchers.equalTo(id.intValue()))
        .body("name", Matchers.equalTo("Alice"));

    // Update
    given()
        .contentType(ContentType.JSON)
        .body(Map.of(
            "name", "Alice Updated",
            "email", "alice.updated@example.com",
            "department", "Engineering",
            "salary", new BigDecimal("1500.00")
        ))
        .when()
        .put("/api/employees/{id}", id)
        .then()
        .statusCode(200)
        .body("name", Matchers.equalTo("Alice Updated"))
        .body("email", Matchers.equalTo("alice.updated@example.com"));

    // Delete
    given()
        .when()
        .delete("/api/employees/{id}", id)
        .then()
        .statusCode(204);

    // Get after delete -> 404
    given()
        .when()
        .get("/api/employees/{id}", id)
        .then()
        .statusCode(404)
        .body("error", Matchers.equalTo("NOT_FOUND"));
  }

  @Test
  void validationErrors_create_blankName_and_invalidEmail() {
    given()
        .contentType(ContentType.JSON)
        .body(Map.of(
            "name", " ",
            "email", "not-an-email"
        ))
        .when()
        .post("/api/employees")
        .then()
        .statusCode(400)
        .body("error", Matchers.equalTo("VALIDATION_ERROR"))
        .body("fieldErrors.name", Matchers.notNullValue())
        .body("fieldErrors.email", Matchers.notNullValue());
  }

  @Test
  void notFound_update_delete_get() {
    long missingId = 999999L;

    given()
        .when()
        .get("/api/employees/{id}", missingId)
        .then()
        .statusCode(404)
        .body("error", Matchers.equalTo("NOT_FOUND"))
        .body("message", Matchers.containsString(String.valueOf(missingId)));

    given()
        .contentType(ContentType.JSON)
        .body(Map.of(
            "name", "Bob",
            "email", "bob@example.com"
        ))
        .when()
        .put("/api/employees/{id}", missingId)
        .then()
        .statusCode(404)
        .body("error", Matchers.equalTo("NOT_FOUND"));

    given()
        .when()
        .delete("/api/employees/{id}", missingId)
        .then()
        .statusCode(404)
        .body("error", Matchers.equalTo("NOT_FOUND"));
  }
}
