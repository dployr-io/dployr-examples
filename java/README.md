# Old County Times - Java Edition

This directory contains the java version of the Old County Times newspaper application.

## Requirements

- Java 17 or higher
- Maven 3.6 or higher

## Running the Application

1. Navigate to the java directory:
   ```bash
   cd java
   ```

2. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```

3. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## API Endpoints

- `GET /` - Main newspaper page (HTML)
- `GET /api/newsletter-data` - Newsletter data (JSON)

## Building

To build the application:

```bash
mvn clean package
```

To run the built JAR:

```bash
java -jar target/old-county-times-1.0.0.jar
```
