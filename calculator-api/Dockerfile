# Use the official Rust image for building
FROM rust:latest as builder

# Create a new empty shell project
WORKDIR /usr/src/calculator-api
COPY Cargo.toml Cargo.lock ./

# Build only the dependencies to cache them
RUN mkdir src && \
    echo "fn main() {println!(\"if you see this, the build broke\")}" > src/main.rs && \
    cargo build --release && \
    rm -f target/release/deps/calculator_api*

# Now copy in the real source code
COPY src ./src

# Build for release
RUN cargo build --release

# Use a minimal alpine image for the runtime
FROM debian:bullseye-slim

# Copy the build artifact from the builder stage
COPY --from=builder /usr/src/calculator-api/target/release/calculator-api /usr/local/bin/

# Expose the port the app runs on
EXPOSE 8080

# Run the binary
CMD ["calculator-api"]